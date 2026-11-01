import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) {
		throw redirect(303, '/masuk?redirectTo=/akun');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.maybeSingle();

	// Check if this user is also registered as partner
	const { data: partnerProfile } = await locals.supabase
		.from('partner_profiles')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	// Get user's bookings stats
	const { data: bookings } = await locals.supabase
		.from('bookings')
		.select('id, status, total_price')
		.eq('user_id', user.id);

	const totalTrips = bookings?.length || 0;
	const activeTrips = bookings?.filter((b) => b.status === 'PAID').length || 0;

	return {
		profile,
		partnerProfile,
		stats: {
			totalTrips,
			activeTrips
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Silakan masuk terlebih dahulu' });

		const formData = await request.formData();
		const fullName = formData.get('full_name')?.toString().trim();
		const phone = formData.get('phone')?.toString().trim();

		const { error } = await locals.supabase
			.from('profiles')
			.update({
				full_name: fullName,
				phone,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', user.id);

		if (error) {
			return fail(500, { message: 'Gagal memperbarui profil: ' + error.message });
		}

		return { success: true, message: 'Profil Anda berhasil diperbarui!' };
	},

	// Demo switch role helper for easy testing of Fase 3 features
	switchRoleDemo: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Silakan masuk terlebih dahulu' });

		const formData = await request.formData();
		const rawRole = formData.get('role')?.toString();

		if (!rawRole || !['customer', 'partner', 'admin'].includes(rawRole)) {
			return fail(400, { message: 'Role tidak valid' });
		}
		const targetRole = rawRole as 'customer' | 'partner' | 'admin';

		const { error } = await locals.supabase
			.from('profiles')
			.update({
				role: targetRole,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', user.id);

		if (error) {
			return fail(500, { message: 'Gagal mengubah role: ' + error.message });
		}

		// If switched to partner, ensure a partner_profile exists for this user
		if (targetRole === 'partner') {
			const { data: existing } = await locals.supabase
				.from('partner_profiles')
				.select('id')
				.eq('user_id', user.id)
				.maybeSingle();

			if (!existing) {
				await locals.supabase.from('partner_profiles').insert({
					user_id: user.id,
					company_name: 'Mitra Tour ' + (user.email?.split('@')[0] || 'Indo'),
					nib: '912000' + Math.floor(1000000 + Math.random() * 9000000),
					hpi_license: 'HPI-2026-' + Math.floor(100 + Math.random() * 900),
					city: 'Indonesia',
					verification_status: 'VERIFIED',
					commission_rate: 10.0
				});
			}
		}

		return { success: true, message: `Role berhasil diubah menjadi: ${targetRole.toUpperCase()}` };
	}
};
