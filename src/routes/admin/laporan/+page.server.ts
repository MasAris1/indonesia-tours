import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Query all bookings with complete relations for the ledger
	const { data: bookings } = await locals.supabase
		.from('bookings')
		.select(`
			id, booking_code, pax_count, total_price, status, booking_status, created_date, contact_name, contact_phone,
			schedule:tour_schedules(departure_date, return_date, tour:tours(title, destination, partner:partner_profiles(company_name, commission_rate)))
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
				return_date: sched.return_date,
				tour: tour ? {
					title: tour.title,
					destination: tour.destination,
					partner: partner ? {
						company_name: partner.company_name,
						commission_rate: partner.commission_rate
					} : null
				} : null
			} : null
		};
	});

	const paidBooks = allBooks.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED' || b.status === 'CONFIRMED');

	const totalGMV = paidBooks.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
	const totalCommission = Math.round(totalGMV * 0.1);
	const totalNetToPartners = totalGMV - totalCommission;

	return {
		bookings: allBooks,
		summary: {
			totalGMV,
			totalCommission,
			totalNetToPartners,
			totalPax: paidBooks.reduce((acc, b) => acc + Number(b.pax_count || 0), 0),
			totalTransactions: paidBooks.length
		}
	};
};
