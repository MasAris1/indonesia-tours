import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) {
		throw redirect(303, '/masuk?redirectTo=/mitra/daftar');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.maybeSingle();

	// If already partner, redirect to dashboard
	if (profile?.role === 'partner' || profile?.role === 'admin') {
		throw redirect(303, '/mitra/dashboard');
	}

	const { data: existingPartner } = await locals.supabase
		.from('partner_profiles')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	return {
		profile,
		existingPartner
	};
};

export const actions: Actions = {
	registerPartner: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Silakan masuk terlebih dahulu' });

		const formData = await request.formData();
		const companyName = formData.get('company_name')?.toString().trim();
		const city = formData.get('city')?.toString().trim();
		const nib = formData.get('nib')?.toString().trim();
		const hpiLicense = formData.get('hpi_license')?.toString().trim();
		const bankName = formData.get('bank_name')?.toString().trim();
		const bankAccountNo = formData.get('bank_account_no')?.toString().trim();
		const bankAccountName = formData.get('bank_account_name')?.toString().trim();

		if (!companyName || !nib || !bankAccountNo) {
			return fail(400, { message: 'Nama Perusahaan/Operator, NIB, dan Rekening Bank wajib diisi' });
		}

		// Insert or update partner profile
		const { error: partnerErr } = await locals.supabase
			.from('partner_profiles')
			.upsert({
				user_id: user.id,
				company_name: companyName,
				city: city || 'Indonesia',
				nib,
				hpi_license: hpiLicense || null,
				bank_name: bankName || 'BCA',
				bank_account_no: bankAccountNo,
				bank_account_name: bankAccountName || companyName,
				verification_status: 'VERIFIED', // Auto-verified for frictionless demo testing
				commission_rate: 10.0,
				last_updated_date: new Date().toISOString()
			}, { onConflict: 'user_id' });

		if (partnerErr) {
			return fail(500, { message: 'Gagal mendaftarkan mitra: ' + partnerErr.message });
		}

		// Upgrade user role to partner
		await locals.supabase
			.from('profiles')
			.update({
				role: 'partner',
				last_updated_date: new Date().toISOString()
			})
			.eq('id', user.id);

		throw redirect(303, '/mitra/dashboard?registered=true');
	}
};

