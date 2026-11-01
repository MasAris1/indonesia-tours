<script lang="ts">
	import type { PageProps } from './$types';
	import {
		Ticket,
		Calendar,
		Clock,
		ArrowRight,
		CheckCircle2,
		AlertCircle,
		Users,
		ShieldCheck
	} from '@lucide/svelte';

	let { data }: PageProps = $props();

	let activeTab = $state<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');

	let filteredBookings = $derived(
		data.bookings.filter((b: { booking_status: string }) => {
			if (activeTab === 'ALL') return true;
			if (activeTab === 'PENDING') return b.booking_status === 'PENDING';
			if (activeTab === 'PAID') return b.booking_status === 'PAID' || b.booking_status === 'COMPLETED';
			if (activeTab === 'CANCELLED') return b.booking_status === 'CANCELLED' || b.booking_status === 'EXPIRED';
			return true;
		})
	);

	function formatRupiah(val: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
		<div>
			<h1 class="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
				Pesanan & Tiket Saya
			</h1>
			<p class="text-xs sm:text-sm text-slate-500 mt-1">
				Kelola jadwal perjalanan, e-tiket digital, dan status pembayaran Anda.
			</p>
		</div>

		<a
			href="/"
			class="inline-flex items-center gap-1.5 rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-900 transition-all"
		>
			<span>Cari Trip Lainnya</span>
			<ArrowRight class="h-3.5 w-3.5" />
		</a>
	</div>

	<!-- Status Tabs -->
	<div class="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3 no-scrollbar text-xs font-bold whitespace-nowrap flex-nowrap">
		<button
			type="button"
			onclick={() => (activeTab = 'ALL')}
			class="rounded-xl px-4 py-2 transition-all shrink-0 {activeTab === 'ALL'
				? 'bg-teal-800 text-white shadow-sm'
				: 'text-slate-600 hover:bg-slate-100'}"
		>
			Semua ({data.bookings.length})
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'PENDING')}
			class="rounded-xl px-4 py-2 transition-all shrink-0 {activeTab === 'PENDING'
				? 'bg-amber-600 text-white shadow-sm'
				: 'text-slate-600 hover:bg-slate-100'}"
		>
			Menunggu Bayar
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'PAID')}
			class="rounded-xl px-4 py-2 transition-all shrink-0 {activeTab === 'PAID'
				? 'bg-emerald-700 text-white shadow-sm'
				: 'text-slate-600 hover:bg-slate-100'}"
		>
			Aktif & Lunas
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'CANCELLED')}
			class="rounded-xl px-4 py-2 transition-all shrink-0 {activeTab === 'CANCELLED'
				? 'bg-red-700 text-white shadow-sm'
				: 'text-slate-600 hover:bg-slate-100'}"
		>
			Dibatalkan / Refund
		</button>
	</div>

	<!-- Bookings List -->
	{#if filteredBookings.length === 0}
		<div class="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
			<Ticket class="mx-auto h-12 w-12 text-slate-400" />
			<h3 class="mt-3 text-base font-bold text-slate-800">Belum ada pesanan pada kategori ini</h3>
			<p class="mt-1 text-xs text-slate-500">Mulai petualangan baru Anda dan pesan kursi sekarang.</p>
			<a
				href="/"
				class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700"
			>
				<span>Jelajah Katalog Trip</span>
				<ArrowRight class="h-3.5 w-3.5" />
			</a>
		</div>
	{:else}
		<div class="mt-6 space-y-4">
			{#each filteredBookings as item (item.id)}
				<article class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
					<div class="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
						<img
							src={item.cover_image_url}
							alt={item.tour_title}
							class="h-16 w-20 sm:h-20 sm:w-24 rounded-xl object-cover shrink-0"
						/>
						<div class="space-y-1 min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="font-mono text-xs font-bold text-teal-800">{item.booking_code}</span>
								{#if item.booking_status === 'PAID'}
									<span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
										Lunas
									</span>
								{:else if item.booking_status === 'PENDING'}
									<span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
										Menunggu Bayar
									</span>
								{:else if item.booking_status === 'CANCELLED'}
									<span class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
										Dibatalkan ({item.refund_status || 'REFUND_REQUESTED'})
									</span>
								{:else}
									<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
										{item.booking_status}
									</span>
								{/if}
							</div>

							<h3 class="text-sm font-bold text-slate-900 line-clamp-1">{item.tour_title}</h3>
							<div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
								<span>{formatDate(item.departure_date)}</span>
								<span>•</span>
								<span>{item.pax_count} Peserta</span>
								<span>•</span>
								<span class="font-bold text-slate-700">{formatRupiah(Number(item.total_price))}</span>
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
						{#if item.booking_status === 'PENDING'}
							<a
								href="/checkout/{item.booking_code}"
								class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700"
							>
								<span>Bayar Sekarang</span>
								<ArrowRight class="h-3.5 w-3.5" />
							</a>
						{:else}
							<a
								href="/pesanan/{item.booking_code}"
								class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm hover:border-teal-700 hover:text-teal-700"
							>
								<Ticket class="h-3.5 w-3.5" />
								<span>Lihat E-Tiket</span>
							</a>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

