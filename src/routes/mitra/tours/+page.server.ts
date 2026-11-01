import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { partner } = await parent();
	if (!partner) return { tours: [] };

	// Get tours with their schedules
	const { data: tours } = await locals.supabase
		.from('tours')
		.select(`
			id, title, slug, destination, price, status, is_deleted, cover_image_url,
			schedules:tour_schedules(id, departure_date, return_date, quota_total, quota_booked, status)
		`)
		.eq('partner_id', partner.id)
		.eq('is_deleted', 0)
		.order('created_date', { ascending: false });

	return {
		tours: tours || []
	};
};

export const actions: Actions = {
	addSchedule: async ({ request, locals }) => {
		const formData = await request.formData();
		const tourId = formData.get('tour_id')?.toString();
		const departureDate = formData.get('departure_date')?.toString();
		const returnDate = formData.get('return_date')?.toString();
		const quotaTotal = Number(formData.get('quota_total') || 12);

		if (!tourId || !departureDate || !returnDate) {
			return fail(400, { message: 'Semua kolom jadwal wajib diisi' });
		}

		const { error } = await locals.supabase.from('tour_schedules').insert({
			tour_id: tourId,
			departure_date: departureDate,
			return_date: returnDate,
			quota_total: quotaTotal,
			quota_booked: 0,
			status: 1
		});

		if (error) {
			return fail(500, { message: 'Gagal menambah jadwal: ' + error.message });
		}

		return { success: true, message: 'Jadwal keberangkatan baru berhasil ditambahkan!' };
	}
};

