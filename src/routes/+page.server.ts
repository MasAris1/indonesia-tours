import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const destinationQuery = url.searchParams.get('destinasi') || '';
	const tripTypeQuery = url.searchParams.get('type') || '';
	const onlyAvailable = url.searchParams.get('available') === 'true';

	let query = locals.supabase
		.from('tours')
		.select(`
			id,
			title,
			slug,
			destination,
			region,
			trip_type,
			duration_days,
			duration_nights,
			summary,
			description,
			price,
			cover_image_url,
			rating_avg,
			rating_count,
			partner:partner_profiles (
				company_name,
				city,
				verification_status
			),
			schedules:tour_schedules (
				id,
				departure_date,
				return_date,
				quota_total,
				quota_booked,
				departure_status
			)
		`)
		.eq('is_deleted', 0)
		.eq('status', 1);

	if (destinationQuery) {
		query = query.ilike('destination', `%${destinationQuery}%`);
	}

	if (tripTypeQuery && (tripTypeQuery === 'OPEN' || tripTypeQuery === 'PRIVATE')) {
		query = query.eq('trip_type', tripTypeQuery);
	}

	const { data: tours, error } = await query.order('rating_avg', { ascending: false });

	if (error) {
		console.error('Error fetching tours:', error);
	}

	// Format next schedule for each tour
	const formattedTours = (tours || []).map((t) => {
		const futureSchedules = (t.schedules || [])
			.filter((s: { departure_date: string }) => new Date(s.departure_date) > new Date('2026-10-13'))
			.sort(
				(a: { departure_date: string }, b: { departure_date: string }) =>
					new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
			);

		return {
			...t,
			partner: Array.isArray(t.partner) ? t.partner[0] : t.partner,
			nextSchedule: futureSchedules[0] || (t.schedules && t.schedules[0]) || null,
			allSchedules: futureSchedules
		};
	});

	return {
		tours: formattedTours,
		selectedDestination: destinationQuery,
		selectedType: tripTypeQuery
	};
};

