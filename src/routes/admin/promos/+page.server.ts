import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: promos } = await locals.supabase
		.from('promos')
		.select('*')
		.eq('is_deleted', 0)
		.order('created_date', { ascending: false });

	return {
		promos: promos || []
	};
};

export const actions: Actions = {
	createPromo: async ({ request, locals }) => {
		const formData = await request.formData();
		const code = formData.get('code')?.toString().trim().toUpperCase();
		const description = formData.get('description')?.toString().trim();
		const discountType = formData.get('discount_type')?.toString();
		const discountValue = Number(formData.get('discount_value') || 0);
		const minSpend = Number(formData.get('min_spend') || 0);
		const quota = Number(formData.get('quota') || 50);

		if (!code || !discountType || discountValue <= 0) {
			return fail(400, { message: 'Kode, Tipe Diskon, dan Nilai Diskon wajib diisi' });
		}

		const { error } = await locals.supabase.from('promos').insert({
			code,
			description: description || `Voucher ${code}`,
			discount_type: discountType,
			discount_value: discountValue,
			min_spend: minSpend,
			quota,
			is_active: true
		});

		if (error) {
			return fail(500, { message: 'Gagal membuat kode promo: ' + error.message });
		}

		return { success: true, message: `Kode promo ${code} berhasil dibuat dan aktif!` };
	},

	togglePromoStatus: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const currentStatus = formData.get('is_active') === 'true';

		if (!id) return fail(400, { message: 'ID Promo tidak valid' });

		const { error } = await locals.supabase
			.from('promos')
			.update({
				is_active: !currentStatus,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', id);

		if (error) {
			return fail(500, { message: 'Gagal mengubah status: ' + error.message });
		}

		return { success: true, message: 'Status promo berhasil diubah' };
	}
};

