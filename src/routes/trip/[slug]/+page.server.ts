import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	const { data: tour, error: tourError } = await locals.supabase
		.from('tours')
		.select(`
			*,
			partner:partner_profiles (
				id,
				company_name,
				city,
				verification_status,
				nib,
				hpi_license
			),
			schedules:tour_schedules (
				id,
				departure_date,
				return_date,
				quota_total,
				quota_booked,
				min_pax,
				price_override,
				departure_status,
				wa_group_url
			),
			reviews (
				id,
				reviewer_name,
				reviewer_city,
				rating,
				comment,
				created_at
			)
		`)
		.eq('slug', slug)
		.eq('is_deleted', 0)
		.eq('status', 1)
		.single();

	if (tourError || !tour) {
		throw error(404, 'Paket trip tidak ditemukan');
	}

	// Filter and sort upcoming schedules
	const upcomingSchedules = (tour.schedules || [])
		.filter((s: { departure_date: string }) => new Date(s.departure_date) > new Date('2026-10-13'))
		.sort(
			(a: { departure_date: string }, b: { departure_date: string }) =>
				new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
		);

	return {
		tour: {
			...tour,
			partner: Array.isArray(tour.partner) ? tour.partner[0] : tour.partner,
			schedules: upcomingSchedules
		}
	};
};

export const actions: Actions = {
	book: async ({ request, locals }) => {
		const formData = await request.formData();
		const scheduleId = formData.get('schedule_id')?.toString();
		const paxCount = parseInt(formData.get('pax_count')?.toString() || '1', 10);
		const contactName = formData.get('contact_name')?.toString()?.trim();
		const contactPhone = formData.get('contact_phone')?.toString()?.trim();
		const contactEmail = formData.get('contact_email')?.toString()?.trim();

		if (!scheduleId || !contactName || !contactPhone || !contactEmail) {
			return fail(400, { message: 'Harap lengkapi seluruh data pemesan' });
		}

		if (isNaN(paxCount) || paxCount < 1 || paxCount > 10) {
			return fail(400, { message: 'Jumlah peserta minimal 1 dan maksimal 10 orang' });
		}

		// Check user session or use verified demo user
		let userId = locals.user?.id;
		if (!userId) {
			// Demo / default user fallback for seamless testing
			userId = 'a0000000-0000-0000-0000-000000000001';
		}

		// Call atomic book_seats RPC
		const { data: booking, error: rpcError } = await locals.supabase.rpc('book_seats', {
			p_user_id: userId,
			p_schedule_id: scheduleId,
			p_pax: paxCount,
			p_contact_name: contactName,
			p_contact_phone: contactPhone,
			p_contact_email: contactEmail
		});

		if (rpcError) {
			console.error('RPC book_seats error:', rpcError);
			if (rpcError.message.includes('QUOTA_UNAVAILABLE')) {
				return fail(400, { message: 'Maaf, sisa kursi pada jadwal ini sudah tidak mencukupi' });
			}
			return fail(500, { message: `Gagal memesan kursi: ${rpcError.message}` });
		}

		if (!booking || !booking.booking_code) {
			return fail(500, { message: 'Terjadi kesalahan sistem saat memproses pemesanan' });
		}

		throw redirect(303, `/checkout/${booking.booking_code}`);
	}
};

