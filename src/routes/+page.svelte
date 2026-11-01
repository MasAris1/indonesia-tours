<script lang="ts">
	import type { PageProps } from './$types';
	import TripCard from '$lib/components/TripCard.svelte';
	import {
		Search,
		Calendar,
		Sparkles,
		ShieldCheck,
		Users,
		CreditCard,
		CheckCircle2,
		Flame,
		ArrowRight
	} from '@lucide/svelte';

	let { data }: PageProps = $props();

	let searchQuery = $state(data.selectedDestination || '');
	let activeType = $state(data.selectedType || 'all');
	let isLongWeekendOnly = $state(false);

	const destinations = [
		'Semua Wilayah',
		'Labuan Bajo',
		'Bromo',
		'Raja Ampat',
		'Dieng',
		'Sumba',
		'Derawan',
		'Belitung',
		'Toraja',
		'Karimunjawa',
		'Rinjani'
	];

	let selectedDest = $state(data.selectedDestination || 'Semua Wilayah');

	let filteredTours = $derived(
		data.tours.filter((tour) => {
			// Destination filter
			if (selectedDest !== 'Semua Wilayah') {
				if (!tour.destination.toLowerCase().includes(selectedDest.toLowerCase())) {
					return false;
				}
			} else if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchTitle = tour.title.toLowerCase().includes(q);
				const matchDest = tour.destination.toLowerCase().includes(q);
				const matchRegion = tour.region?.toLowerCase().includes(q);
				if (!matchTitle && !matchDest && !matchRegion) return false;
			}

			// Type filter
			if (activeType === 'OPEN' && tour.trip_type !== 'OPEN') return false;
			if (activeType === 'PRIVATE' && tour.trip_type !== 'PRIVATE') return false;

			// Long weekend filter (dates e.g. Dec, Oct 31, etc.)
			if (isLongWeekendOnly) {
				const hasWeekend = (tour.allSchedules || []).some(
					(s: { departure_date: string }) =>
						s.departure_date.includes('-12-') ||
						s.departure_date.includes('-10-24') ||
						s.departure_date.includes('-10-31')
				);
				if (!hasWeekend) return false;
			}

			return true;
		})
	);
</script>

<div class="flex flex-col w-full min-w-0 max-w-full overflow-x-hidden">
	<!-- Hero Section: Immersive travel banner with search island -->
	<section class="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 py-12 sm:py-24 text-white">
		<!-- Background image backdrop -->
		<div class="absolute inset-0 opacity-30 mix-blend-overlay">
			<img
				src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
				alt="Indonesia Travel"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950"></div>

		<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center w-full">
			<div class="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-900/60 px-4 py-1.5 text-xs font-semibold text-teal-300 backdrop-blur-md mb-6">
				<Sparkles class="h-3.5 w-3.5 text-teal-400" />
				<span>Platform Agregator Open Trip #1 di Indonesia</span>
			</div>

			<h1 class="mx-auto max-w-4xl text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
				Jelajah Surga Nusantara, <br class="hidden sm:inline" />
				<span class="bg-gradient-to-r from-teal-300 via-emerald-200 to-orange-400 bg-clip-text text-transparent">
					Pasti Berangkat & Tanpa Ragu.
				</span>
			</h1>

			<p class="mx-auto mt-4 max-w-2xl text-xs sm:text-base text-slate-300 leading-relaxed px-2">
				Cek sisa kuota kursi secara real-time, pesan instan, dan bayar online lewat rekening bersama (escrow). Dana ditahan aman sampai trip selesai.
			</p>

			<!-- Search Island Bar -->
			<div class="mx-auto mt-6 sm:mt-8 w-full max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-3 sm:p-4 text-slate-800 shadow-2xl backdrop-blur-xl">
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
					<!-- Destination Input -->
					<div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 sm:col-span-5">
						<Search class="h-5 w-5 text-slate-400 shrink-0" />
						<input
							type="text"
							placeholder="Cari Bromo, Labuan Bajo, Sumba..."
							bind:value={searchQuery}
							class="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
						/>
					</div>

					<!-- Trip Type Select -->
					<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:col-span-4">
						<Users class="h-4 w-4 text-slate-400 shrink-0" />
						<select
							bind:value={activeType}
							class="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none"
						>
							<option value="all">Semua Tipe Trip</option>
							<option value="OPEN">Open Trip (Gabungan)</option>
							<option value="PRIVATE">Private Trip (Eksklusif)</option>
						</select>
					</div>

					<!-- Search Button -->
					<div class="sm:col-span-3">
						<button
							type="button"
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700 active:scale-95"
						>
							<span>Temukan Trip</span>
							<ArrowRight class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- Quick Filter Chips under search -->
				<div class="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold">
					<span class="text-slate-400 font-medium">Tren:</span>
					<button
						type="button"
						onclick={() => (searchQuery = 'Bromo')}
						class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
					>
						🌋 Bromo
					</button>
					<button
						type="button"
						onclick={() => (searchQuery = 'Labuan Bajo')}
						class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
					>
						⛵ Labuan Bajo
					</button>
					<button
						type="button"
						onclick={() => (searchQuery = 'Raja Ampat')}
						class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
					>
						🏝️ Raja Ampat
					</button>

					<button
						type="button"
						onclick={() => (isLongWeekendOnly = !isLongWeekendOnly)}
						class="sm:ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-bold transition-all {isLongWeekendOnly
							? 'border-orange-500 bg-orange-50 text-orange-700'
							: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}"
					>
						<Flame class="h-3.5 w-3.5 text-orange-500" />
						<span>Jadwal Long Weekend</span>
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Main Catalog Section -->
	<section id="destinasi" class="mx-auto w-full max-w-7xl min-w-0 px-4 py-12 sm:px-6 lg:px-8">
		<!-- Section Header & Filter Pills -->
		<div class="flex flex-col gap-6 w-full min-w-0">
			<div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h2 class="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
						Katalog Open Trip Terkurasi
					</h2>
					<p class="mt-1 text-xs sm:text-sm text-slate-500">
						Pilih jadwal keberangkatan pasti dengan operator terverifikasi HPI.
					</p>
				</div>

				<div class="flex items-center gap-2">
					<span class="rounded-full bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-900">
						{filteredTours.length} Paket Tersedia
					</span>
				</div>
			</div>

			<!-- Destination Pills (Horizontal Scroll) -->
			<div class="w-full min-w-0 max-w-full overflow-x-auto no-scrollbar pb-2">
				<div class="flex items-center gap-2 whitespace-nowrap flex-nowrap w-max pr-4">
					{#each destinations as d}
						<button
							type="button"
							onclick={() => {
								selectedDest = d;
								searchQuery = '';
							}}
							class="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all {selectedDest === d
								? 'bg-teal-800 text-white shadow-sm'
								: 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
						>
							{d}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Tours Grid Feed -->
		{#if filteredTours.length === 0}
			<div class="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
				<Search class="mx-auto h-12 w-12 text-slate-400" />
				<h3 class="mt-3 text-base font-bold text-slate-800">Tidak ada paket trip yang cocok</h3>
				<p class="mt-1 text-xs text-slate-500">Coba ubah kata kunci atau pilih destinasi lainnya.</p>
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
						selectedDest = 'Semua Wilayah';
						activeType = 'all';
						isLongWeekendOnly = false;
					}}
					class="mt-4 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
				>
					Reset Semua Filter
				</button>
			</div>
		{:else}
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredTours as tour (tour.id)}
					<TripCard {tour} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- How Escrow Works Section -->
	<section id="cara-kerja" class="w-full max-w-full border-t border-slate-200 bg-slate-50 py-12 sm:py-16 overflow-hidden">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-w-0">
			<div class="mx-auto max-w-3xl text-center">
				<div class="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 mb-3">
					<ShieldCheck class="h-4 w-4" />
					<span>Keamanan 100% Terjamin</span>
				</div>
				<h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
					Bagaimana Rekening Bersama (Escrow) Melindungi Anda?
				</h2>
				<p class="mt-2 text-xs sm:text-sm text-slate-600">
					Tak ada lagi drama uang dibawa kabur atau operator bodong di media sosial.
				</p>
			</div>

			<div class="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
				<div class="relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 text-center shadow-sm">
					<div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-base sm:text-lg mb-3 sm:mb-4 shrink-0">
						1
					</div>
					<h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Pilih & Kunci Kursi</h3>
					<p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
						Sisa kuota terkunci secara atomik saat Anda memesan, anti-overbooking.
					</p>
				</div>

				<div class="relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 text-center shadow-sm">
					<div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-base sm:text-lg mb-3 sm:mb-4 shrink-0">
						2
					</div>
					<h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Bayar Online Instan</h3>
					<p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
						Pilih QRIS atau VA Midtrans. Dana masuk ke rekening bersama.
					</p>
				</div>

				<div class="relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 text-center shadow-sm">
					<div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-base sm:text-lg mb-3 sm:mb-4 shrink-0">
						3
					</div>
					<h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">E-Tiket & Grup WA</h3>
					<p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
						Dapatkan tiket digital dan tautan grup WhatsApp resmi bersama peserta.
					</p>
				</div>

				<div class="relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 text-center shadow-sm">
					<div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-base sm:text-lg mb-3 sm:mb-4 shrink-0">
						4
					</div>
					<h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Pelepasan Dana Aman</h3>
					<p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
						Dana hanya dicairkan ke operator setelah trip selesai dilaksanakan.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
