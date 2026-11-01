<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Wallet,
		ShieldCheck,
		ArrowRight,
		CheckCircle2,
		AlertCircle,
		Clock,
		Coins,
		Building2
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Klaim Pencairan Dana (Payout) — Portal Mitra</title>
</svelte:head>

<div class="space-y-8">
	<!-- Escrow Mechanism Header Card -->
	<div class="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-emerald-50 p-6 sm:p-8 shadow-sm">
		<div class="flex items-center gap-2 text-xs font-bold text-teal-800">
			<ShieldCheck class="h-4 w-4 text-teal-700" />
			<span>Mekanisme Rekening Bersama (Escrow Protection)</span>
		</div>
		<h2 class="mt-2 text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Pencairan Dana Hasil Penjualan Tiket
		</h2>
		<p class="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
			Dana tiket wisatawan ditampung aman di rekening platform sampai Anda menyelesaikan perjalanan tur.
			Setelah peserta membayar lunas, Anda dapat mengajukan klaim pencairan dana (dipotong komisi platform sebesar <strong>{data.commissionRate}%</strong>).
		</p>
	</div>

	{#if form?.message}
		<div class="flex items-center gap-2 rounded-2xl p-4 text-sm font-semibold {form.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}">
			{#if form.success}
				<CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-600" />
			{:else}
				<AlertCircle class="h-5 w-5 shrink-0 text-red-600" />
			{/if}
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Section 1: Eligible Bookings ready for Payout -->
	<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
			<div>
				<h3 class="text-base font-extrabold text-slate-900">Pesanan Lunas Siap Dicairkan</h3>
				<p class="text-xs text-slate-500">Tiket berstatus PAID yang belum diajukan pencairannya ke platform</p>
			</div>
			<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
				{data.eligibleBookings.length} Tiket
			</span>
		</div>

		<div class="space-y-3">
			{#each data.eligibleBookings as b}
				{@const commFee = Math.round(Number(b.total_price) * (Number(data.commissionRate) / 100))}
				{@const netAmount = Number(b.total_price) - commFee}
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 hover:border-orange-200 hover:bg-white transition-all">
					<div>
						<div class="flex items-center gap-2">
							<span class="font-mono font-bold text-slate-900 text-sm">{b.booking_code}</span>
							<span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
								{b.status}
							</span>
						</div>
						<h4 class="text-xs font-extrabold text-slate-800 mt-1">
							{b.schedule?.tour?.title || 'Paket Open Trip'}
						</h4>
						<p class="text-[11px] text-slate-500 mt-0.5">
							{b.pax_count} Peserta • Nilai Transaksi Bruto: <strong>{formatRupiah(b.total_price)}</strong>
						</p>
					</div>

					<div class="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0">
						<div class="text-right">
							<span class="block text-[10px] text-slate-400">Penerimaan Bersih (Net):</span>
							<span class="text-sm font-black text-emerald-700">{formatRupiah(netAmount)}</span>
							<span class="block text-[10px] text-slate-400">Komisi {data.commissionRate}%: -{formatRupiah(commFee)}</span>
						</div>

						<form method="POST" action="?/claimPayout">
							<input type="hidden" name="booking_id" value={b.id} />
							<button
								type="submit"
								class="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700 active:scale-95 transition-all"
							>
								<Wallet class="h-3.5 w-3.5" />
								<span>Klaim Payout</span>
							</button>
						</form>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					Tidak ada pesanan baru yang siap diklaim. Semua tiket lunas sudah diajukan atau belum ada pesanan baru.
				</div>
			{/each}
		</div>
	</div>

	<!-- Section 2: Riwayat Pengajuan Payout -->
	<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
		<div class="mb-4 pb-3 border-b border-slate-100">
			<h3 class="text-base font-extrabold text-slate-900">Riwayat & Status Klaim Pencairan Dana</h3>
			<p class="text-xs text-slate-500">Pelacakan proses otorisasi dan pelepasan dana oleh Admin Back-Office</p>
		</div>

		<!-- Mobile Card View (md:hidden) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each data.payouts as p}
				<div class="py-3.5 space-y-2">
					<div class="flex items-center justify-between">
						<span class="font-mono font-bold text-slate-900 text-xs">
							{p.booking?.booking_code || '-'}
						</span>
						<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase
							{p.payout_status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : p.payout_status === 'AUTHORIZED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
							{#if p.payout_status === 'RELEASED'}
								<CheckCircle2 class="h-3 w-3" />
								<span>DIRILIS</span>
							{:else if p.payout_status === 'AUTHORIZED'}
								<CheckCircle2 class="h-3 w-3" />
								<span>DISETUJUI</span>
							{:else}
								<Clock class="h-3 w-3" />
								<span>MENUNGGU</span>
							{/if}
						</span>
					</div>

					<div class="flex items-center justify-between text-xs">
						<div>
							<span class="text-[10px] text-slate-400 block">Bruto:</span>
							<span class="font-semibold text-slate-700">{formatRupiah(p.gross_amount)}</span>
						</div>
						<div>
							<span class="text-[10px] text-slate-400 block">Komisi ({p.commission_rate}%):</span>
							<span class="text-slate-500">-{formatRupiah(p.commission_fee)}</span>
						</div>
						<div class="text-right">
							<span class="text-[10px] text-slate-400 block">Net Payout:</span>
							<span class="font-black text-emerald-700">{formatRupiah(p.net_amount)}</span>
						</div>
					</div>

					<div class="text-[10px] text-slate-400 text-right">
						Diajukan: {new Date(p.requested_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					Belum ada riwayat permohonan pencairan dana.
				</div>
			{/each}
		</div>

		<!-- Desktop Table View (hidden md:block) -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
					<tr>
						<th class="py-3 px-4">Booking Ref</th>
						<th class="py-3 px-4">Nilai Bruto</th>
						<th class="py-3 px-4">Komisi Platform</th>
						<th class="py-3 px-4">Net Payout</th>
						<th class="py-3 px-4 text-center">Status</th>
						<th class="py-3 px-4 text-right">Tanggal Diajukan</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.payouts as p}
						<tr class="hover:bg-slate-50/50">
							<td class="py-3.5 px-4 font-mono font-bold text-slate-900">
								{p.booking?.booking_code || '-'}
							</td>
							<td class="py-3.5 px-4 font-bold text-slate-800">
								{formatRupiah(p.gross_amount)}
							</td>
							<td class="py-3.5 px-4 text-slate-500">
								-{formatRupiah(p.commission_fee)} <span class="text-[10px]">({p.commission_rate}%)</span>
							</td>
							<td class="py-3.5 px-4 font-black text-emerald-700">
								{formatRupiah(p.net_amount)}
							</td>
							<td class="py-3.5 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{p.payout_status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : p.payout_status === 'AUTHORIZED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
									{#if p.payout_status === 'RELEASED'}
										<CheckCircle2 class="h-3 w-3" />
										<span>DIRILIS (LUNAS)</span>
									{:else if p.payout_status === 'AUTHORIZED'}
										<CheckCircle2 class="h-3 w-3" />
										<span>DISETUJUI</span>
									{:else}
										<Clock class="h-3 w-3" />
										<span>MENUNGGU REVIEW</span>
									{/if}
								</span>
							</td>
							<td class="py-3.5 px-4 text-right text-slate-500 font-normal">
								{new Date(p.requested_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="py-8 text-center text-xs text-slate-400">
								Belum ada riwayat permohonan pencairan dana.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

