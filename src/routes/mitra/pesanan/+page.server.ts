import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals, url }) => {
	const { partner } = await parent();
	if (!partner) return { bookings: [], statusFilter: 'ALL' };

	const statusFilter = url.searchParams.get('status') || 'ALL';

	// 1. Get tour IDs
	const { data: tours } = await locals.supabase
		.from('tours')
		.select('id, title')
		.eq('partner_id', partner.id);

	const tourIds = tours?.map((t) => t.id) || [];
	if (tourIds.length === 0) return { bookings: [], statusFilter };

	// 2. Get schedule IDs
	const { data: schedules } = await locals.supabase
		.from('tour_schedules')
		.select('id, tour_id, departure_date')
		.in('tour_id', tourIds);

	const scheduleIds = schedules?.map((s) => s.id) || [];
	if (scheduleIds.length === 0) return { bookings: [], statusFilter };

	// 3. Query bookings
	let query = locals.supabase
		.from('bookings')
		.select(`
			id, booking_code, pax_count, total_price, status, booking_status, contact_name, contact_phone, contact_email, created_date,
			schedule:tour_schedules(departure_date, return_date, tour:tours(title, destination))
		`)
		.in('schedule_id', scheduleIds)
		.order('created_date', { ascending: false });

	if (statusFilter !== 'ALL') {
		query = query.or(`booking_status.eq.${statusFilter},status.eq.${statusFilter}`);
	}

	const { data: bookings } = await query;

	const normalized = (bookings || []).map((b: any) => {
		const sched = Array.isArray(b.schedule) ? b.schedule[0] : b.schedule;
		const tour = Array.isArray(sched?.tour) ? sched?.tour[0] : sched?.tour;
		return {
			...b,
			status: b.booking_status || b.status,
			schedule: sched ? {
				departure_date: sched.departure_date,
				return_date: sched.return_date,
				tour: tour ? {
					title: tour.title,
					destination: tour.destination
				} : null
			} : null
		};
	});

	return {
		bookings: normalized,
		statusFilter
	};
};
