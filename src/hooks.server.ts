import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$lib/supabase';
import type { UserProfile } from './app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handle = async ({ event, resolve }: any) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return { session: null, user: null };
		}
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return { session, user };
	};

	const path = event.url.pathname;

	// Handle OAuth PKCE code if Supabase redirected to Site URL root instead of /auth/callback
	const oauthCode = event.url.searchParams.get('code');
	if (oauthCode && path !== '/auth/callback') {
		const { data: exchangeData, error: exchangeError } =
			await event.locals.supabase.auth.exchangeCodeForSession(oauthCode);
		if (!exchangeError && exchangeData.user) {
			const { data: oauthProfile } = await event.locals.supabase
				.from('profiles')
				.select('role')
				.eq('id', exchangeData.user.id)
				.maybeSingle();

			if (oauthProfile?.role === 'admin') {
				throw redirect(303, '/admin/dashboard');
			}
			if (oauthProfile?.role === 'partner') {
				throw redirect(303, '/mitra/dashboard');
			}
			throw redirect(303, '/');
		}
	}

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// Load user profile & role if logged in
	let profile: UserProfile | null = null;
	if (user) {
		const { data } = await event.locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.maybeSingle();
		profile = data as UserProfile | null;
	}
	event.locals.profile = profile;

	// Protected routes
	if (path === '/pesanan' && !user) {
		throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(path + event.url.search)}`);
	}

	if (path.startsWith('/akun') && !user) {
		throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(path + event.url.search)}`);
	}

	// Route guard for Mitra Portal (/mitra)
	if (path.startsWith('/mitra')) {
		if (!user) {
			throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(path)}&notice=mitra_login_required`);
		}
		// Allow mitra/daftar or allow partner & admin
		if (path !== '/mitra/daftar' && profile?.role !== 'partner' && profile?.role !== 'admin') {
			throw redirect(303, `/mitra/daftar?notice=need_partner_account`);
		}
	}

	// Route guard for Back-Office Admin (/admin)
	if (path.startsWith('/admin')) {
		if (!user) {
			throw redirect(303, `/masuk?redirectTo=${encodeURIComponent(path)}&notice=admin_login_required`);
		}
		if (profile?.role !== 'admin') {
			throw redirect(303, `/?error=unauthorized_admin`);
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
