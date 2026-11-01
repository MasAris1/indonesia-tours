<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import type { UserProfile } from '$lib/../app';
	import { Compass, Ticket, LogIn, UserCircle, LogOut, Shield, Building2, User as UserIcon } from '@lucide/svelte';

	let { user, profile }: { user: User | null; profile?: UserProfile | null } = $props();
</script>

<header class="sticky top-0 z-50 w-full max-w-full overflow-hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full min-w-0">
		<!-- Brand Logo -->
		<a href="/" class="flex items-center gap-2.5 transition-transform hover:scale-[1.01]">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
				<Compass class="h-6 w-6 stroke-[2.2]" />
			</div>
			<div class="flex flex-col">
				<span class="font-sans text-lg font-extrabold tracking-tight text-teal-800">
					Indonesia<span class="text-orange-600">Tours</span>
				</span>
				<span class="text-[11px] font-medium uppercase tracking-wider text-slate-500">
					Open Trip Terkurasi
				</span>
			</div>
		</a>

		<!-- Desktop Navigation Links -->
		<nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
			<a href="/" class="transition-colors hover:text-teal-700">Jelajah Trip</a>
			<a href="/pesanan" class="flex items-center gap-1.5 transition-colors hover:text-teal-700">
				<Ticket class="h-4 w-4" />
				<span>Pesanan Saya</span>
			</a>

			{#if profile?.role === 'partner' || profile?.role === 'admin'}
				<a
					href="/mitra/dashboard"
					class="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
				>
					<Building2 class="h-3.5 w-3.5" />
					<span>Portal Mitra</span>
				</a>
			{:else}
				<a href="/mitra/daftar" class="text-xs text-slate-500 hover:text-teal-700">
					Daftar Mitra
				</a>
			{/if}

			{#if profile?.role === 'admin'}
				<a
					href="/admin/dashboard"
					class="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
				>
					<Shield class="h-3.5 w-3.5 text-teal-400" />
					<span>Back-Office Admin</span>
				</a>
			{/if}
		</nav>

		<!-- Auth Actions -->
		<div class="flex items-center gap-2.5">
			{#if user}
				<div class="flex items-center gap-2">
					<a
						href="/akun"
						class="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-3 py-1.5 text-xs font-semibold text-teal-900 transition-all hover:bg-teal-100"
						title="Buka Pengaturan Akun"
					>
						{#if profile?.role === 'admin'}
							<span class="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black text-red-700 uppercase">Admin</span>
						{:else if profile?.role === 'partner'}
							<span class="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-black text-orange-700 uppercase">Mitra</span>
						{:else}
							<UserIcon class="h-3.5 w-3.5 text-teal-700" />
						{/if}
						<span class="max-w-[120px] sm:max-w-[160px] truncate">{profile?.full_name || user.email}</span>
					</a>
					<form method="POST" action="/keluar">
						<button
							type="submit"
							class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600"
							title="Keluar"
						>
							<LogOut class="h-4 w-4" />
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/masuk"
					class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:border-teal-700 hover:text-teal-700"
				>
					<LogIn class="h-4 w-4" />
					<span>Masuk</span>
				</a>
				<a
					href="/daftar"
					class="hidden sm:inline-flex items-center rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-800"
				>
					Daftar Akun
				</a>
			{/if}
		</div>
	</div>
</header>
