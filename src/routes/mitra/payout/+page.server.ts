import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { partner } = await parent();
	if (!partner) return { eligibleBookings: [], payouts: [], commissionRate: 10 };

	// 1. Get tour IDs
	const { data: tours } = await locals.supabase
		.from('tours')
		.select('id, title')
		.eq('partner_id', partner.id);

	const tourIds = tours?.map((t) => t.id) || [];

	let eligibleBookings: any[] = [];
	if (tourIds.length > 0) {
		const { data: schedules } = await locals.supabase
			.from('tour_schedules')
			.select('id')
			.in('tour_id', tourIds);

		const scheduleIds = schedules?.map((s) => s.id) || [];
		if (scheduleIds.length > 0) {
			// Find all paid bookings
			const { data: paidBooks } = await locals.supabase
				.from('bookings')
				.select(`
					id, booking_code, total_price, pax_count, status, booking_status, created_date,
					schedule:tour_schedules(departure_date, tour:tours(title))
				`)
				.in('schedule_id', scheduleIds)
				.in('booking_status', ['PAID', 'COMPLETED', 'CONFIRMED']);

			// Filter out bookings that already have a payout record
			const { data: existingPayouts } = await locals.supabase
				.from('payouts')
				.select('booking_id')
				.eq('partner_id', partner.id);

			const payoutBookingIds = new Set(existingPayouts?.map((p) => p.booking_id) || []);
			
			const mappedPaid = (paidBooks || []).map((b: any) => {
				const sched = Array.isArray(b.schedule) ? b.schedule[0] : b.schedule;
				const tour = Array.isArray(sched?.tour) ? sched?.tour[0] : sched?.tour;
				return {
					...b,
					schedule: sched ? {
						departure_date: sched.departure_date,
						tour: tour ? { title: tour.title } : null
					} : null
				};
			});

			eligibleBookings = mappedPaid.filter((b) => !payoutBookingIds.has(b.id));
		}
	}

	// 2. Get existing payouts
	const { data: payouts } = await locals.supabase
		.from('payouts')
		.select(`
			id, booking_id, gross_amount, commission_rate, commission_fee, net_amount, payout_status,
			requested_at, authorized_at, released_at,
			booking:bookings(booking_code, schedule:tour_schedules(tour:tours(title)))
		`)
		.eq('partner_id', partner.id)
		.order('requested_at', { ascending: false });

	const mappedPayouts = (payouts || []).map((p: any) => {
		const book = Array.isArray(p.booking) ? p.booking[0] : p.booking;
		return {
			...p,
			booking: book || null
		};
	});

	return {
		eligibleBookings,
		payouts: mappedPayouts,
		commissionRate: partner.commission_rate || 10
	};
};

export const actions: Actions = {
	claimPayout: async ({ request, locals }) => {
		const formData = await request.formData();
		const bookingId = formData.get('booking_id')?.toString();

		if (!bookingId) {
			return fail(400, { message: 'ID Booking tidak valid' });
		}

		// Call database RPC request_payout
		const { data, error } = await locals.supabase.rpc('request_payout', {
			p_booking_id: bookingId
		});

		if (error || !data?.success) {
			return fail(500, { message: data?.message || error?.message || 'Gagal mengajukan klaim payout' });
		}

		return {
			success: true,
			message: `Klaim pencairan berhasil diajukan! Net Payout: Rp ${Number(data.net_amount).toLocaleString('id-ID')} (Setelah komisi platform ${data.commission_fee ? '10%' : ''})`
		};
	}
};
