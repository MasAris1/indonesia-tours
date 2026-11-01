import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) {
		throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const profile = locals.profile;
	if (profile?.role !== 'admin') {
		throw redirect(303, '/?error=unauthorized_admin');
	}

	// Fetch quick counts for badges
	const { count: pendingPartners } = await locals.supabase
		.from('partner_profiles')
		.select('*', { count: 'exact', head: true })
		.eq('verification_status', 'PENDING');

	const { count: pendingPayouts } = await locals.supabase
		.from('payouts')
		.select('*', { count: 'exact', head: true })
		.eq('payout_status', 'REQUESTED');

	return {
		profile,
		counts: {
			pendingPartners: pendingPartners || 0,
			pendingPayouts: pendingPayouts || 0
		}
	};
};

