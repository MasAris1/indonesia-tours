import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) {
		throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const profile = locals.profile;

	// Fetch partner profile for this user
	let { data: partner } = await locals.supabase
		.from('partner_profiles')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	// If admin viewing portal without partner profile, attach to seeded partner for preview
	if (!partner && profile?.role === 'admin') {
		const { data: firstPartner } = await locals.supabase
			.from('partner_profiles')
			.select('*')
			.limit(1)
			.single();
		partner = firstPartner;
	}

	if (!partner && url.pathname !== '/mitra/daftar') {
		throw redirect(303, '/mitra/daftar');
	}

	return {
		partner,
		profile
	};
};

