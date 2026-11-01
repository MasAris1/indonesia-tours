import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: partners } = await locals.supabase
		.from('partner_profiles')
		.select('*')
		.order('created_date', { ascending: false });

	return {
		partners: partners || []
	};
};

export const actions: Actions = {
	verifyPartner: async ({ request, locals }) => {
		const formData = await request.formData();
		const partnerId = formData.get('partner_id')?.toString();
		const status = formData.get('status')?.toString();
		const commissionRate = Number(formData.get('commission_rate') || 10);

		if (!partnerId || !status) {
			return fail(400, { message: 'ID Mitra dan Status verifikasi wajib dipilih' });
		}

		// Call database RPC verify_partner
		const { data, error } = await locals.supabase.rpc('verify_partner', {
			p_partner_id: partnerId,
			p_status: status,
			p_commission: commissionRate
		});

		if (error || !data?.success) {
			return fail(500, { message: data?.message || error?.message || 'Gagal mengubah status mitra' });
		}

		return {
			success: true,
			message: `Status mitra berhasil diperbarui menjadi ${status} (Komisi: ${commissionRate}%)`
		};
	}
};

