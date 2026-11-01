<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Building2,
		ShieldCheck,
		FileText,
		CheckCircle2,
		AlertCircle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let companyName = $state(data.partner?.company_name || '');
	let city = $state(data.partner?.city || '');
	let bankName = $state(data.partner?.bank_name || 'BCA');
	let bankAccountNo = $state(data.partner?.bank_account_no || '');
	let bankAccountName = $state(data.partner?.bank_account_name || '');
</script>

<svelte:head>
	<title>Legalitas & Rekening — Portal Mitra</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6">
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Legalitas & Rekening Operator
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Informasi legalitas usaha berlisensi dan rekening tujuan pencairan dana (escrow payout).
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

	<!-- Status Card -->
	<div class="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="flex items-center gap-3.5 min-w-0 flex-1">
			<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
				<ShieldCheck class="h-6 w-6" />
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<h3 class="text-base font-extrabold text-slate-900">Status Kemitraan: {data.partner?.verification_status || 'VERIFIED'}</h3>
				</div>
				<p class="text-xs text-slate-600 mt-0.5">
					Legalitas NIB dan lisensi HPI telah terverifikasi oleh Tim Kurasi Indonesia Tours.
				</p>
			</div>
		</div>
		<div class="text-left sm:text-right shrink-0">
			<span class="block text-[10px] font-bold text-slate-500 uppercase">Potongan Komisi</span>
			<span class="text-lg font-black text-emerald-800">{data.partner?.commission_rate || '10'}%</span>
		</div>
	</div>

	<!-- Form Update -->
	<div class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
		<form method="POST" action="?/updateLegalProfile" class="space-y-5">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="profil-comp" class="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Operator *</label>
					<input
						id="profil-comp"
						type="text"
						name="company_name"
						bind:value={companyName}
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="profil-city" class="block text-xs font-bold text-slate-700 mb-1">Kota / Domisili *</label>
					<input
						id="profil-city"
						type="text"
						name="city"
						bind:value={city}
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="profil-nib" class="block text-xs font-bold text-slate-700 mb-1">Nomor Induk Berusaha (NIB)</label>
					<input
						id="profil-nib"
						type="text"
						disabled
						value={data.partner?.nib || '-'}
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 cursor-not-allowed"
					/>
				</div>

				<div>
					<label for="profil-hpi" class="block text-xs font-bold text-slate-700 mb-1">Nomor Lisensi Pramuwisata HPI</label>
					<input
						id="profil-hpi"
						type="text"
						disabled
						value={data.partner?.hpi_license || 'HPI-TERDAFTAR'}
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 cursor-not-allowed"
					/>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
				<h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Rekening Tujuan Pencairan Dana</h4>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label for="profil-bank" class="block text-[11px] font-bold text-slate-600 mb-1">Nama Bank *</label>
						<select
							id="profil-bank"
							name="bank_name"
							bind:value={bankName}
							class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						>
							<option value="BCA">BCA (Bank Central Asia)</option>
							<option value="Bank Mandiri">Bank Mandiri</option>
							<option value="BNI">BNI (Bank Negara Indonesia)</option>
							<option value="BRI">BRI (Bank Rakyat Indonesia)</option>
						</select>
					</div>

					<div>
						<label for="profil-accno" class="block text-[11px] font-bold text-slate-600 mb-1">Nomor Rekening *</label>
						<input
							id="profil-accno"
							type="text"
							name="bank_account_no"
							bind:value={bankAccountNo}
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>

					<div>
						<label for="profil-accname" class="block text-[11px] font-bold text-slate-600 mb-1">Nama Pemilik Rekening *</label>
						<input
							id="profil-accname"
							type="text"
							name="bank_account_name"
							bind:value={bankAccountName}
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>
			</div>

			<div class="pt-2">
				<button
					type="submit"
					class="rounded-xl bg-orange-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-95 transition-all"
				>
					Simpan Rekening & Profil
				</button>
			</div>
		</form>
	</div>
</div>

