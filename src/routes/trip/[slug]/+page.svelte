<script lang="ts">
	import type { ActionData, PageProps } from './$types';
	import {
		Clock,
		MapPin,
		ShieldCheck,
		Star,
		Check,
		X,
		ArrowLeft,
		Lock,
		AlertCircle
	} from '@lucide/svelte';
	import SeatMeter from '$lib/components/SeatMeter.svelte';

	let { data, form }: { data: PageProps['data']; form: ActionData } = $props();

	let tour = $derived(data.tour);
	let schedules = $derived(data.tour.schedules || []);

	// Selected state
	let selectedScheduleId = $state(data.tour.schedules?.[0]?.id || '');
	let paxCount = $state(1);
	let contactName = $state(data.user?.user_metadata?.full_name || '');
	let contactPhone = $state(data.user?.user_metadata?.phone || '');
	let contactEmail = $state(data.user?.email || '');

	let selectedSchedule = $derived(
		schedules.find((s: { id: string }) => s.id === selectedScheduleId) || schedules[0]
	);

	let remainingSeats = $derived(
		selectedSchedule ? Math.max(0, selectedSchedule.quota_total - selectedSchedule.quota_booked) : 0
	);

	let effectivePrice = $derived(
		selectedSchedule?.price_override ? Number(selectedSchedule.price_override) : Number(tour.price)
	);

	let totalPrice = $derived(effectivePrice * paxCount);

	function formatRupiah(val: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-6 pb-28 lg:pb-12 sm:px-6 lg:px-8">
	<!-- Navigation Breadcrumb -->
	<div class="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
		<a href="/" class="inline-flex items-center gap-1 hover:text-teal-800">
			<ArrowLeft class="h-4 w-4" />
			<span>Kembali ke Katalog</span>
		</a>
		<span>/</span>
		<span class="text-slate-400">{tour.destination}</span>
		<span>/</span>
		<span class="truncate text-slate-700">{tour.title}</span>
	</div>

	<!-- Main Grid: Content (8 cols) & Sticky Booking Widget (4 cols) -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
		<!-- Left: Tour Details & Itinerary -->
		<div class="space-y-8 lg:col-span-7 xl:col-span-8">
			<!-- Hero Media Container -->
			<div class="relative overflow-hidden rounded-3xl bg-slate-100 shadow-md">
				<img
					src={tour.cover_image_url}
					alt={tour.title}
					class="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

				<div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
					<div class="flex items-center gap-2">
						<span class="rounded-full bg-teal-800/90 px-3 py-1 text-xs font-bold backdrop-blur-md">
							{tour.trip_type === 'OPEN' ? 'Open Trip' : 'Private Trip'}
						</span>
						<span class="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 backdrop-blur-md">
							{tour.duration_days} Hari {tour.duration_nights} Malam
						</span>
					</div>

					<div class="flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
						<Star class="h-3.5 w-3.5 fill-amber-400" />
						<span>{tour.rating_avg.toFixed(1)}</span>
						<span class="text-slate-300">({tour.rating_count} Ulasan)</span>
					</div>
				</div>
			</div>

			<!-- Title & Key Logistics -->
			<div>
				<h1 class="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
					{tour.title}
				</h1>

				<div class="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
					<div class="flex items-center gap-1.5">
						<MapPin class="h-4 w-4 text-teal-700" />
						<span>{tour.destination}, {tour.region}</span>
					</div>
					<div class="flex items-center gap-1.5">
						<Clock class="h-4 w-4 text-teal-700" />
						<span>Meeting Point: <strong>{tour.meeting_point || 'Bandara / Stasiun Terdekat'}</strong></span>
					</div>
				</div>

				<p class="mt-4 text-sm leading-relaxed text-slate-600">
					{tour.description}
				</p>
			</div>

			<!-- Verified Operator Badge Info Box -->
			{#if tour.partner}
				<div class="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 sm:p-5">
					<div class="flex items-start gap-4">
						<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">
							<ShieldCheck class="h-6 w-6" />
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold text-slate-900">{tour.partner.company_name}</h3>
								<span class="rounded-full bg-teal-200/80 px-2 py-0.5 text-[11px] font-extrabold text-teal-900">
									Terverifikasi
								</span>
							</div>
							<p class="mt-1 text-xs text-slate-600">
								Operator legal berlisensi resmi di {tour.partner.city}. NIB: {tour.partner.nib} • Lisensi HPI: {tour.partner.hpi_license || 'Aktif'}.
							</p>
							<div class="mt-2 text-[11px] font-semibold text-teal-800">
								🛡️ Dana pembayaran Anda disimpan di rekening bersama sampai tur selesai.
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Detailed Itinerary Timeline -->
			<div>
				<h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Rencana Perjalanan (Itinerary)</h2>
				<p class="text-xs text-slate-500 mt-1">Jadwal kegiatan dapat menyesuaikan kondisi cuaca demi keselamatan peserta.</p>

				<div class="mt-6 space-y-4">
					{#each tour.itinerary as item (item.day)}
						<div class="relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-sm font-extrabold text-white">
								H{item.day}
							</div>
							<div>
								<h3 class="text-sm font-bold text-slate-900">{item.title}</h3>
								<p class="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Inclusions & Exclusions -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<h3 class="flex items-center gap-2 text-sm font-bold text-teal-900">
						<Check class="h-4 w-4 text-emerald-600" />
						<span>Fasilitas Termasuk (Include)</span>
					</h3>
					<ul class="mt-4 space-y-2 text-xs text-slate-600">
						{#each tour.facilities as fac}
							<li class="flex items-start gap-2">
								<Check class="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
								<span>{fac}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<h3 class="flex items-center gap-2 text-sm font-bold text-slate-900">
						<X class="h-4 w-4 text-red-500" />
						<span>Belum Termasuk (Exclude)</span>
					</h3>
					<ul class="mt-4 space-y-2 text-xs text-slate-600">
						{#each tour.excludes as exc}
							<li class="flex items-start gap-2">
								<X class="h-3.5 w-3.5 shrink-0 text-red-400 mt-0.5" />
								<span>{exc}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Customer Reviews -->
			<div>
				<h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Ulasan Peserta</h2>
				<div class="mt-4 space-y-3">
					{#each tour.reviews || [] as rev (rev.id)}
						<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
										{rev.reviewer_name.charAt(0)}
									</div>
									<div>
										<h4 class="text-xs font-bold text-slate-800">{rev.reviewer_name}</h4>
										<span class="text-[10px] text-slate-400">{rev.reviewer_city || 'Peserta Terverifikasi'}</span>
									</div>
								</div>
								<div class="flex items-center text-amber-400">
									{#each Array(rev.rating) as _}
										<Star class="h-3 w-3 fill-amber-400" />
									{/each}
								</div>
							</div>
							<p class="mt-2 text-xs leading-relaxed text-slate-600">{rev.comment}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right: Sticky Booking Panel -->
		<div class="lg:col-span-5 xl:col-span-4">
			<div id="form-booking" class="sticky top-20 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl scroll-mt-24">
				<div class="flex items-baseline justify-between border-b border-slate-100 pb-4">
					<div>
						<span class="text-xs font-medium text-slate-400">Harga per orang</span>
						<div class="text-2xl font-extrabold text-teal-800 tracking-tight">
							{formatRupiah(effectivePrice)}
						</div>
					</div>
					<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
						Anti-Overbooking
					</span>
				</div>

				{#if form?.message}
					<div class="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
						<AlertCircle class="h-4 w-4 shrink-0 text-red-600" />
						<span>{form.message}</span>
					</div>
				{/if}

				<!-- Booking Form -->
				<form method="POST" action="?/book" class="mt-5 space-y-5">
					<!-- Step 1: Select Schedule -->
					<div>
						<span class="block text-xs font-bold text-slate-800 mb-2">
							1. Pilih Tanggal Keberangkatan
						</span>

						{#if schedules.length === 0}
							<div class="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
								Belum ada jadwal aktif untuk saat ini.
							</div>
						{:else}
							<div class="space-y-2 max-h-52 overflow-y-auto pr-1">
								{#each schedules as s (s.id)}
									{@const sRemaining = Math.max(0, s.quota_total - s.quota_booked)}
									<label
										for="schedule-{s.id}"
										class="flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all {selectedScheduleId === s.id
											? 'border-teal-700 bg-teal-50/60 shadow-sm'
											: 'border-slate-200 hover:border-slate-300'}"
									>
										<div class="flex items-center gap-3">
											<input
												id="schedule-{s.id}"
												type="radio"
												name="schedule_id"
												value={s.id}
												bind:group={selectedScheduleId}
												class="text-teal-700 focus:ring-teal-700"
											/>
											<div class="text-xs">
												<div class="font-bold text-slate-800">
													{formatDate(s.departure_date)}
												</div>
												<div class="text-[11px] text-slate-500">
													s/d {formatDate(s.return_date)}
												</div>
											</div>
										</div>

										<div class="text-right">
											<span class="text-[11px] font-bold {sRemaining <= 3 ? 'text-orange-600' : 'text-teal-800'}">
												Sisa {sRemaining} Kursi
											</span>
											{#if s.departure_status === 'GUARANTEED'}
												<div class="text-[10px] font-bold text-emerald-600">Pasti Berangkat</div>
											{/if}
										</div>
									</label>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Real-time Seat Meter for selected schedule -->
					{#if selectedSchedule}
						<SeatMeter
							quotaTotal={selectedSchedule.quota_total}
							quotaBooked={selectedSchedule.quota_booked}
						/>
					{/if}

					<!-- Step 2: Pax Stepper -->
					<div>
						<span class="block text-xs font-bold text-slate-800 mb-2">
							2. Jumlah Peserta (Pax)
						</span>
						<div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2">
							<span class="text-xs font-medium text-slate-600 pl-2">Peserta</span>
							<div class="flex items-center gap-3">
								<button
									type="button"
									onclick={() => {
										if (paxCount > 1) paxCount--;
									}}
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
									disabled={paxCount <= 1}
								>
									-
								</button>
								<span class="w-6 text-center text-sm font-extrabold text-slate-900">
									{paxCount}
								</span>
								<button
									type="button"
									onclick={() => {
										if (paxCount < Math.min(10, remainingSeats)) paxCount++;
									}}
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
									disabled={paxCount >= Math.min(10, remainingSeats)}
								>
									+
								</button>
							</div>
						</div>
						<input type="hidden" name="pax_count" value={paxCount} />
					</div>

					<!-- Step 3: Contact Details -->
					<div class="space-y-3 border-t border-slate-100 pt-4">
						<span class="block text-xs font-bold text-slate-800">
							3. Data Pemesan / Kontak Utama
						</span>

						<div>
							<label for="contact-name" class="block text-[11px] font-semibold text-slate-600 mb-1">Nama Lengkap:</label>
							<input
								id="contact-name"
								type="text"
								name="contact_name"
								placeholder="Nama Lengkap Sesuai KTP"
								bind:value={contactName}
								required
								class="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
							/>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<div>
								<label for="contact-phone" class="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp:</label>
								<input
									id="contact-phone"
									type="tel"
									name="contact_phone"
									placeholder="Nomor WhatsApp"
									bind:value={contactPhone}
									required
									class="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
								/>
							</div>
							<div>
								<label for="contact-email" class="block text-[11px] font-semibold text-slate-600 mb-1">Email:</label>
								<input
									id="contact-email"
									type="email"
									name="contact_email"
									placeholder="Alamat Email"
									bind:value={contactEmail}
									required
									class="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
								/>
							</div>
						</div>
					</div>

					<!-- Price Summary Box -->
					<div class="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
						<div class="flex items-center justify-between text-xs text-slate-600 mb-1">
							<span>{formatRupiah(effectivePrice)} × {paxCount} peserta</span>
							<span class="font-bold text-slate-800">{formatRupiah(totalPrice)}</span>
						</div>
						<div class="flex items-center justify-between text-xs text-slate-600 mb-2">
							<span>Biaya Layanan & Rekber</span>
							<span class="font-bold text-emerald-600">GRATIS</span>
						</div>
						<div class="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
							<span>Total Tagihan</span>
							<span class="text-base text-teal-800">{formatRupiah(totalPrice)}</span>
						</div>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={remainingSeats <= 0 || !selectedSchedule}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-700 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
					>
						<Lock class="h-4 w-4" />
						<span>Konfirmasi & Kunci Kursi</span>
					</button>

					<p class="text-center text-[11px] text-slate-400">
						Kursi Anda langsung ter-hold selama <strong>15 menit</strong> setelah konfirmasi.
					</p>
				</form>
			</div>
		</div>
	</div>

	<!-- Mobile Floating Bottom CTA Bar (visible on mobile only, above bottom nav) -->
	<div class="fixed bottom-14 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md lg:hidden">
		<div class="flex items-center justify-between gap-3">
			<div class="min-w-0">
				<span class="block text-[10px] text-slate-400 font-semibold uppercase">Mulai dari</span>
				<div class="text-base sm:text-lg font-black text-teal-800 truncate">
					{formatRupiah(effectivePrice)}
					<span class="text-[10px] font-normal text-slate-500">/org</span>
				</div>
			</div>
			<a
				href="#form-booking"
				class="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all shrink-0"
			>
				Pilih Tanggal & Pesan
			</a>
		</div>
	</div>
</div>

