import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const userId = user?.id || 'a0000000-0000-0000-0000-000000000001';

	const { data: bookings, error: rpcError } = await locals.supabase.rpc('get_user_bookings', {
		p_user_id: userId
	});

	if (rpcError) {
		console.error('get_user_bookings error:', rpcError);
	}

	return {
		bookings: bookings || []
	};
};

