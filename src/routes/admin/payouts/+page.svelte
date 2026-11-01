<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Wallet,
		ShieldCheck,
		CheckCircle2,
		Clock,
		Coins,
		ArrowRight,
		AlertCircle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Otorisasi Payout Rekber — Back-Office Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Otorisasi & Rilis Pencairan Dana Rekber (Escrow Payout)
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Verifikasi dan rilis dana tiket wisatawan ke rekening mitra operator setelah dipotong komisi platform secara transparan.
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

	<div class="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
		<!-- Mobile Card View (Phone screens) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each data.payouts as p}
				<div class="p-4 space-y-3">
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0 flex-1">
							<span class="font-extrabold text-slate-900 block text-sm">
								{p.partner?.company_name || 'Mitra Tour'}
							</span>
							<div class="text-[11px] text-slate-500 font-mono mt-0.5 break-all">
								{p.partner?.bank_name} {p.partner?.bank_account_no} ({p.partner?.bank_account_name})
							</div>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase shrink-0
							{p.payout_status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : p.payout_status === 'AUTHORIZED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
							{#if p.payout_status === 'RELEASED'}
								<CheckCircle2 class="h-3 w-3" />
								<span>DIRILIS</span>
							{:else if p.payout_status === 'AUTHORIZED'}
								<Clock class="h-3 w-3" />
								<span>DISETUJUI</span>
							{:else}
								<Clock class="h-3 w-3" />
								<span>REQUESTED</span>
							{/if}
						</span>
					</div>

					<div class="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Booking Ref</span>
							<span class="font-mono font-bold text-slate-900">{p.booking?.booking_code || '-'}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Nilai Bruto</span>
							<span class="font-bold text-slate-800">{formatRupiah(p.gross_amount)}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Komisi Platform</span>
							<span class="font-black text-teal-700">+{formatRupiah(p.commission_fee)} <span class="text-[10px] font-normal text-slate-400">({p.commission_rate}%)</span></span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Net ke Mitra</span>
							<span class="font-black text-emerald-700">{formatRupiah(p.net_amount)}</span>
						</div>
					</div>

					<div>
						{#if p.payout_status === 'REQUESTED'}
							<form method="POST" action="?/authorizePayout" class="w-full">
								<input type="hidden" name="payout_id" value={p.id} />
								<button
									type="submit"
									class="w-full rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
								>
									Otorisasi Payout
								</button>
							</form>
						{:else if p.payout_status === 'AUTHORIZED'}
							<form method="POST" action="?/releasePayout" class="w-full">
								<input type="hidden" name="payout_id" value={p.id} />
								<button
									type="submit"
									class="w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
								>
									Rilis Dana Sekarang
								</button>
							</form>
						{:else}
							<div class="text-center py-1 text-xs text-slate-400 font-normal">
								Selesai ({p.released_at ? new Date(p.released_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'OK'})
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="p-8 text-center text-xs text-slate-400">
					Belum ada permohonan pencairan dana (payout) yang diajukan oleh mitra.
				</div>
			{/each}
		</div>

		<!-- Desktop & Tablet Spreadsheet Table -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-100">
					<tr>
						<th class="py-3.5 px-4 sm:px-6">Mitra & Rekening Tujuan</th>
						<th class="py-3.5 px-4">Booking Ref</th>
						<th class="py-3.5 px-4">Nilai Bruto</th>
						<th class="py-3.5 px-4">Komisi Platform</th>
						<th class="py-3.5 px-4">Transfer Bersih (Net)</th>
						<th class="py-3.5 px-4 text-center">Status</th>
						<th class="py-3.5 px-4 sm:px-6 text-right">Otorisasi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.payouts as p}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td class="py-4 px-4 sm:px-6">
								<span class="font-extrabold text-slate-900 block text-sm">
									{p.partner?.company_name || 'Mitra Tour'}
								</span>
								<div class="text-[11px] text-slate-500 font-mono mt-0.5">
									{p.partner?.bank_name} {p.partner?.bank_account_no} ({p.partner?.bank_account_name})
								</div>
							</td>

							<td class="py-4 px-4 font-mono font-bold text-slate-900">
								{p.booking?.booking_code || '-'}
							</td>

							<td class="py-4 px-4 font-bold text-slate-800">
								{formatRupiah(p.gross_amount)}
							</td>

							<td class="py-4 px-4 text-teal-700 font-black">
								+{formatRupiah(p.commission_fee)} <span class="text-[10px] font-normal text-slate-400">({p.commission_rate}%)</span>
							</td>

							<td class="py-4 px-4 font-black text-emerald-700 text-sm">
								{formatRupiah(p.net_amount)}
							</td>

							<td class="py-4 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{p.payout_status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : p.payout_status === 'AUTHORIZED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
									{#if p.payout_status === 'RELEASED'}
										<CheckCircle2 class="h-3 w-3" />
										<span>DIRILIS</span>
									{:else if p.payout_status === 'AUTHORIZED'}
										<Clock class="h-3 w-3" />
										<span>DISETUJUI</span>
									{:else}
										<Clock class="h-3 w-3" />
										<span>REQUESTED</span>
									{/if}
								</span>
							</td>

							<td class="py-4 px-4 sm:px-6 text-right">
								{#if p.payout_status === 'REQUESTED'}
									<form method="POST" action="?/authorizePayout" class="inline-block">
										<input type="hidden" name="payout_id" value={p.id} />
										<button
											type="submit"
											class="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 shadow-sm"
										>
											Otorisasi
										</button>
									</form>
								{:else if p.payout_status === 'AUTHORIZED'}
									<form method="POST" action="?/releasePayout" class="inline-block">
										<input type="hidden" name="payout_id" value={p.id} />
										<button
											type="submit"
											class="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-sm"
										>
											Rilis Dana
										</button>
									</form>
								{:else}
									<span class="text-[11px] text-slate-400 font-normal">
										Selesai ({p.released_at ? new Date(p.released_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'OK'})
									</span>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="py-12 text-center text-xs text-slate-400">
								Belum ada permohonan pencairan dana (payout) yang diajukan oleh mitra.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

