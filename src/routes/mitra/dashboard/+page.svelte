<script lang="ts">
	import type { PageData } from './$types';
	import {
		Compass,
		Users,
		Wallet,
		ShieldCheck,
		ArrowRight,
		Clock,
		CheckCircle2,
		AlertCircle,
		PlusCircle
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Dashboard Mitra — Indonesia Tours</title>
</svelte:head>

<div class="space-y-8">
	<!-- Metric Cards Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Paket Tur Aktif -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Paket Tur Tayang</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
					<Compass class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-black text-slate-900">{data.metrics?.totalTours || 0}</span>
				<span class="text-xs text-slate-500 ml-1">paket open trip</span>
			</div>
		</div>

		<!-- Kursi Terjual -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiket / Pax Terjual</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
					<Users class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-black text-orange-600">{data.metrics?.totalSeatsBooked || 0}</span>
				<span class="text-xs text-slate-500 ml-1">kursi terisi</span>
			</div>
		</div>

		<!-- Dana di Rekber Platform -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Dana Escrow / Rekber</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
					<ShieldCheck class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-xl font-black text-emerald-800">{formatRupiah(data.metrics?.pendingEscrow || 0)}</span>
				<p class="text-[11px] text-slate-400 mt-0.5">Aman ditahan s/d trip selesai</p>
			</div>
		</div>

		<!-- Total Payout Dicairkan -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Payout Diterima</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
					<Wallet class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-xl font-black text-slate-900">{formatRupiah(data.metrics?.totalReleasedPayouts || 0)}</span>
				<p class="text-[11px] text-slate-400 mt-0.5">Sudah masuk rekening</p>
			</div>
		</div>
	</div>

	<!-- Action Shortcuts Banner -->
	<div class="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
		<div>
			<h2 class="text-base font-extrabold text-orange-950">Ingin Membuka Jadwal Baru atau Menambah Tur?</h2>
			<p class="text-xs text-slate-600 mt-1">
				Semakin lengkap detail itinerary & sisa kuota kursi, semakin tinggi konversi pemesanan wisatawan.
			</p>
		</div>
		<div class="flex items-center gap-2.5 shrink-0">
			<a
				href="/mitra/tours/tambah"
				class="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition-all"
			>
				<PlusCircle class="h-4 w-4" />
				<span>Buat Paket Tur</span>
			</a>
			<a
				href="/mitra/payout"
				class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-all"
			>
				<Wallet class="h-4 w-4 text-emerald-700" />
				<span>Klaim Payout</span>
			</a>
		</div>
	</div>

	<!-- Two Column Layout: Active Tours & Recent Bookings -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Left: Paket Tur Anda -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
				<div>
					<h3 class="text-base font-extrabold text-slate-900">Paket Open Trip Milik Anda</h3>
					<p class="text-xs text-slate-500">Katalog tur yang sedang aktif dan dapat dipesan peserta</p>
				</div>
				<a href="/mitra/tours" class="text-xs font-bold text-orange-600 hover:underline">
					Lihat Semua ({data.tours?.length || 0})
				</a>
			</div>

			<div class="space-y-3">
				{#each (data.tours || []).slice(0, 4) as tour}
					<div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-orange-200 transition-all">
						<div class="flex items-center gap-3 min-w-0 flex-1">
							<img
								src={tour.cover_image_url}
								alt={tour.title}
								class="h-12 w-16 rounded-xl object-cover shrink-0"
							/>
							<div class="min-w-0 flex-1">
								<h4 class="text-xs font-extrabold text-slate-900 truncate">{tour.title}</h4>
								<p class="text-[11px] text-slate-500 truncate">{tour.destination} • {formatRupiah(tour.price)}</p>
							</div>
						</div>
						<a
							href="/trip/{tour.slug}"
							target="_blank"
							class="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-teal-700 border border-slate-200 hover:bg-teal-50 shrink-0"
						>
							Lihat Publik
						</a>
					</div>
				{:else}
					<div class="py-8 text-center text-xs text-slate-500">
						Belum ada paket tur. Klik tombol "Buat Paket Tur" di atas untuk menambahkan trip pertama Anda.
					</div>
				{/each}
			</div>
		</div>

		<!-- Right: Pesanan Masuk Terkini -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
				<div>
					<h3 class="text-base font-extrabold text-slate-900">Pesanan Masuk Terbaru</h3>
					<p class="text-xs text-slate-500">Pesanan kursi oleh peserta untuk tur Anda</p>
				</div>
				<a href="/mitra/pesanan" class="text-xs font-bold text-orange-600 hover:underline">
					Buka Manifest ({data.metrics?.totalOrders || 0})
				</a>
			</div>

			<div class="space-y-3">
				{#each data.recentBookings as booking}
					<div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 text-xs">
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="font-mono font-bold text-slate-900">{booking.booking_code}</span>
								<span class="rounded px-1.5 py-0.2 text-[10px] font-bold uppercase shrink-0
									{booking.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
									{booking.status}
								</span>
							</div>
							<p class="text-[11px] text-slate-500 mt-1 truncate">
								{booking.pax_count} pax • {formatRupiah(booking.total_price)}
							</p>
						</div>

						<a
							href="/mitra/pesanan"
							class="text-[11px] font-bold text-orange-600 hover:underline shrink-0"
						>
							Detail
						</a>
					</div>
				{:else}
					<div class="py-8 text-center text-xs text-slate-500">
						Belum ada pesanan masuk.
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

