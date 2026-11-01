<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		Compass,
		PlusCircle,
		Calendar,
		Users,
		ExternalLink,
		CheckCircle2,
		AlertCircle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedTourForSchedule = $state<string | null>(null);

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Kelola Paket & Jadwal Kuota — Portal Mitra</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
				Daftar Paket Open Trip & Jadwal
			</h2>
			<p class="text-xs text-slate-500 mt-1">
				Atur kuota kursi, tambahkan tanggal keberangkatan baru, dan pantau keterisian kuota secara real-time.
			</p>
		</div>

		<a
			href="/mitra/tours/tambah"
			class="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition-all self-start sm:self-auto"
		>
			<PlusCircle class="h-4 w-4" />
			<span>Tambah Paket Tur Baru</span>
		</a>
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

	<!-- Tour Cards List -->
	<div class="space-y-6">
		{#each data.tours as tour}
			<div class="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
				<div class="flex flex-col sm:flex-row gap-5">
					<img
						src={tour.cover_image_url}
						alt={tour.title}
						class="h-36 sm:h-28 w-full sm:w-44 rounded-2xl object-cover"
					/>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="rounded bg-teal-100/80 px-2 py-0.5 text-[10px] font-black uppercase text-teal-800">
								{tour.destination}
							</span>
							<span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
								Aktif Tayang
							</span>
						</div>

						<h3 class="mt-1.5 text-base font-extrabold text-slate-900 sm:text-lg">
							{tour.title}
						</h3>

						<div class="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
							<span class="text-orange-600 font-extrabold text-sm">{formatRupiah(tour.price)} <span class="text-[11px] font-normal text-slate-500">/ orang</span></span>
							<span>•</span>
							<span>{tour.schedules?.length || 0} Jadwal Keberangkatan</span>
						</div>
					</div>

					<div class="flex sm:flex-col items-stretch sm:items-end justify-end gap-2 shrink-0 w-full sm:w-auto">
						<a
							href="/trip/{tour.slug}"
							target="_blank"
							class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
						>
							<span>Halaman Publik</span>
							<ExternalLink class="h-3.5 w-3.5" />
						</a>

						<button
							type="button"
							onclick={() => selectedTourForSchedule = selectedTourForSchedule === tour.id ? null : tour.id}
							class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 sm:py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100"
						>
							<Calendar class="h-3.5 w-3.5" />
							<span>+ Tambah Jadwal</span>
						</button>
					</div>
				</div>

				<!-- Add Schedule Form Inline (Collapsible) -->
				{#if selectedTourForSchedule === tour.id}
					<div class="mt-5 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
						<h4 class="text-xs font-extrabold text-orange-950 mb-3">Tambah Tanggal & Kuota Jadwal:</h4>
						<form method="POST" action="?/addSchedule" class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
							<input type="hidden" name="tour_id" value={tour.id} />

							<div>
								<label class="block font-bold text-slate-700 mb-1">Tanggal Berangkat</label>
								<input
									type="date"
									name="departure_date"
									required
									class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800"
								/>
							</div>

							<div>
								<label class="block font-bold text-slate-700 mb-1">Tanggal Pulang</label>
								<input
									type="date"
									name="return_date"
									required
									class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800"
								/>
							</div>

							<div>
								<label class="block font-bold text-slate-700 mb-1">Total Kuota Kursi</label>
								<input
									type="number"
									name="quota_total"
									min="1"
									max="100"
									value="12"
									required
									class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800"
								/>
							</div>

							<div class="flex items-end">
								<button
									type="submit"
									class="w-full rounded-xl bg-orange-600 py-2.5 font-bold text-white shadow-sm hover:bg-orange-700"
								>
									Simpan Jadwal
								</button>
							</div>
						</form>
					</div>
				{/if}

				<!-- Schedules Table for this Tour -->
				<div class="mt-5 border-t border-slate-100 pt-4">
					<h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
						Jadwal Keberangkatan & Sisa Kursi
					</h4>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
						{#each tour.schedules || [] as sched}
							{@const remaining = sched.quota_total - sched.quota_booked}
							<div class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
								<div>
									<div class="flex items-center gap-1.5 font-bold text-slate-800">
										<Calendar class="h-3.5 w-3.5 text-teal-700" />
										<span>{new Date(sched.departure_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
									</div>
									<span class="text-[11px] text-slate-500 mt-0.5 block">
										s/d {new Date(sched.return_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
									</span>
								</div>

								<div class="text-right">
									<span class="block text-xs font-black {remaining <= 3 ? 'text-red-600' : 'text-emerald-700'}">
										Sisa {remaining} kursi
									</span>
									<span class="text-[10px] text-slate-400">
										{sched.quota_booked}/{sched.quota_total} terisi
									</span>
								</div>
							</div>
						{:else}
							<div class="col-span-full py-2 text-center text-xs text-slate-400">
								Belum ada jadwal keberangkatan. Klik "+ Tambah Jadwal" di atas.
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-3xl border border-slate-200/90 bg-white p-12 text-center">
				<Compass class="mx-auto h-12 w-12 text-slate-300" />
				<h3 class="mt-4 text-base font-extrabold text-slate-900">Belum Ada Paket Tur</h3>
				<p class="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
					Mulai tawarkan destinasi terbaik Anda kepada ribuan pelancong di Indonesia Tours.
				</p>
				<a
					href="/mitra/tours/tambah"
					class="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700"
				>
					<PlusCircle class="h-4 w-4" />
					<span>Buat Paket Pertama</span>
				</a>
			</div>
		{/each}
	</div>
</div>

