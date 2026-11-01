<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Building2,
		ShieldCheck,
		FileText,
		CheckCircle2,
		XCircle,
		Clock,
		AlertCircle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Verifikasi & Kurasi Mitra — Back-Office Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Verifikasi Legalitas & Kurasi Mitra Operator
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Tinjau izin NIB, lisensi pemandu HPI, rekening bank, serta atur tarif bagi hasil komisi platform (10–15%).
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
		<!-- Mobile Card View (md:hidden) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each data.partners as p}
				<div class="p-4 space-y-3">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-extrabold text-slate-900 text-sm">{p.company_name}</h3>
							<span class="text-[10px] text-slate-400">ID: {p.id.slice(0, 8)}... • {p.city || '-'}</span>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase
							{p.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : p.verification_status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
							{#if p.verification_status === 'VERIFIED'}
								<CheckCircle2 class="h-3 w-3" />
								<span>VERIFIED</span>
							{:else if p.verification_status === 'PENDING'}
								<Clock class="h-3 w-3" />
								<span>PENDING</span>
							{:else}
								<XCircle class="h-3 w-3" />
								<span>REJECTED</span>
							{/if}
						</span>
					</div>

					<div class="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2">
						<div>
							<span class="text-[10px] text-slate-400 block">Legalitas:</span>
							<span class="font-mono text-[11px] text-slate-800 font-bold block">NIB: {p.nib || '-'}</span>
							<span class="text-[10px] text-teal-700 font-semibold">{p.hpi_license || 'HPI Terdaftar'}</span>
						</div>
						<div>
							<span class="text-[10px] text-slate-400 block">Rekening Bank:</span>
							<span class="font-bold text-slate-800 block text-[11px]">{p.bank_name || 'BCA'}</span>
							<span class="font-mono text-[10px] text-slate-500">{p.bank_account_no}</span>
						</div>
					</div>

					<div class="flex items-center justify-between border-t border-slate-100 pt-2.5">
						<span class="text-xs text-slate-600 font-semibold">
							Komisi: <strong class="text-slate-900">{p.commission_rate}%</strong>
						</span>

						<form method="POST" action="?/verifyPartner" class="inline-flex items-center gap-2">
							<input type="hidden" name="partner_id" value={p.id} />
							<input type="hidden" name="commission_rate" value={p.commission_rate} />

							{#if p.verification_status !== 'VERIFIED'}
								<button
									type="submit"
									name="status"
									value="VERIFIED"
									class="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
								>
									Setujui
								</button>
							{/if}

							{#if p.verification_status !== 'REJECTED'}
								<button
									type="submit"
									name="status"
									value="REJECTED"
									class="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
								>
									Tolak
								</button>
							{/if}
						</form>
					</div>
				</div>
			{/each}
		</div>

		<!-- Desktop Table View (hidden md:block) -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-100">
					<tr>
						<th class="py-3.5 px-4 sm:px-6">Nama Operator</th>
						<th class="py-3.5 px-4">Kota / Domisili</th>
						<th class="py-3.5 px-4">NIB & Lisensi HPI</th>
						<th class="py-3.5 px-4">Rekening Payout</th>
						<th class="py-3.5 px-4 text-center">Status Kurasi</th>
						<th class="py-3.5 px-4 text-center">Komisi (%)</th>
						<th class="py-3.5 px-4 sm:px-6 text-right">Aksi Otorisasi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.partners as p}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td class="py-4 px-4 sm:px-6">
								<span class="font-extrabold text-slate-900 block text-sm">{p.company_name}</span>
								<span class="text-[10px] text-slate-400">ID: {p.id.slice(0, 8)}...</span>
							</td>

							<td class="py-4 px-4 text-slate-600">
								{p.city || '-'}
							</td>

							<td class="py-4 px-4">
								<div class="font-mono text-slate-900">NIB: {p.nib || '-'}</div>
								<div class="text-[11px] text-teal-700 font-semibold">{p.hpi_license || 'HPI Terdaftar'}</div>
							</td>

							<td class="py-4 px-4">
								<span class="font-bold text-slate-900 block">{p.bank_name || 'BCA'}</span>
								<span class="font-mono text-[11px] text-slate-500">{p.bank_account_no} ({p.bank_account_name})</span>
							</td>

							<td class="py-4 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{p.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : p.verification_status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
									{#if p.verification_status === 'VERIFIED'}
										<CheckCircle2 class="h-3 w-3" />
										<span>VERIFIED</span>
									{:else if p.verification_status === 'PENDING'}
										<Clock class="h-3 w-3" />
										<span>PENDING</span>
									{:else}
										<XCircle class="h-3 w-3" />
										<span>REJECTED</span>
									{/if}
								</span>
							</td>

							<td class="py-4 px-4 text-center font-black text-slate-900">
								{p.commission_rate}%
							</td>

							<td class="py-4 px-4 sm:px-6 text-right">
								<form method="POST" action="?/verifyPartner" class="inline-flex items-center gap-1.5">
									<input type="hidden" name="partner_id" value={p.id} />
									<input type="hidden" name="commission_rate" value={p.commission_rate} />

									{#if p.verification_status !== 'VERIFIED'}
										<button
											type="submit"
											name="status"
											value="VERIFIED"
											class="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-sm"
										>
											Setujui
										</button>
									{/if}

									{#if p.verification_status !== 'REJECTED'}
										<button
											type="submit"
											name="status"
											value="REJECTED"
											class="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
										>
											Tolak
										</button>
									{/if}
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

