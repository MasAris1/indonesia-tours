import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next');

	if (code) {
		const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error && data.user) {
			const { data: profile } = await locals.supabase
				.from('profiles')
				.select('role')
				.eq('id', data.user.id)
				.maybeSingle();

			if (profile?.role === 'admin') {
				throw redirect(303, next && next.startsWith('/admin') ? next : '/admin/dashboard');
			}
			if (profile?.role === 'partner') {
				throw redirect(303, next && next.startsWith('/mitra') ? next : '/mitra/dashboard');
			}
			throw redirect(303, next || '/');
		}
		console.error('Error exchanging OAuth code for session:', error);
	}

	throw redirect(303, '/masuk?error=auth_callback_failed');
};
