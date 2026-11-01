import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Get all bookings
	const { data: bookings } = await locals.supabase
		.from('bookings')
		.select(`
			id, booking_code, total_price, pax_count, status, booking_status, created_date, contact_name,
			schedule:tour_schedules(departure_date, tour:tours(title, partner:partner_profiles(company_name)))
		`)
		.order('created_date', { ascending: false });

	const allBooks = (bookings || []).map((b: any) => {
		const sched = Array.isArray(b.schedule) ? b.schedule[0] : b.schedule;
		const tour = Array.isArray(sched?.tour) ? sched?.tour[0] : sched?.tour;
		const partner = Array.isArray(tour?.partner) ? tour?.partner[0] : tour?.partner;
		return {
			...b,
			status: b.booking_status || b.status,
			schedule: sched ? {
				departure_date: sched.departure_date,
				tour: tour ? {
					title: tour.title,
					partner: partner ? { company_name: partner.company_name } : null
				} : null
			} : null
		};
	});

	const paidBooks = allBooks.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED' || b.status === 'CONFIRMED');

	const totalGMV = paidBooks.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
	const totalPlatformRevenue = Math.round(totalGMV * 0.1); // 10% platform take-rate
	const totalPaxSold = paidBooks.reduce((acc, b) => acc + Number(b.pax_count || 0), 0);

	// 2. Get partners
	const { data: partners } = await locals.supabase
		.from('partner_profiles')
		.select('*')
		.order('created_date', { ascending: false });

	const allPartners = partners || [];
	const verifiedPartners = allPartners.filter((p) => p.verification_status === 'VERIFIED');
	const pendingPartners = allPartners.filter((p) => p.verification_status === 'PENDING');

	// 3. Get tours
	const { count: totalTours } = await locals.supabase
		.from('tours')
		.select('*', { count: 'exact', head: true })
		.eq('is_deleted', 0);

	// 4. Get pending payouts
	const { data: pendingPayouts } = await locals.supabase
		.from('payouts')
		.select(`
			id, gross_amount, net_amount, commission_fee, payout_status, requested_at,
			partner:partner_profiles(company_name, bank_name, bank_account_no)
		`)
		.eq('payout_status', 'REQUESTED')
		.order('requested_at', { ascending: false });

	const normalizedPendingPayouts = (pendingPayouts || []).map((p: any) => {
		const part = Array.isArray(p.partner) ? p.partner[0] : p.partner;
		return {
			...p,
			partner: part || null
		};
	});

	return {
		metrics: {
			totalGMV,
			totalPlatformRevenue,
			totalPaxSold,
			totalOrders: allBooks.length,
			totalPaidOrders: paidBooks.length,
			totalPartners: allPartners.length,
			verifiedPartners: verifiedPartners.length,
			pendingPartners: pendingPartners.length,
			totalTours: totalTours || 0
		},
		recentBookings: allBooks.slice(0, 6),
		pendingPayouts: normalizedPendingPayouts
	};
};
