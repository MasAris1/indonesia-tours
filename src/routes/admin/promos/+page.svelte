<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Tag,
		PlusCircle,
		CheckCircle2,
		AlertCircle,
		Clock,
		Coins
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let code = $state('WEEKENDHEMAT');
	let description = $state('Potongan Rp 75.000 untuk petualangan akhir pekan');
	let discountType = $state('FIXED');
	let discountValue = $state(75000);
	let minSpend = $state(500000);
	let quota = $state(50);

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Kelola Kode Promo & Voucher — Back-Office Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Manajemen Kode Promo & Voucher Diskon (Fase 4)
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Buat kupon diskon untuk menarik minat wisatawan dan promosikan perjalanan open trip hemat.
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

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left: Create Promo Form -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
			<h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
				<PlusCircle class="h-4 w-4 text-teal-700" />
				<span>Tambah Kode Promo Baru</span>
			</h3>

			<form method="POST" action="?/createPromo" class="space-y-3.5 text-xs">
				<div>
					<label for="promo-code" class="block font-bold text-slate-700 mb-1">Kode Voucher (KAPITAL) *</label>
					<input
						id="promo-code"
						type="text"
						name="code"
						bind:value={code}
						placeholder="Mis: INDONESIABARU"
						required
						class="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-extrabold text-slate-900 uppercase focus:border-teal-700 focus:outline-none"
					/>
				</div>

				<div>
					<label for="promo-desc" class="block font-bold text-slate-700 mb-1">Deskripsi Promo</label>
					<input
						id="promo-desc"
						type="text"
						name="description"
						bind:value={description}
						placeholder="Deskripsi diskon"
						class="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:border-teal-700 focus:outline-none"
					/>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label for="promo-type" class="block font-bold text-slate-700 mb-1">Tipe Diskon *</label>
						<select
							id="promo-type"
							name="discount_type"
							bind:value={discountType}
							class="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:border-teal-700 focus:outline-none"
						>
							<option value="FIXED">Nominal Tetap (IDR)</option>
							<option value="PERCENTAGE">Persentase (%)</option>
						</select>
					</div>

					<div>
						<label for="promo-val" class="block font-bold text-slate-700 mb-1">Nilai Potongan *</label>
						<input
							id="promo-val"
							type="number"
							name="discount_value"
							bind:value={discountValue}
							min="1"
							required
							class="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-900 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label for="promo-min" class="block font-bold text-slate-700 mb-1">Min. Belanja (IDR)</label>
						<input
							id="promo-min"
							type="number"
							name="min_spend"
							bind:value={minSpend}
							min="0"
							step="10000"
							class="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:border-teal-700 focus:outline-none"
						/>
					</div>

					<div>
						<label for="promo-quota" class="block font-bold text-slate-700 mb-1">Total Kuota</label>
						<input
							id="promo-quota"
							type="number"
							name="quota"
							bind:value={quota}
							min="1"
							class="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800 focus:border-teal-700 focus:outline-none"
						/>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						class="w-full rounded-xl bg-teal-700 py-2.5 font-bold text-white shadow-sm hover:bg-teal-800 active:scale-95 transition-all"
					>
						Buat & Aktifkan Promo
					</button>
				</div>
			</form>
		</div>

		<!-- Right: Promo Codes Table -->
		<div class="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
			<div class="p-4 border-b border-slate-100 flex items-center justify-between">
				<h3 class="text-sm font-extrabold text-slate-900">Daftar Voucher Aktif di Sistem</h3>
				<span class="text-xs text-slate-500">{data.promos?.length || 0} kupon</span>
			</div>

			<!-- Mobile Card View (Phone screens) -->
			<div class="block md:hidden divide-y divide-slate-100">
				{#each data.promos as promo}
					<div class="p-4 space-y-2.5">
						<div class="flex items-start justify-between gap-2">
							<div>
								<span class="font-mono font-black text-slate-900 text-sm">{promo.code}</span>
								<span class="block text-[11px] text-slate-500 mt-0.5">
									{promo.description || '-'}
								</span>
							</div>
							<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase shrink-0
								{promo.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
								{promo.is_active ? 'AKTIF' : 'NONAKTIF'}
							</span>
						</div>

						<div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
							<div>
								<span class="text-[10px] font-bold text-slate-400 uppercase block">Diskon</span>
								<span class="font-black text-emerald-700">
									{#if promo.discount_type === 'FIXED'}
										{formatRupiah(promo.discount_value)}
									{:else}
										{promo.discount_value}% OFF
									{/if}
								</span>
							</div>
							<div>
								<span class="text-[10px] font-bold text-slate-400 uppercase block">Min. Belanja</span>
								<span class="font-semibold text-slate-700">{formatRupiah(promo.min_spend)}</span>
							</div>
							<div>
								<span class="text-[10px] font-bold text-slate-400 uppercase block">Terpakai</span>
								<span class="font-bold text-slate-800">{promo.used_count}<span class="text-slate-400 font-normal">/{promo.quota}</span></span>
							</div>
						</div>

						<form method="POST" action="?/togglePromoStatus" class="w-full">
							<input type="hidden" name="id" value={promo.id} />
							<input type="hidden" name="is_active" value={String(promo.is_active)} />
							<button
								type="submit"
								class="w-full rounded-xl py-2 text-xs font-bold border transition-colors
									{promo.is_active ? 'border-red-200 text-red-700 hover:bg-red-50 bg-red-50/30' : 'border-teal-200 text-teal-700 hover:bg-teal-50 bg-teal-50/30'}"
							>
								{promo.is_active ? 'Nonaktifkan Kupon' : 'Aktifkan Kupon'}
							</button>
						</form>
					</div>
				{:else}
					<div class="py-8 text-center text-xs text-slate-400">
						Belum ada kupon diskon.
					</div>
				{/each}
			</div>

			<!-- Desktop & Tablet Spreadsheet Table -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left text-xs">
					<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-100">
						<tr>
							<th class="py-3 px-4">Kode Voucher</th>
							<th class="py-3 px-4">Nilai Diskon</th>
							<th class="py-3 px-4">Min. Belanja</th>
							<th class="py-3 px-4 text-center">Pemakaian</th>
							<th class="py-3 px-4 text-center">Status</th>
							<th class="py-3 px-4 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
						{#each data.promos as promo}
							<tr class="hover:bg-slate-50/50">
								<td class="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
									{promo.code}
									<span class="block font-sans text-[10px] text-slate-400 font-normal">
										{promo.description || '-'}
									</span>
								</td>

								<td class="py-3.5 px-4 font-extrabold text-emerald-700">
									{#if promo.discount_type === 'FIXED'}
										{formatRupiah(promo.discount_value)}
									{:else}
										{promo.discount_value}% OFF
									{/if}
								</td>

								<td class="py-3.5 px-4 text-slate-600">
									{formatRupiah(promo.min_spend)}
								</td>

								<td class="py-3.5 px-4 text-center">
									<span class="font-bold text-slate-800">{promo.used_count}</span>
									<span class="text-slate-400">/{promo.quota}</span>
								</td>

								<td class="py-3.5 px-4 text-center">
									<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
										{promo.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
										{promo.is_active ? 'AKTIF' : 'NONAKTIF'}
									</span>
								</td>

								<td class="py-3.5 px-4 text-right">
									<form method="POST" action="?/togglePromoStatus" class="inline-block">
										<input type="hidden" name="id" value={promo.id} />
										<input type="hidden" name="is_active" value={String(promo.is_active)} />
										<button
											type="submit"
											class="rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors
												{promo.is_active ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-teal-200 text-teal-700 hover:bg-teal-50'}"
										>
											{promo.is_active ? 'Nonaktifkan' : 'Aktifkan'}
										</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="py-8 text-center text-xs text-slate-400">
									Belum ada kupon diskon.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

