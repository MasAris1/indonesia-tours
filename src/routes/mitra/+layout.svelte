<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import {
		Building2,
		LayoutDashboard,
		Compass,
		PlusCircle,
		Users,
		Wallet,
		ShieldCheck,
		ArrowLeft
	} from '@lucide/svelte';

	let { data, children }: LayoutProps = $props();

	let currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-slate-50/60 pb-16">
	<!-- Partner Top Banner -->
	<header class="border-b border-orange-200/80 bg-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3 min-w-0">
					<a href="/akun" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100" title="Kembali ke Akun">
						<ArrowLeft class="h-4 w-4" />
					</a>
					<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-md">
						<Building2 class="h-6 w-6" />
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<h1 class="text-sm font-extrabold text-slate-900 sm:text-lg truncate">
								{data.partner?.company_name || 'Portal Mitra Operator'}
							</h1>
							<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider {data.partner?.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
								<ShieldCheck class="h-3 w-3" />
								<span>{data.partner?.verification_status || 'PENDING'}</span>
							</span>
						</div>
						<p class="text-[11px] sm:text-xs text-slate-500 truncate">
							{data.partner?.city || 'Indonesia'} • NIB: {data.partner?.nib || '-'} • Komisi: {data.partner?.commission_rate || '10'}%
						</p>
					</div>
				</div>

				<div class="flex items-center gap-2 w-full sm:w-auto">
					<a
						href="/mitra/tours/tambah"
						class="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition-all active:scale-95"
					>
						<PlusCircle class="h-4 w-4" />
						<span>Tambah Paket Tur Baru</span>
					</a>
				</div>
			</div>

			<!-- Navigation Tabs -->
			<nav class="flex space-x-1 overflow-x-auto no-scrollbar whitespace-nowrap flex-nowrap border-t border-slate-100 pt-1 text-xs font-bold sm:space-x-3">
				<a
					href="/mitra/dashboard"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/mitra/dashboard' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}"
				>
					<LayoutDashboard class="h-4 w-4" />
					<span>Dashboard</span>
				</a>

				<a
					href="/mitra/tours"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/mitra/tours' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}"
				>
					<Compass class="h-4 w-4" />
					<span>Kelola Paket & Kuota</span>
				</a>

				<a
					href="/mitra/pesanan"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/mitra/pesanan' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}"
				>
					<Users class="h-4 w-4" />
					<span>Manifest Pesanan</span>
				</a>

				<a
					href="/mitra/payout"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/mitra/payout' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}"
				>
					<Wallet class="h-4 w-4" />
					<span>Klaim Payout</span>
				</a>

				<a
					href="/mitra/profil"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/mitra/profil' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}"
				>
					<ShieldCheck class="h-4 w-4" />
					<span>Legalitas & Rekening</span>
				</a>
			</nav>
		</div>
	</header>

	<!-- Content Body -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>

