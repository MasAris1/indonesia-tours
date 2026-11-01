import fs from 'node:fs';
import { fail, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$lib/supabase';
import type { Actions, PageServerLoad } from './$types';

function getServiceRoleKey(): string {
	if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
		return process.env.SUPABASE_SERVICE_ROLE_KEY.trim();
	}
	try {
		const envContent = fs.readFileSync('.env', 'utf8');
		const match = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m);
		if (match?.[1]?.trim()) {
			return match[1].trim().replace(/^["']|["']$/g, '');
		}
	} catch {
		// Ignore if .env file is not readable
	}
	return '';
}

async function resolveRoleDestination(
	supabase: App.Locals['supabase'],
	userId: string,
	redirectTo: string | null
): Promise<string> {
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', userId)
		.maybeSingle();

	const role = profile?.role;
	if (role === 'admin') {
		return redirectTo && redirectTo.startsWith('/admin') ? redirectTo : '/admin/dashboard';
	}
	if (role === 'partner') {
		return redirectTo && redirectTo.startsWith('/mitra') ? redirectTo : '/mitra/dashboard';
	}
	return redirectTo || '/';
}

async function tryAutoConfirmEmail(email: string): Promise<boolean> {
	const serviceRoleKey = getServiceRoleKey();
	if (!serviceRoleKey) return false;

	try {
		const adminClient = createClient(PUBLIC_SUPABASE_URL, serviceRoleKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
		const { data: listData } = await adminClient.auth.admin.listUsers();
		const targetUser = listData?.users?.find(
			(u) => u.email?.toLowerCase() === email.toLowerCase()
		);
		if (targetUser) {
			const { error } = await adminClient.auth.admin.updateUserById(targetUser.id, {
				email_confirm: true
			});
			return !error;
		}
	} catch (err) {
		console.error('Auto-confirm email via service role failed:', err);
	}
	return false;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (session && user) {
		const redirectTo = url.searchParams.get('redirectTo');
		const destination = await resolveRoleDestination(locals.supabase, user.id, redirectTo);
		throw redirect(303, destination);
	}
	const isDev = process.env.NODE_ENV !== 'production';
	return { isDev };
};

export const actions: Actions = {
	login: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString()?.trim();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { message: 'Email dan password wajib diisi' });
		}

		let { data: signInData, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		// Handle unconfirmed email if Confirm Email is still enabled in Supabase
		if (
			error &&
			(error.code === 'email_not_confirmed' ||
				error.message?.toLowerCase().includes('email not confirmed'))
		) {
			const confirmed = await tryAutoConfirmEmail(email);
			if (confirmed) {
				const retry = await locals.supabase.auth.signInWithPassword({ email, password });
				signInData = retry.data;
				error = retry.error;
			} else {
				return fail(400, {
					message:
						'Email akun belum terverifikasi di Supabase. Buka Dashboard Supabase > Authentication > Sign In / Providers > Email: pastikan "Enable Email provider" tetap ON dan matikan hanya toggle "Confirm email" (atau isi SUPABASE_SERVICE_ROLE_KEY di .env).'
				});
			}
		}

		if (error || !signInData.user) {
			return fail(400, { message: 'Email atau kata sandi tidak valid' });
		}

		const redirectTo = url.searchParams.get('redirectTo');
		const destination = await resolveRoleDestination(
			locals.supabase,
			signInData.user.id,
			redirectTo
		);
		throw redirect(303, destination);
	},

	google: async ({ locals, url }) => {
		const redirectTo = url.searchParams.get('redirectTo');
		const callbackUrl = redirectTo
			? `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
			: `${url.origin}/auth/callback`;

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: callbackUrl
			}
		});

		if (error || !data.url) {
			return fail(400, {
				message: 'Gagal menginisiasi login Google: ' + (error?.message || 'URL auth tidak tersedia')
			});
		}

		throw redirect(303, data.url, { external: true });
	}
};
