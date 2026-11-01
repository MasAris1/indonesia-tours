<script lang="ts">
	import { page } from '$app/state';
	import type { User } from '@supabase/supabase-js';
	import type { UserProfile } from '$lib/../app';
	import { Compass, Ticket, MessageCircle, User as UserIcon, Building2, Shield } from '@lucide/svelte';

	let { user, profile }: { user?: User | null; profile?: UserProfile | null } = $props();

	let currentPath = $derived(page.url.pathname);
</script>

<div class="fixed bottom-0 left-0 right-0 z-40 w-full max-w-full overflow-hidden border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
	<div class="grid grid-cols-4 h-14">
		<a
			href="/"
			class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors {currentPath === '/' ? 'text-teal-700 font-bold' : 'text-slate-500'}"
		>
			<Compass class="h-5 w-5" />
			<span>Jelajah</span>
		</a>

		<a
			href="/pesanan"
			class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors {currentPath.startsWith('/pesanan') ? 'text-teal-700 font-bold' : 'text-slate-500'}"
		>
			<Ticket class="h-5 w-5" />
			<span>Pesanan</span>
		</a>

		{#if profile?.role === 'partner'}
			<a
				href="/mitra/dashboard"
				class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors {currentPath.startsWith('/mitra') ? 'text-orange-600 font-bold' : 'text-slate-500'}"
			>
				<Building2 class="h-5 w-5" />
				<span>Mitra</span>
			</a>
		{:else if profile?.role === 'admin'}
			<a
				href="/admin/dashboard"
				class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors {currentPath.startsWith('/admin') ? 'text-red-600 font-bold' : 'text-slate-500'}"
			>
				<Shield class="h-5 w-5" />
				<span>Admin</span>
			</a>
		{:else}
			<a
				href="https://wa.me/6281234567890?text=Halo%20Admin%20Indonesia%20Tours"
				target="_blank"
				rel="noreferrer"
				class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 transition-colors hover:text-teal-700"
			>
				<MessageCircle class="h-5 w-5" />
				<span>Bantuan</span>
			</a>
		{/if}

		<a
			href={user ? '/akun' : '/masuk'}
			class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors {currentPath.startsWith('/akun') || currentPath === '/masuk' ? 'text-teal-700 font-bold' : 'text-slate-500'}"
		>
			<UserIcon class="h-5 w-5" />
			<span>{user ? 'Akun' : 'Masuk'}</span>
		</a>
	</div>
</div>
