<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Compass,
		ExternalLink,
		CheckCircle2,
		XCircle,
		AlertCircle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Kurasi Paket Tur — Back-Office Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Kurasi & Moderasi Paket Open Trip
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Pantau seluruh paket yang diunggah oleh operator mitra dan kelola status tayang di beranda publik.
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
			{#each data.tours as tour}
				<div class="p-4 space-y-3">
					<div class="flex items-start gap-3">
						<img
							src={tour.cover_image_url}
							alt={tour.title}
							class="h-16 w-20 rounded-xl object-cover shrink-0"
						/>
						<div class="min-w-0 flex-1">
							<a href="/trip/{tour.slug}" target="_blank" class="font-extrabold text-slate-900 hover:text-teal-700 block text-xs line-clamp-2">
								{tour.title}
							</a>
							<span class="text-[11px] text-slate-500 block mt-0.5">{tour.destination}</span>
							<span class="text-xs font-black text-slate-900 block mt-1">{formatRupiah(tour.price)}</span>
						</div>
					</div>

					<div class="flex items-center justify-between gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs">
						<div>
							<span class="font-bold text-slate-800 block text-[11px]">{tour.partner?.company_name || 'Mitra'}</span>
							<span class="text-[10px] font-bold text-emerald-700 uppercase">{tour.partner?.verification_status}</span>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase shrink-0
							{tour.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
							{tour.status === 1 ? 'AKTIF TAYANG' : 'NONAKTIF'}
						</span>
					</div>

					<div class="flex items-center gap-2">
						<a
							href="/trip/{tour.slug}"
							target="_blank"
							class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
						>
							<ExternalLink class="h-3.5 w-3.5" />
							<span>Halaman Publik</span>
						</a>

						<form method="POST" action="?/toggleTourStatus" class="flex-1">
							<input type="hidden" name="tour_id" value={tour.id} />
							<input type="hidden" name="status" value={tour.status} />
							<button
								type="submit"
								class="w-full rounded-xl py-2 text-xs font-bold transition-colors
									{tour.status === 1 ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'bg-teal-700 text-white hover:bg-teal-800'}"
							>
								{tour.status === 1 ? 'Nonaktifkan' : 'Aktifkan'}
							</button>
						</form>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					Belum ada paket tur.
				</div>
			{/each}
		</div>

		<!-- Desktop & Tablet Spreadsheet Table -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-100">
					<tr>
						<th class="py-3.5 px-4 sm:px-6">Paket Open Trip</th>
						<th class="py-3.5 px-4">Operator Mitra</th>
						<th class="py-3.5 px-4">Harga / Orang</th>
						<th class="py-3.5 px-4 text-center">Status Tayang</th>
						<th class="py-3.5 px-4 sm:px-6 text-right">Moderasi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.tours as tour}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td class="py-4 px-4 sm:px-6">
								<div class="flex items-center gap-3">
									<img
										src={tour.cover_image_url}
										alt={tour.title}
										class="h-10 w-14 rounded-xl object-cover"
									/>
									<div>
										<a href="/trip/{tour.slug}" target="_blank" class="font-extrabold text-slate-900 hover:text-teal-700 block line-clamp-1 max-w-[280px]">
											{tour.title}
										</a>
										<span class="text-[11px] text-slate-500">{tour.destination}</span>
									</div>
								</div>
							</td>

							<td class="py-4 px-4">
								<span class="font-bold text-slate-900 block">{tour.partner?.company_name || 'Mitra'}</span>
								<span class="text-[10px] font-bold text-emerald-700 uppercase">{tour.partner?.verification_status}</span>
							</td>

							<td class="py-4 px-4 font-black text-slate-900">
								{formatRupiah(tour.price)}
							</td>

							<td class="py-4 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{tour.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
									{tour.status === 1 ? 'AKTIF TAYANG' : 'NONAKTIF'}
								</span>
							</td>

							<td class="py-4 px-4 sm:px-6 text-right">
								<form method="POST" action="?/toggleTourStatus" class="inline-flex items-center gap-2">
									<input type="hidden" name="tour_id" value={tour.id} />
									<input type="hidden" name="status" value={tour.status} />

									<a
										href="/trip/{tour.slug}"
										target="_blank"
										class="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-teal-700"
										title="Buka Halaman Publik"
									>
										<ExternalLink class="h-3.5 w-3.5" />
									</a>

									<button
										type="submit"
										class="rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors
											{tour.status === 1 ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'bg-teal-700 text-white hover:bg-teal-800'}"
									>
										{tour.status === 1 ? 'Nonaktifkan' : 'Aktifkan'}
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

