<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		Compass,
		LogIn,
		UserPlus,
		Lock,
		Mail,
		AlertCircle,
		Shield,
		User,
		Building2
	} from '@lucide/svelte';

	// Determine active mode from current URL path (/masuk vs /daftar)
	let isRegister = $derived(page.url.pathname.startsWith('/daftar'));

	// Sign In form state
	let loginEmail = $state('');
	let loginPassword = $state('');

	// Create Account form state
	let fullName = $state('');
	let registerEmail = $state('');
	let registerPassword = $state('');

	let isDev = $derived(Boolean(page.data?.isDev));
	let formMessage = $derived(page.form?.message as string | undefined);

	let authError = $derived(
		page.url.searchParams.get('error') === 'auth_callback_failed'
			? 'Autentikasi Google gagal atau dibatalkan. Silakan coba kembali.'
			: null
	);

	let querySuffix = $derived(page.url.search || '');

	function useDemoAccount(type: 'customer' | 'partner' | 'admin') {
		if (type === 'customer') {
			loginEmail = 'demo@indonesiatours.id';
			loginPassword = 'demo123456';
		} else if (type === 'partner') {
			loginEmail = 'mitra@indonesiatours.id';
			loginPassword = 'demo123456';
		} else {
			loginEmail = 'admin@indonesiatours.id';
			loginPassword = 'demo123456';
		}
	}
</script>

<div class="mx-auto flex min-h-[75vh] max-w-md lg:max-w-5xl items-center justify-center px-4 py-10 lg:py-12">
	<div
		class="relative w-full rounded-3xl border border-slate-200/90 bg-white shadow-xl lg:grid lg:grid-cols-2 lg:min-h-170 overflow-hidden"
	>
		<!-- ========================================================= -->
		<!-- LEFT COLUMN (Desktop): SIGN IN FORM                       -->
		<!-- ========================================================= -->
		<div
			class="w-full p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] {isRegister
				? 'hidden lg:flex lg:opacity-0 lg:-translate-x-10 lg:scale-[0.97] lg:pointer-events-none'
				: 'flex lg:opacity-100 lg:translate-x-0 lg:scale-100 lg:pointer-events-auto'}"
		>
			<div class="text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-md">
					<Compass class="h-7 w-7" />
				</div>
				<h1 class="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl tracking-tight">
					Masuk ke Akun Anda
				</h1>
				<p class="mt-1 text-xs text-slate-500">
					Akses e-tiket, kelola pesanan trip, atau masuk ke portal mitra & back-office.
				</p>
			</div>

			{#if !isRegister && (formMessage || authError)}
				<div class="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
					<AlertCircle class="h-4 w-4 shrink-0 text-red-600" />
					<span>{formMessage || authError}</span>
				</div>
			{/if}

			<!-- Google OAuth Button -->
			<form method="POST" action="/masuk?/google{querySuffix ? `&${querySuffix.slice(1)}` : ''}" class="mt-6">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99]"
				>
					<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
					</svg>
					<span>Lanjutkan dengan Google</span>
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6 flex items-center justify-center">
				<div class="w-full border-t border-slate-200"></div>
				<span class="absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">atau dengan email</span>
			</div>

			<!-- Demo Account Quick Select (Development / Staging Testing) -->
			{#if isDev}
				<div class="mb-5 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 p-3 text-center">
					<div class="flex items-center justify-between mb-2">
						<span class="text-[11px] font-bold text-teal-900">⚡ Uji Coba Cepat (Dev Mode):</span>
						<span class="text-[10px] rounded bg-teal-200/80 px-1.5 py-0.5 font-bold text-teal-800">Local Only</span>
					</div>
					<div class="grid grid-cols-3 gap-1.5">
						<button
							type="button"
							onclick={() => useDemoAccount('customer')}
							class="flex flex-col items-center justify-center rounded-xl border border-teal-200 bg-white py-2 px-1 text-[11px] font-bold text-teal-800 shadow-sm hover:bg-teal-100/60"
						>
							<User class="h-3.5 w-3.5 mb-0.5 text-teal-600" />
							<span>Customer</span>
						</button>
						<button
							type="button"
							onclick={() => useDemoAccount('partner')}
							class="flex flex-col items-center justify-center rounded-xl border border-teal-200 bg-white py-2 px-1 text-[11px] font-bold text-teal-800 shadow-sm hover:bg-teal-100/60"
						>
							<Building2 class="h-3.5 w-3.5 mb-0.5 text-orange-600" />
							<span>Mitra Tour</span>
						</button>
						<button
							type="button"
							onclick={() => useDemoAccount('admin')}
							class="flex flex-col items-center justify-center rounded-xl border border-teal-200 bg-white py-2 px-1 text-[11px] font-bold text-teal-800 shadow-sm hover:bg-teal-100/60"
						>
							<Shield class="h-3.5 w-3.5 mb-0.5 text-red-600" />
							<span>Admin</span>
						</button>
					</div>
				</div>
			{/if}

			<form method="POST" action="/masuk?/login{querySuffix ? `&${querySuffix.slice(1)}` : ''}" class="space-y-4">
				<div>
					<label for="email-input" class="block text-xs font-bold text-slate-700 mb-1">Email</label>
					<div class="relative">
						<Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
						<input
							id="email-input"
							type="email"
							name="email"
							placeholder="nama@email.com"
							bind:value={loginEmail}
							required
							class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label for="password-input" class="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
					<div class="relative">
						<Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
						<input
							id="password-input"
							type="password"
							name="password"
							placeholder="••••••••"
							bind:value={loginPassword}
							required
							class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
				>
					<LogIn class="h-4 w-4" />
					<span>Masuk Sekarang</span>
				</button>
			</form>

			<div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
				Belum punya akun?
				<a
					href={resolve('/daftar')}
					data-sveltekit-noscroll
					class="font-bold text-teal-700 hover:underline"
				>
					Daftar di sini
				</a>
			</div>
		</div>

		<!-- ========================================================= -->
		<!-- RIGHT COLUMN (Desktop): CREATE ACCOUNT FORM               -->
		<!-- ========================================================= -->
		<div
			class="w-full p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] {isRegister
				? 'flex lg:opacity-100 lg:translate-x-0 lg:scale-100 lg:pointer-events-auto'
				: 'hidden lg:flex lg:opacity-0 lg:translate-x-10 lg:scale-[0.97] lg:pointer-events-none'}"
		>
			<div class="text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-md">
					<Compass class="h-7 w-7" />
				</div>
				<h1 class="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl tracking-tight">
					Buat Akun Baru
				</h1>
				<p class="mt-1 text-xs text-slate-500">
					Daftar sekarang untuk pesan tiket open trip terkurasi dengan mudah.
				</p>
			</div>

			{#if isRegister && formMessage}
				<div class="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
					<AlertCircle class="h-4 w-4 shrink-0 text-red-600" />
					<span>{formMessage}</span>
				</div>
			{/if}

			<!-- Google OAuth Button -->
			<form method="POST" action="/daftar?/google" class="mt-6">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99]"
				>
					<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
					</svg>
					<span>Daftar dengan Google</span>
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6 flex items-center justify-center">
				<div class="w-full border-t border-slate-200"></div>
				<span class="absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">atau dengan email</span>
			</div>

			<form method="POST" action="/daftar?/register" class="space-y-4">
				<div>
					<label for="register-fullname" class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
					<div class="relative">
						<User class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
						<input
							id="register-fullname"
							type="text"
							name="full_name"
							placeholder="Nama lengkap sesuai KTP"
							bind:value={fullName}
							required
							class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label for="register-email" class="block text-xs font-bold text-slate-700 mb-1">Email</label>
					<div class="relative">
						<Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
						<input
							id="register-email"
							type="email"
							name="email"
							placeholder="nama@email.com"
							bind:value={registerEmail}
							required
							class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label for="register-password" class="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
					<div class="relative">
						<Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
						<input
							id="register-password"
							type="password"
							name="password"
							placeholder="Minimal 6 karakter"
							bind:value={registerPassword}
							required
							minlength="6"
							class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
				>
					<UserPlus class="h-4 w-4" />
					<span>Daftar Sekarang</span>
				</button>
			</form>

			<div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
				Sudah memiliki akun?
				<a
					href={resolve('/masuk')}
					data-sveltekit-noscroll
					class="font-bold text-teal-700 hover:underline"
				>
					Masuk di sini
				</a>
			</div>
		</div>

		<!-- ========================================================= -->
		<!-- SLIDING PHOTO PANEL (Web / Desktop Only)                  -->
		<!-- Sign In: Right (translate-x-full)                         -->
		<!-- Create Account: Left (translate-x-0)                      -->
		<!-- ========================================================= -->
		<div
			class="hidden lg:block lg:absolute lg:top-0 lg:bottom-0 lg:left-0 lg:w-1/2 lg:p-3.5 xl:p-4 z-20 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] {isRegister
				? 'lg:translate-x-0'
				: 'lg:translate-x-full'}"
		>
			<div class="relative h-full w-full rounded-[28px] overflow-hidden bg-slate-900 select-none">
				<!-- Stepped / Notched Cutout Corner: Top-Left (Untitled UI style) -->
				<svg
					viewBox="0 0 72 72"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="pointer-events-none absolute -top-px -left-px z-30 h-18 w-18 text-white"
				>
					<path
						d="M 0 0 L 72 0 A 24 24 0 0 0 48 24 A 24 24 0 0 1 24 48 A 24 24 0 0 0 0 72 Z"
						fill="currentColor"
					/>
				</svg>

				<!-- Stepped / Notched Cutout Corner: Bottom-Right (Untitled UI style) -->
				<svg
					viewBox="0 0 72 72"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="pointer-events-none absolute -bottom-px -right-px z-30 h-18 w-18 rotate-180 text-white"
				>
					<path
						d="M 0 0 L 72 0 A 24 24 0 0 0 48 24 A 24 24 0 0 1 24 48 A 24 24 0 0 0 0 72 Z"
						fill="currentColor"
					/>
				</svg>

				<!-- PHOTO 1: Sign In Mode (Labuan Bajo / Pulau Padar) -->
				<img
					src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=85"
					alt="Keindahan Destinasi Wisata Nusantara"
					class="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out {isRegister
						? 'opacity-0 scale-110'
						: 'opacity-100 scale-100'}"
				/>

				<!-- PHOTO 2: Create Account Mode (Gunung Bromo / Kepulauan Tropis) -->
				<img
					src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85"
					alt="Petualangan Open Trip Indonesia"
					class="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out {isRegister
						? 'opacity-100 scale-100'
						: 'opacity-0 scale-110'}"
				/>
			</div>
		</div>
	</div>
</div>
