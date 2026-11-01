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

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (session && user) {
		const { data: profile } = await locals.supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.maybeSingle();

		if (profile?.role === 'admin') {
			throw redirect(303, '/admin/dashboard');
		}
		if (profile?.role === 'partner') {
			throw redirect(303, '/mitra/dashboard');
		}
		throw redirect(303, '/');
	}
	const isDev = process.env.NODE_ENV !== 'production';
	return { isDev };
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const formData = await request.formData();
		const fullName = formData.get('full_name')?.toString()?.trim();
		const email = formData.get('email')?.toString()?.trim();
		const password = formData.get('password')?.toString();

		if (!fullName || !email || !password) {
			return fail(400, { message: 'Harap lengkapi seluruh formulir' });
		}

		if (password.length < 6) {
			return fail(400, { message: 'Kata sandi minimal 6 karakter' });
		}

		const serviceRoleKey = getServiceRoleKey();

		// Opsi 2: Jika SUPABASE_SERVICE_ROLE_KEY tersedia di .env, buat & konfirmasi user langsung via Admin API
		if (serviceRoleKey) {
			const adminClient = createClient(PUBLIC_SUPABASE_URL, serviceRoleKey, {
				auth: { autoRefreshToken: false, persistSession: false }
			});

			const { error: createError } = await adminClient.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
				user_metadata: {
					full_name: fullName
				}
			});

			if (createError) {
				return fail(400, { message: createError.message });
			}

			const { error: signInError } = await locals.supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) {
				return fail(400, { message: signInError.message });
			}

			throw redirect(303, '/');
		}

		// Opsi 1: Gunakan signUp standar (otomatis membuat sesi aktif ketika "Confirm email" OFF di Dashboard Supabase)
		const { data: signUpData, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName
				}
			}
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		// Jika signUp belum mengembalikan session, coba login langsung dengan signInWithPassword
		if (!signUpData.session) {
			const { data: signInData, error: signInError } =
				await locals.supabase.auth.signInWithPassword({
					email,
					password
				});

			if (signInError || !signInData.session) {
				return fail(400, {
					message:
						'Pengaturan "Confirm email" di Supabase masih ON. Buka Dashboard Supabase > Authentication > Sign In / Providers > Email: biarkan "Enable Email provider" tetap ON, lalu matikan hanya toggle "Confirm email" di bawahnya (atau isi SUPABASE_SERVICE_ROLE_KEY di file .env).'
				});
			}
		}

		throw redirect(303, '/');
	},

	google: async ({ locals, url }) => {
		const callbackUrl = `${url.origin}/auth/callback`;

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: callbackUrl
			}
		});

		if (error || !data.url) {
			return fail(400, {
				message:
					'Gagal menginisiasi pendaftaran Google: ' + (error?.message || 'URL auth tidak tersedia')
			});
		}

		throw redirect(303, data.url, { external: true });
	}
};
