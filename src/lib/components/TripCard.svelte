<script lang="ts">
	import { MapPin, ShieldCheck, Star, Users } from '@lucide/svelte';
	import SeatMeter from './SeatMeter.svelte';

	interface TourWithSchedule {
		id: string;
		title: string;
		slug: string;
		destination: string;
		region: string;
		trip_type: string;
		duration_days: number;
		duration_nights: number;
		summary: string;
		price: number;
		cover_image_url: string;
		rating_avg: number;
		rating_count: number;
		partner?: {
			company_name: string;
			city: string;
			verification_status: string;
		};
		nextSchedule?: {
			id: string;
			departure_date: string;
			return_date: string;
			quota_total: number;
			quota_booked: number;
			departure_status: string;
		};
	}

	let { tour }: { tour: TourWithSchedule } = $props();

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

<article class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
	<!-- Card Media & Overlay Badges -->
	<a href="/trip/{tour.slug}" class="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
		<img
			src={tour.cover_image_url}
			alt={tour.title}
			class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
			loading="lazy"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

		<!-- Top Overlay -->
		<div class="absolute top-3 left-3 right-3 flex items-center justify-between">
			<span class="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-teal-900 shadow-sm backdrop-blur-md">
				<Users class="h-3.5 w-3.5 text-teal-700" />
				{tour.trip_type === 'OPEN' ? 'Open Trip' : 'Private Trip'} {tour.duration_days}H{tour.duration_nights}N
			</span>

			<div class="flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md">
				<Star class="h-3 w-3 fill-amber-400" />
				<span>{tour.rating_avg > 0 ? tour.rating_avg.toFixed(1) : '5.0'}</span>
				<span class="text-[10px] text-slate-300">({tour.rating_count || 12})</span>
			</div>
		</div>

		<!-- Bottom Overlay: Verified Partner & Location -->
		<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
			<div class="inline-flex items-center gap-1 rounded-full bg-teal-800/90 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
				<ShieldCheck class="h-3 w-3 text-emerald-300" />
				<span>{tour.partner?.company_name || 'Mitra Terverifikasi'}</span>
			</div>
			<div class="inline-flex items-center gap-1 font-semibold text-slate-200 drop-shadow">
				<MapPin class="h-3 w-3 text-orange-400" />
				<span>{tour.destination}</span>
			</div>
		</div>
	</a>

	<!-- Card Content -->
	<div class="flex flex-1 flex-col p-4 sm:p-5">
		<a href="/trip/{tour.slug}" class="block group-hover:text-teal-800 transition-colors">
			<h3 class="line-clamp-2 text-base font-bold text-slate-900 leading-snug">
				{tour.title}
			</h3>
		</a>
		<p class="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
			{tour.summary}
		</p>

		<!-- Seat Quota Status (Real-time) -->
		{#if tour.nextSchedule}
			<div class="mt-4">
				<div class="mb-1 text-[11px] font-medium text-slate-500">
					Jadwal terdekat: <strong class="text-slate-700">{formatDate(tour.nextSchedule.departure_date)}</strong>
				</div>
				<SeatMeter
					quotaTotal={tour.nextSchedule.quota_total}
					quotaBooked={tour.nextSchedule.quota_booked}
				/>
			</div>
		{/if}

		<!-- Price & CTA -->
		<div class="mt-5 flex items-end justify-between border-t border-slate-100 pt-3">
			<div class="flex flex-col">
				<span class="text-[11px] font-medium text-slate-400">Harga per pax</span>
				<div class="text-lg font-extrabold text-teal-800 tracking-tight">
					{formatRupiah(tour.price)}
				</div>
			</div>

			<a
				href="/trip/{tour.slug}"
				class="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-95"
			>
				Pesan Kursi
			</a>
		</div>
	</div>
</article>

