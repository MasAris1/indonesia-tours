<script lang="ts">
	import type { ActionData, PageProps } from './$types';
	import {
		Clock,
		ShieldCheck,
		QrCode,
		Building2,
		Copy,
		CheckCircle2,
		AlertCircle,
		Sparkles,
		ArrowRight,
		Tag
	} from '@lucide/svelte';

	let { data, form }: { data: PageProps['data']; form: ActionData } = $props();

	let details = $derived(data.bookingDetails);
	let booking = $derived(details.booking);
	let tour = $derived(details.tour);
	let schedule = $derived(details.schedule);
	let activePayment = $derived(form?.charge || details.payment);

	let selectedMethod = $state<'qris' | 'va'>('qris');
	let selectedBank = $state('bca');
	let copied = $state(false);
	let promoInput = $state('LIBURANSERU');

	// Countdown logic (15 minutes from created_date or expires_at)
	let timeLeft = $state('14:59');
	let isExpired = $state(false);

	$effect(() => {
		const targetTime = new Date(booking.expires_at).getTime();

		function updateTimer() {
			const now = Date.now();
			const diff = Math.max(0, targetTime - now);
			if (diff <= 0) {
				timeLeft = '00:00';
				isExpired = true;
				return;
			}
			const m = Math.floor(diff / 60000);
			const s = Math.floor((diff % 60000) / 1000);
			timeLeft = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		}

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	});

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount).toLocaleString('id-ID');
	}

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function copyToClipboard(text: string) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 2500);
		}
	}
</script>

<svelte:head>
	<title>Pembayaran Aman — {booking.booking_code} — Indonesia Tours</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Countdown / Expiration Banner -->
	<div class="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border {isExpired ? 'border-red-300 bg-red-50 text-red-800' : 'border-amber-300 bg-amber-50/80 text-amber-900'} p-4 shadow-sm">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {isExpired ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-900'}">
				<Clock class="h-5 w-5" />
			</div>
			<div>
				{#if isExpired}
					<h3 class="text-xs sm:text-sm font-bold text-red-900">Batas Waktu Pembayaran Telah Habis</h3>
					<p class="text-[11px] text-red-700">Kursi Anda telah dilepas kembali ke katalog publik.</p>
				{:else}
					<h3 class="text-xs sm:text-sm font-bold text-amber-900">Selesaikan Pembayaran Sebelum Waktu Habis</h3>
					<p class="text-[11px] text-amber-700">Kursi Anda dijamin aman terkunci selama countdown berjalan (15 Menit).</p>
				{/if}
			</div>
		</div>

		<div class="rounded-xl bg-white px-4 py-2 text-center shadow-sm border border-slate-200">
			<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sisa Waktu</span>
			<div class="font-mono text-xl sm:text-2xl font-extrabold {isExpired ? 'text-red-600' : 'text-amber-600'}">
				{timeLeft}
			</div>
		</div>
	</div>

	<!-- Main Payment Grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-12">
		<!-- Left: Payment Method & Instructions (7 cols) -->
		<div class="space-y-6 md:col-span-7">
			<!-- Order Details Summary Card -->
			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-100 pb-3">
					<div>
						<span class="text-[11px] font-semibold text-slate-400 uppercase">Kode Booking</span>
						<div class="font-mono text-base font-extrabold text-teal-800">{booking.booking_code}</div>
					</div>
					<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
						Menunggu Pembayaran
					</span>
				</div>

				<div class="mt-4 flex gap-4">
					<img
						src={tour.cover_image_url}
						alt={tour.title}
						class="h-16 w-20 rounded-xl object-cover"
					/>
					<div class="text-xs">
						<h4 class="font-bold text-slate-900 line-clamp-1">{tour.title}</h4>
						<p class="text-slate-500 mt-0.5">{formatDate(schedule.departure_date)} • {booking.pax_count} Peserta</p>
						<p class="text-slate-500">Pemesan: <strong class="text-slate-700">{booking.contact_name}</strong></p>
					</div>
				</div>
			</div>

			<!-- Payment Method Selector (if not yet chosen) -->
			{#if !activePayment}
				<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<h3 class="text-sm font-bold text-slate-900 mb-4">Pilih Metode Pembayaran</h3>

					<form method="POST" action="?/charge" class="space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<!-- QRIS Option -->
							<label
								class="flex cursor-pointer flex-col rounded-xl border p-4 transition-all {selectedMethod === 'qris'
									? 'border-teal-700 bg-teal-50/50 shadow-sm'
									: 'border-slate-200 hover:border-slate-300'}"
							>
								<div class="flex items-center gap-2">
									<input
										type="radio"
										name="method"
										value="qris"
										bind:group={selectedMethod}
										class="text-teal-700"
									/>
									<span class="text-xs font-bold text-slate-900">QRIS Instan</span>
								</div>
								<p class="mt-2 text-[11px] text-slate-500">
									BCA, GoPay, ShopeePay, OVO, Dana & m-Banking.
								</p>
							</label>

							<!-- Virtual Account Option -->
							<label
								class="flex cursor-pointer flex-col rounded-xl border p-4 transition-all {selectedMethod === 'va'
									? 'border-teal-700 bg-teal-50/50 shadow-sm'
									: 'border-slate-200 hover:border-slate-300'}"
							>
								<div class="flex items-center gap-2">
									<input
										type="radio"
										name="method"
										value="va"
										bind:group={selectedMethod}
										class="text-teal-700"
									/>
									<span class="text-xs font-bold text-slate-900">Virtual Account</span>
								</div>
								<p class="mt-2 text-[11px] text-slate-500">
									BCA, Mandiri, BNI, BRI otomatis verifikasi.
								</p>
							</label>
						</div>

						{#if selectedMethod === 'va'}
							<div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<label for="select-bank-checkout" class="block text-xs font-bold text-slate-700 mb-2">Pilih Bank:</label>
								<select
									id="select-bank-checkout"
									name="bank"
									bind:value={selectedBank}
									class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
								>
									<option value="bca">BCA Virtual Account</option>
									<option value="bni">BNI Virtual Account</option>
									<option value="bri">BRI Virtual Account (BRIVA)</option>
									<option value="mandiri">Mandiri Bill Payment</option>
								</select>
							</div>
						{/if}

						<button
							type="submit"
							disabled={isExpired}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 disabled:opacity-50"
						>
							<span>Lanjutkan Pembayaran</span>
							<ArrowRight class="h-4 w-4" />
						</button>
					</form>
				</div>
			{:else}
				<!-- Active Payment Display (QR Code or VA Number) -->
				<div class="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<div class="flex items-center gap-2">
							{#if activePayment.paymentMethod === 'QRIS' || activePayment.qrUrl || activePayment.qrString}
								<QrCode class="h-5 w-5 text-teal-700" />
								<span class="font-bold text-slate-900">Pembayaran via QRIS</span>
							{:else}
								<Building2 class="h-5 w-5 text-teal-700" />
								<span class="font-bold text-slate-900">Virtual Account {activePayment.bank || 'BCA'}</span>
							{/if}
						</div>
						<span class="rounded bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800">
							Menunggu Scan / Transfer
						</span>
					</div>

					<!-- QR Code Render -->
					{#if activePayment.qrUrl || activePayment.qrString}
						<div class="mt-6 flex flex-col items-center justify-center text-center">
							<div class="rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
								<img
									src={activePayment.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activePayment.qrString)}`}
									alt="QRIS Pembayaran"
									class="h-56 w-56 object-contain"
								/>
							</div>
							<p class="mt-3 text-xs font-semibold text-slate-600">
								Pindai kode QRIS di atas menggunakan aplikasi mobile banking atau e-wallet Anda.
							</p>
						</div>
					{:else if activePayment.vaNumber}
						<!-- Virtual Account Render -->
						<div class="mt-6 rounded-2xl bg-slate-50 p-5 text-center border border-slate-200">
							<span class="text-xs font-semibold text-slate-500">Nomor Virtual Account ({activePayment.bank || 'BCA'})</span>
							<div class="mt-2 flex items-center justify-center gap-3">
								<span class="font-mono text-lg sm:text-2xl font-black tracking-wider text-slate-900 break-all">
									{activePayment.vaNumber}
								</span>
								<button
									type="button"
									onclick={() => copyToClipboard(activePayment.vaNumber)}
									class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
									title="Salin Nomor VA"
								>
									{#if copied}
										<CheckCircle2 class="h-4 w-4 text-emerald-600" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
							</div>
							{#if copied}
								<p class="mt-1 text-[11px] font-bold text-emerald-600">Berhasil disalin ke clipboard!</p>
							{/if}
						</div>
					{/if}

					<!-- Instructions -->
					<div class="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-2">
						<h4 class="font-bold text-slate-800">Petunjuk Pembayaran:</h4>
						<ol class="list-decimal pl-4 space-y-1">
							<li>Buka aplikasi perbankan digital atau e-wallet Anda.</li>
							<li>Pilih menu <strong>Bayar / QRIS</strong> atau <strong>Transfer Virtual Account</strong>.</li>
							<li>Pastikan nominal tagihan tepat <strong>{formatRupiah(Number(booking.total_price))}</strong>.</li>
							<li>Setelah transaksi berhasil, sistem akan otomatis memperbarui status Anda ke <strong>PAID</strong>.</li>
						</ol>
					</div>

					<!-- Local Interactive Simulator Button (Sandbox / Demo mode only) -->
					{#if data.isSimulatedAllowed}
						<div class="mt-6 rounded-2xl border border-dashed border-teal-300 bg-teal-50/70 p-4">
							<div class="flex items-center gap-2 text-xs font-bold text-teal-900 mb-2">
								<Sparkles class="h-4 w-4 text-teal-700" />
								<span>Mode Simulasi Pembayaran (Midtrans Sandbox / Local)</span>
							</div>
							<p class="text-[11px] text-slate-600 mb-3">
								Uji alur bayar instan di lingkungan pengembangan tanpa perlu transfer saldo beneran:
							</p>
							<form method="POST" action="?/simulate_pay">
								<button
									type="submit"
									class="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-900 active:scale-95"
								>
									<CheckCircle2 class="h-4 w-4 text-emerald-300" />
									<span>⚡ Simulasi Bayar Instan (Sandbox)</span>
								</button>
							</form>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right: Promo & Price Summary (5 cols) -->
		<div class="space-y-6 md:col-span-5">
			<!-- Promo / Voucher Box (Fase 4 Feature) -->
			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
				<div class="flex items-center gap-2 text-xs font-extrabold text-slate-900">
					<Tag class="h-4 w-4 text-orange-600" />
					<span>Gunakan Kode Voucher / Promo (Fase 4)</span>
				</div>

				{#if form?.message && form?.promoSuccess}
					<div class="flex items-center gap-1.5 rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800 border border-emerald-200">
						<CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600" />
						<span>{form.message}</span>
					</div>
				{:else if form?.message && !form?.promoSuccess && !form?.charge}
					<div class="flex items-center gap-1.5 rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-800 border border-red-200">
						<AlertCircle class="h-4 w-4 shrink-0 text-red-600" />
						<span>{form.message}</span>
					</div>
				{/if}

				<form method="POST" action="?/apply_promo" class="flex gap-2">
					<input
						type="text"
						name="promo_code"
						bind:value={promoInput}
						placeholder="KODE PROMO"
						class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-extrabold uppercase text-slate-800 focus:border-teal-700 focus:outline-none"
					/>
					<button
						type="submit"
						class="rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800"
					>
						Terapkan
					</button>
				</form>

				<!-- Quick Chips -->
				<div class="flex flex-wrap items-center gap-1.5 pt-1">
					<span class="text-[10px] text-slate-400 font-semibold">Coba:</span>
					<button
						type="button"
						onclick={() => promoInput = 'LIBURANSERU'}
						class="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800"
					>
						LIBURANSERU (-100rb)
					</button>
					<button
						type="button"
						onclick={() => promoInput = 'LONGWEEKEND10'}
						class="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800"
					>
						LONGWEEKEND10 (-10%)
					</button>
				</div>
			</div>

			<!-- Total Bill Box -->
			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Pembayaran</h3>

				<div class="mt-4 space-y-2 text-xs text-slate-600">
					<div class="flex items-center justify-between">
						<span>Tiket ({booking.pax_count} pax)</span>
						<span class="font-semibold text-slate-800">{formatRupiah(Number(booking.total_price))}</span>
					</div>

					{#if form?.promoResult}
						<div class="flex items-center justify-between text-emerald-700 font-bold">
							<span>Potongan Voucher ({form.promoResult.code})</span>
							<span>-{formatRupiah(form.promoResult.discount_amount)}</span>
						</div>
					{/if}

					<div class="flex items-center justify-between">
						<span>Biaya Escrow Rekber</span>
						<span class="font-semibold text-emerald-600">Gratis (Rp 0)</span>
					</div>
					<div class="flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-extrabold text-slate-900">
						<span>Total Pembayaran</span>
						<span class="text-lg text-teal-800">{formatRupiah(Number(booking.total_price))}</span>
					</div>
				</div>
			</div>

			<!-- Rekber Security Badge -->
			<div class="rounded-2xl border border-teal-200 bg-teal-50/70 p-5">
				<div class="flex items-start gap-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">
						<ShieldCheck class="h-5 w-5" />
					</div>
					<div>
						<h4 class="text-xs sm:text-sm font-bold text-teal-950">
							Proteksi Rekening Bersama (Escrow)
						</h4>
						<p class="mt-1 text-xs text-slate-600 leading-relaxed">
							Dana Anda tidak langsung masuk ke rekening pribadi operator tur. Uang dijamin aman ditahan di platform Indonesia Tours sampai perjalanan Anda selesai dengan lancar.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
