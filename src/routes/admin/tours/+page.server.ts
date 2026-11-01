import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: tours } = await locals.supabase
		.from('tours')
		.select(`
			id, title, slug, destination, price, status, is_deleted, cover_image_url, created_date,
			partner:partner_profiles(company_name, verification_status)
		`)
		.eq('is_deleted', 0)
		.order('created_date', { ascending: false });

	const normalized = (tours || []).map((t: any) => {
		const part = Array.isArray(t.partner) ? t.partner[0] : t.partner;
		return {
			...t,
			partner: part || null
		};
	});

	return {
		tours: normalized
	};
};

export const actions: Actions = {
	toggleTourStatus: async ({ request, locals }) => {
		const formData = await request.formData();
		const tourId = formData.get('tour_id')?.toString();
		const currentStatus = Number(formData.get('status') || 1);
		const newStatus = currentStatus === 1 ? 0 : 1;

		if (!tourId) return fail(400, { message: 'ID Tur tidak valid' });

		const { error } = await locals.supabase
			.from('tours')
			.update({
				status: newStatus,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', tourId);

		if (error) {
			return fail(500, { message: 'Gagal mengubah status tur: ' + error.message });
		}

		return {
			success: true,
			message: `Status tur berhasil diubah menjadi: ${newStatus === 1 ? 'AKTIF TAYANG' : 'DINONAKTIFKAN'}`
		};
	}
};

