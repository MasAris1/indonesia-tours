import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: payouts } = await locals.supabase
		.from('payouts')
		.select(`
			id, gross_amount, commission_rate, commission_fee, net_amount, payout_status,
			requested_at, authorized_at, released_at,
			partner:partner_profiles(id, company_name, bank_name, bank_account_no, bank_account_name),
			booking:bookings(booking_code, total_price, status)
		`)
		.order('requested_at', { ascending: false });

	const normalized = (payouts || []).map((p: any) => {
		const part = Array.isArray(p.partner) ? p.partner[0] : p.partner;
		const book = Array.isArray(p.booking) ? p.booking[0] : p.booking;
		return {
			...p,
			partner: part || null,
			booking: book || null
		};
	});

	return {
		payouts: normalized
	};
};

export const actions: Actions = {
	authorizePayout: async ({ request, locals }) => {
		const formData = await request.formData();
		const payoutId = formData.get('payout_id')?.toString();

		if (!payoutId) return fail(400, { message: 'ID Payout tidak valid' });

		const { data, error } = await locals.supabase.rpc('authorize_payout', {
			p_payout_id: payoutId
		});

		if (error || !data?.success) {
			return fail(500, { message: data?.message || error?.message || 'Gagal menyetujui payout' });
		}

		return { success: true, message: 'Permohonan payout berhasil DISETUJUI (AUTHORIZED)!' };
	},

	releasePayout: async ({ request, locals }) => {
		const formData = await request.formData();
		const payoutId = formData.get('payout_id')?.toString();

		if (!payoutId) return fail(400, { message: 'ID Payout tidak valid' });

		const { data, error } = await locals.supabase.rpc('release_payout', {
			p_payout_id: payoutId
		});

		if (error || !data?.success) {
			return fail(500, { message: data?.message || error?.message || 'Gagal merilis payout' });
		}

		return { success: true, message: 'Dana rekber berhasil DIRILIS ke rekening mitra (RELEASED)!' };
	}
};

