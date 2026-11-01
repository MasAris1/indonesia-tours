<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import {
		Shield,
		LayoutDashboard,
		Building2,
		Compass,
		Wallet,
		FileSpreadsheet,
		Tag,
		ArrowLeft
	} from '@lucide/svelte';

	let { data, children }: LayoutProps = $props();

	let currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-slate-100/70 pb-16">
	<!-- Admin Top Banner -->
	<header class="border-b border-slate-800 bg-slate-900 text-white shadow-lg">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3 min-w-0">
					<a href="/akun" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700" title="Kembali ke Akun">
						<ArrowLeft class="h-4 w-4" />
					</a>
					<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
						<Shield class="h-6 w-6" />
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<h1 class="text-sm font-extrabold tracking-tight sm:text-lg truncate">
								Indonesia Tours Back-Office
							</h1>
							<span class="rounded bg-red-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white">
								Admin
							</span>
						</div>
						<p class="text-[11px] sm:text-xs text-slate-400 truncate">
							Pusat kendali operasional, verifikasi mitra, dan laporan keuangan platform.
						</p>
					</div>
				</div>

				<div class="flex items-center gap-2 w-full sm:w-auto">
					<a
						href="/"
						target="_blank"
						class="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
					>
						<span>Buka Situs Publik</span>
					</a>
				</div>
			</div>

			<!-- Navigation Tabs -->
			<nav class="flex space-x-1 overflow-x-auto no-scrollbar whitespace-nowrap flex-nowrap border-t border-slate-800 pt-1 text-xs font-bold sm:space-x-3">
				<a
					href="/admin/dashboard"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/dashboard' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<LayoutDashboard class="h-4 w-4" />
					<span>Dashboard Metrik</span>
				</a>

				<a
					href="/admin/mitra"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/mitra' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<Building2 class="h-4 w-4" />
					<span>Verifikasi Mitra</span>
					{#if data.counts?.pendingPartners > 0}
						<span class="ml-1 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
							{data.counts.pendingPartners}
						</span>
					{/if}
				</a>

				<a
					href="/admin/tours"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/tours' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<Compass class="h-4 w-4" />
					<span>Kurasi Paket Tur</span>
				</a>

				<a
					href="/admin/payouts"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/payouts' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<Wallet class="h-4 w-4" />
					<span>Otorisasi Payout</span>
					{#if data.counts?.pendingPayouts > 0}
						<span class="ml-1 rounded-full bg-orange-500 px-1.5 py-0.2 text-[10px] font-black text-white">
							{data.counts.pendingPayouts}
						</span>
					{/if}
				</a>

				<a
					href="/admin/laporan"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/laporan' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<FileSpreadsheet class="h-4 w-4" />
					<span>Laporan & CSV</span>
				</a>

				<a
					href="/admin/promos"
					class="flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 transition-colors {currentPath === '/admin/promos' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}"
				>
					<Tag class="h-4 w-4" />
					<span>Kode Promo</span>
				</a>
			</nav>
		</div>
	</header>

	<!-- Content Body -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>

