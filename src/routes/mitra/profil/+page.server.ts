import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { partner } = await parent();
	return { partner };
};

export const actions: Actions = {
	updateLegalProfile: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Silakan masuk terlebih dahulu' });

		const { data: partner } = await locals.supabase
			.from('partner_profiles')
			.select('id')
			.eq('user_id', user.id)
			.maybeSingle();

		if (!partner && locals.profile?.role !== 'admin') {
			return fail(401, { message: 'Akses mitra diperlukan' });
		}

		const formData = await request.formData();
		const companyName = formData.get('company_name')?.toString().trim();
		const city = formData.get('city')?.toString().trim();
		const bankName = formData.get('bank_name')?.toString().trim();
		const bankAccountNo = formData.get('bank_account_no')?.toString().trim();
		const bankAccountName = formData.get('bank_account_name')?.toString().trim();

		const targetId = partner?.id || formData.get('partner_id')?.toString();
		if (!targetId) return fail(400, { message: 'Mitra tidak ditemukan' });

		const { error } = await locals.supabase
			.from('partner_profiles')
			.update({
				company_name: companyName,
				city,
				bank_name: bankName,
				bank_account_no: bankAccountNo,
				bank_account_name: bankAccountName,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', targetId);

		if (error) {
			return fail(500, { message: 'Gagal memperbarui data: ' + error.message });
		}

		return { success: true, message: 'Data legalitas dan rekening bank berhasil diperbarui!' };
	}
};

