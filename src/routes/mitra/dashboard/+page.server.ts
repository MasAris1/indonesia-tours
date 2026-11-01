import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { partner } = await parent();
	if (!partner) return {};

	// 1. Get tours managed by this partner
	const { data: tours } = await locals.supabase
		.from('tours')
		.select('id, title, slug, price, cover_image_url, destination')
		.eq('partner_id', partner.id)
		.eq('is_deleted', 0);

	const tourIds = tours?.map((t) => t.id) || [];

	// 2. Get schedules
	let schedules: any[] = [];
	if (tourIds.length > 0) {
		const { data: schedData } = await locals.supabase
			.from('tour_schedules')
			.select('id, tour_id, departure_date, return_date, quota_total, quota_booked, status')
			.in('tour_id', tourIds)
			.eq('is_deleted', 0);
		schedules = schedData || [];
	}

	const scheduleIds = schedules.map((s) => s.id);

	// 3. Get bookings for these schedules
	let bookings: any[] = [];
	if (scheduleIds.length > 0) {
		const { data: bookData } = await locals.supabase
			.from('bookings')
			.select(`
				id, booking_code, pax_count, total_price, status, booking_status, created_date,
				schedule:tour_schedules(departure_date, tour:tours(title))
			`)
			.in('schedule_id', scheduleIds)
			.order('created_date', { ascending: false });
		bookings = (bookData || []).map((b: any) => ({
			...b,
			status: b.booking_status || b.status
		}));
	}

	// 4. Get payouts for this partner
	const { data: payouts } = await locals.supabase
		.from('payouts')
		.select('*')
		.eq('partner_id', partner.id);

	// Calculate metrics
	const totalTours = tours?.length || 0;
	const totalSeatsBooked = schedules.reduce((acc, s) => acc + (s.quota_booked || 0), 0);
	const paidBookings = bookings.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED' || b.status === 'CONFIRMED');
	
	// Escrow amount: total paid bookings not yet released in payouts
	const totalGrossPaid = paidBookings.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
	const totalReleasedPayouts = payouts?.filter((p) => p.payout_status === 'RELEASED')
		.reduce((acc, p) => acc + Number(p.net_amount || 0), 0) || 0;
	const pendingEscrow = Math.max(0, totalGrossPaid - totalReleasedPayouts);

	return {
		tours: tours || [],
		schedules,
		recentBookings: bookings.slice(0, 5),
		metrics: {
			totalTours,
			totalSeatsBooked,
			totalOrders: bookings.length,
			totalGrossPaid,
			pendingEscrow,
			totalReleasedPayouts
		}
	};
};
