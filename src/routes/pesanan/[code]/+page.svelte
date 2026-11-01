<script lang="ts">
	import type { ActionData, PageProps } from './$types';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import {
		CheckCircle2,
		MessageCircle,
		Calendar,
		MapPin,
		Clock,
		ShieldCheck,
		Users,
		AlertTriangle,
		ArrowLeft,
		Download,
		Share2
	} from '@lucide/svelte';

	let { data, form }: { data: PageProps['data']; form: ActionData } = $props();

	let details = $derived(data.bookingDetails);
	let booking = $derived(details.booking);
	let tour = $derived(details.tour);
	let schedule = $derived(details.schedule);
	let partner = $derived(details.partner);

	let showCancelModal = $state(false);
	let cancelReason = $state('Ada keperluan mendadak');

	onMount(() => {
		if (data.isJustPaid && booking.booking_status === 'PAID') {
			confetti({
				particleCount: 80,
				spread: 70,
				origin: { y: 0.6 }
			});
		}
	});

	function formatRupiah(val: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(val);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Top Navigation -->
	<div class="mb-6 flex items-center justify-between">
		<a href="/pesanan" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800">
			<ArrowLeft class="h-4 w-4" />
			<span>Kembali ke Daftar Pesanan</span>
		</a>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => window.print()}
				class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
			>
				<Download class="h-3.5 w-3.5" />
				<span>Cetak Tiket</span>
			</button>
		</div>
	</div>

	<!-- Cancellation Success Banner -->
	{#if form?.cancelled || booking.booking_status === 'CANCELLED'}
		<div class="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 shadow-sm">
			<div class="flex items-center gap-2 font-bold text-sm text-red-900 mb-1">
				<AlertTriangle class="h-4 w-4 text-red-600" />
				<span>Pesanan Ini Telah Dibatalkan</span>
			</div>
			<p>
				Status Refund: <strong class="uppercase text-red-900">{booking.refund_status || 'REFUND_REQUESTED'}</strong>.
				Kursi telah dikembalikan ke sistem dan dana Anda akan diproses pengembaliannya oleh admin.
			</p>
		</div>
	{/if}

	<!-- Digital E-Ticket Card -->
	<div class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl">
		<!-- Ticket Header -->
		<div class="bg-gradient-to-r from-teal-800 to-teal-900 p-6 text-white sm:p-8">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div class="inline-flex items-center gap-1.5 rounded-full bg-teal-700/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-200 mb-2">
						E-Tiket Resmi Tur
					</div>
					<h1 class="text-xl font-extrabold sm:text-2xl">{tour.title}</h1>
					<p class="text-xs text-teal-200 mt-1">Dikelola oleh {partner.company_name} ({partner.city})</p>
				</div>

				<div class="rounded-2xl bg-white/10 p-3 text-center backdrop-blur-md border border-white/20 sm:min-w-[140px]">
					<span class="text-[10px] font-bold uppercase tracking-widest text-teal-200">Kode Booking</span>
					<div class="font-mono text-lg font-extrabold text-white tracking-wider">{booking.booking_code}</div>
				</div>
			</div>
		</div>

		<!-- Status & Departure Alert Ribbon -->
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 sm:px-8 text-xs">
			<div class="flex items-center gap-2">
				<span class="font-semibold text-slate-500">Status Pembayaran:</span>
				{#if booking.booking_status === 'PAID'}
					<span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800">
						<CheckCircle2 class="h-3.5 w-3.5 text-emerald-600" />
						Lunas (Paid)
					</span>
				{:else if booking.booking_status === 'CANCELLED'}
					<span class="rounded-full bg-red-100 px-2.5 py-0.5 font-bold text-red-800">Dibatalkan</span>
				{:else}
					<span class="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800">{booking.booking_status}</span>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<span class="font-semibold text-slate-500">Status Keberangkatan:</span>
				{#if schedule.departure_status === 'GUARANTEED'}
					<span class="rounded-full bg-teal-100 px-2.5 py-0.5 font-extrabold text-teal-900">
						✓ Pasti Berangkat
					</span>
				{:else}
					<span class="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800">
						Menunggu Kuota ({schedule.quota_booked}/{schedule.quota_total} Terisi)
					</span>
				{/if}
			</div>
		</div>

		<!-- Ticket Body -->
		<div class="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-12">
			<!-- Details & Logistics (7 cols) -->
			<div class="space-y-6 md:col-span-7">
				<div class="grid grid-cols-2 gap-4 text-xs">
					<div>
						<span class="font-semibold text-slate-400">Jadwal Keberangkatan</span>
						<p class="font-bold text-slate-900 text-sm mt-0.5">{formatDate(schedule.departure_date)}</p>
					</div>
					<div>
						<span class="font-semibold text-slate-400">Jadwal Selesai</span>
						<p class="font-bold text-slate-900 text-sm mt-0.5">{formatDate(schedule.return_date)}</p>
					</div>
				</div>

				<div class="border-t border-slate-100 pt-4 text-xs space-y-3">
					<div>
						<span class="font-semibold text-slate-400">Titik Kumpul (Meeting Point)</span>
						<p class="font-bold text-slate-800 mt-0.5">{tour.meeting_point || 'Bandara / Stasiun Terdekat'}</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<span class="font-semibold text-slate-400">Nama Pemesan</span>
							<p class="font-bold text-slate-800 mt-0.5">{booking.contact_name}</p>
						</div>
						<div>
							<span class="font-semibold text-slate-400">Jumlah Peserta</span>
							<p class="font-bold text-slate-800 mt-0.5">{booking.pax_count} Orang (Pax)</p>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<span class="font-semibold text-slate-400">Kontak WhatsApp</span>
							<p class="font-bold text-slate-800 mt-0.5">{booking.contact_phone}</p>
						</div>
						<div>
							<span class="font-semibold text-slate-400">Total Pembayaran</span>
							<p class="font-bold text-teal-800 mt-0.5">{formatRupiah(Number(booking.total_price))}</p>
						</div>
					</div>
				</div>

				<!-- WhatsApp Group Invitation Button -->
				{#if booking.booking_status === 'PAID' && (booking.wa_group_url || schedule.wa_group_url)}
					<div class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
								<MessageCircle class="h-6 w-6" />
							</div>
							<div class="flex-1">
								<h4 class="text-xs sm:text-sm font-bold text-emerald-950">
									Grup WhatsApp Resmi Peserta
								</h4>
								<p class="text-[11px] text-emerald-800">
									Koordinasi bersama tour leader dan peserta trip lainnya.
								</p>
							</div>
						</div>

						<a
							href={booking.wa_group_url || schedule.wa_group_url}
							target="_blank"
							rel="noreferrer"
							class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
						>
							<MessageCircle class="h-4 w-4" />
							<span>Gabung Grup WhatsApp Sekarang</span>
						</a>
					</div>
				{/if}
			</div>

			<!-- QR Code & Verification (5 cols) -->
			<div class="flex flex-col items-center justify-center border-t border-slate-100 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
				<div class="rounded-2xl border-2 border-slate-200 p-3 shadow-inner bg-white">
					<img
						src={data.ticketQrDataUrl}
						alt="QR Code Tiket"
						class="h-44 w-44 object-contain"
					/>
				</div>
				<span class="font-mono text-xs font-bold text-slate-700 mt-2">{booking.booking_code}</span>
				<p class="text-center text-[10px] text-slate-400 mt-1 max-w-[180px]">
					Tunjukkan QR Code ini kepada tour leader saat tiba di meeting point.
				</p>
			</div>
		</div>

		<!-- Footer Actions: Cancel / Refund -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8 text-center sm:text-left">
			<div class="flex items-center gap-2 text-xs text-slate-500">
				<ShieldCheck class="h-4 w-4 text-teal-700" />
				<span>Rekening Bersama Platform Indonesia Tours</span>
			</div>

			{#if booking.booking_status !== 'CANCELLED'}
				<button
					type="button"
					onclick={() => (showCancelModal = true)}
					class="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
				>
					Batal & Ajukan Refund
				</button>
			{/if}
		</div>
	</div>

	<!-- Cancellation Modal -->
	{#if showCancelModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
			<div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
				<div class="flex items-center gap-3 text-red-600 mb-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
						<AlertTriangle class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-sm font-bold text-slate-900">Batalkan Pesanan & Refund</h3>
						<p class="text-xs text-slate-500">Alur transparan pengembalian dana</p>
					</div>
				</div>

				<p class="text-xs text-slate-600 leading-relaxed">
					Apakah Anda yakin ingin membatalkan tiket untuk <strong>{tour.title}</strong>? Kursi Anda akan otomatis dikembalikan ke katalog dan status refund akan tercatat.
				</p>

				<form method="POST" action="?/cancel" class="mt-4 space-y-3">
					<div>
						<label class="block text-xs font-bold text-slate-700 mb-1">Alasan Pembatalan:</label>
						<select
							name="reason"
							bind:value={cancelReason}
							class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none"
						>
							<option value="Ada keperluan mendadak">Ada keperluan mendadak</option>
							<option value="Salah pilih tanggal keberangkatan">Salah pilih tanggal keberangkatan</option>
							<option value="Perubahan rencana liburan">Perubahan rencana liburan</option>
							<option value="Lainnya">Lainnya</option>
						</select>
					</div>

					<div class="mt-6 flex items-center justify-end gap-2">
						<button
							type="button"
							onclick={() => (showCancelModal = false)}
							class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
						>
							Tutup
						</button>
						<button
							type="submit"
							class="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
						>
							Ya, Batalkan Tiket
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

