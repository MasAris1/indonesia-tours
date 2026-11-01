<script lang="ts">
	import type { ActionData } from './$types';
	import { Building2, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();

	let companyName = $state('');
	let city = $state('Malang, Jawa Timur');
	let nib = $state('9120008899123');
	let hpiLicense = $state('HPI-JATIM-2026-441');
	let bankName = $state('Bank Central Asia (BCA)');
	let bankAccountNo = $state('8291002345');
	let bankAccountName = $state('CV Wisata Petualang');
</script>

<svelte:head>
	<title>Daftar Mitra Operator Tur — Indonesia Tours</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<!-- Hero Header -->
	<div class="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 sm:p-10 shadow-sm">
		<div class="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
			<Building2 class="h-4 w-4" />
			<span>Fase 3 — Portal Mitra Terverifikasi</span>
		</div>
		<h1 class="mt-4 text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
			Bermitra dengan Indonesia Tours
		</h1>
		<p class="mt-2 text-sm text-slate-600 leading-relaxed">
			Jangkau ribuan petualang di seluruh Indonesia dengan jaminan kepastian kuota kursi real-time,
			pembayaran instan via rekber escrow, dan transparansi pencairan dana tanpa ribet.
		</p>

		<div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-orange-200/60 pt-5 text-xs">
			<div class="flex items-center gap-2 font-semibold text-slate-700">
				<ShieldCheck class="h-4 w-4 text-emerald-600 shrink-0" />
				<span>Legalitas NIB & Lisensi HPI</span>
			</div>
			<div class="flex items-center gap-2 font-semibold text-slate-700">
				<CheckCircle2 class="h-4 w-4 text-teal-600 shrink-0" />
				<span>Anti-Overbooking Atomik</span>
			</div>
			<div class="flex items-center gap-2 font-semibold text-slate-700">
				<CheckCircle2 class="h-4 w-4 text-orange-600 shrink-0" />
				<span>Komisi Platform Flat 10%</span>
			</div>
		</div>
	</div>

	{#if form?.message}
		<div class="mt-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 border border-red-200">
			<AlertCircle class="h-5 w-5 shrink-0 text-red-600" />
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Registration Form -->
	<div class="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
		<h2 class="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100">
			Formulir Pengajuan Legalitas & Rekening Operator
		</h2>

		<form method="POST" action="?/registerPartner" class="space-y-5">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="company-name" class="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Operator Tur *</label>
					<input
						id="company-name"
						type="text"
						name="company_name"
						bind:value={companyName}
						placeholder="Contoh: Bromo Highland Adventure"
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="city" class="block text-xs font-bold text-slate-700 mb-1">Kota / Domisili Operasional *</label>
					<input
						id="city"
						type="text"
						name="city"
						bind:value={city}
						placeholder="Contoh: Malang / Labuan Bajo"
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="nib" class="block text-xs font-bold text-slate-700 mb-1">Nomor Induk Berusaha (NIB) *</label>
					<input
						id="nib"
						type="text"
						name="nib"
						bind:value={nib}
						placeholder="13 digit NIB legal"
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="hpi" class="block text-xs font-bold text-slate-700 mb-1">Nomor Lisensi Pramuwisata HPI</label>
					<input
						id="hpi"
						type="text"
						name="hpi_license"
						bind:value={hpiLicense}
						placeholder="Nomor sertifikasi HPI tour guide"
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Data Rekening Bank Pencairan Dana Payout</h3>
				
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label for="bank-name" class="block text-[11px] font-bold text-slate-600 mb-1">Nama Bank *</label>
						<select
							id="bank-name"
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
						<label for="account-no" class="block text-[11px] font-bold text-slate-600 mb-1">Nomor Rekening *</label>
						<input
							id="account-no"
							type="text"
							name="bank_account_no"
							bind:value={bankAccountNo}
							placeholder="1234567890"
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>

					<div>
						<label for="account-name" class="block text-[11px] font-bold text-slate-600 mb-1">Nama Pemilik Rekening *</label>
						<input
							id="account-name"
							type="text"
							name="bank_account_name"
							bind:value={bankAccountName}
							placeholder="Nama tertera di buku tabungan"
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>
			</div>

			<div class="pt-3">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
				>
					<span>Daftarkan Operator & Buka Portal Mitra</span>
					<ArrowRight class="h-4 w-4" />
				</button>
			</div>
		</form>
	</div>
</div>

