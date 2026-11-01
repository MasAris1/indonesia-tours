<script lang="ts">
	import type { ActionData } from './$types';
	import {
		Compass,
		ArrowLeft,
		Calendar,
		Sparkles,
		DollarSign,
		MapPin,
		Clock,
		Image as ImageIcon,
		AlertCircle
	} from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();

	let title = $state('Jelajah Sunrise Gunung Bromo & Savana Teletubbies 2H1N');
	let destination = $state('Bromo, Jawa Timur');
	let price = $state(850000);
	let duration = $state('2H1N');
	let meetingPoint = $state('Stasiun Malang Kota Baru');
	let coverImageUrl = $state('https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80');
	let description = $state('Nikmati sensasi golden sunrise memukau di puncak Penanjakan Bromo, lautan pasir berbisik, kawah aktif, dan savana teletubbies nan hijau bersama pemandu lokal berlisensi HPI.');

	// Initial schedule
	let departureDate = $state('2026-11-20');
	let returnDate = $state('2026-11-21');
	let quotaTotal = $state(14);
</script>

<svelte:head>
	<title>Tambah Paket Tur Baru — Portal Mitra</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center gap-3">
		<a
			href="/mitra/tours"
			class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
		>
			<ArrowLeft class="h-4 w-4" />
		</a>
		<div>
			<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
				Buat Paket Open Trip Baru
			</h2>
			<p class="text-xs text-slate-500">
				Publikasikan destinasi unggulan Anda ke katalog Indonesia Tours.
			</p>
		</div>
	</div>

	{#if form?.message}
		<div class="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 border border-red-200">
			<AlertCircle class="h-5 w-5 shrink-0 text-red-600" />
			<span>{form.message}</span>
		</div>
	{/if}

	<form method="POST" action="?/createTour" class="space-y-6">
		<!-- Section 1: Informasi Dasar -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
			<h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
				<Compass class="h-4 w-4 text-orange-600" />
				<span>Informasi Paket Tur</span>
			</h3>

			<div>
				<label for="tambah-title" class="block text-xs font-bold text-slate-700 mb-1">Judul Paket Open Trip *</label>
				<input
					id="tambah-title"
					type="text"
					name="title"
					bind:value={title}
					placeholder="Contoh: Eksplorasi Phinisi Labuan Bajo 3H2N"
					required
					class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label for="tambah-dest" class="block text-xs font-bold text-slate-700 mb-1">Wilayah / Destinasi *</label>
					<div class="relative">
						<MapPin class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
						<input
							id="tambah-dest"
							type="text"
							name="destination"
							bind:value={destination}
							placeholder="Mis: Labuan Bajo"
							required
							class="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label for="tambah-price" class="block text-xs font-bold text-slate-700 mb-1">Harga per Orang (IDR) *</label>
					<div class="relative">
						<DollarSign class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
						<input
							id="tambah-price"
							type="number"
							name="price"
							bind:value={price}
							min="10000"
							step="10000"
							required
							class="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label for="tambah-dur" class="block text-xs font-bold text-slate-700 mb-1">Durasi Hari & Malam *</label>
					<div class="relative">
						<Clock class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
						<input
							id="tambah-dur"
							type="text"
							name="duration"
							bind:value={duration}
							placeholder="Contoh: 3H2N"
							required
							class="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="tambah-mp" class="block text-xs font-bold text-slate-700 mb-1">Titik Kumpul (Meeting Point) *</label>
					<input
						id="tambah-mp"
						type="text"
						name="meeting_point"
						bind:value={meetingPoint}
						placeholder="Contoh: Bandara Komodo / Stasiun Malang"
						required
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="tambah-img" class="block text-xs font-bold text-slate-700 mb-1">URL Foto Sampul (Cover Image)</label>
					<div class="relative">
						<ImageIcon class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
						<input
							id="tambah-img"
							type="url"
							name="cover_image_url"
							bind:value={coverImageUrl}
							placeholder="https://..."
							class="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
						/>
					</div>
				</div>
			</div>

			<div>
				<label for="tambah-desc" class="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Pengalaman Tur</label>
				<textarea
					id="tambah-desc"
					name="description"
					rows="3"
					bind:value={description}
					placeholder="Jelaskan daya tarik utama tur ini..."
					class="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
				></textarea>
			</div>
		</div>

		<!-- Section 2: Jadwal Awal & Kuota Kursi -->
		<div class="rounded-3xl border border-orange-200 bg-orange-50/40 p-6 shadow-sm space-y-4">
			<h3 class="text-sm font-extrabold text-orange-950 border-b border-orange-200/60 pb-3 flex items-center gap-2">
				<Calendar class="h-4 w-4 text-orange-600" />
				<span>Jadwal Keberangkatan Pertama & Kuota Kursi</span>
			</h3>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label for="tambah-dep" class="block text-xs font-bold text-slate-700 mb-1">Tanggal Keberangkatan *</label>
					<input
						id="tambah-dep"
						type="date"
						name="departure_date"
						bind:value={departureDate}
						required
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="tambah-ret" class="block text-xs font-bold text-slate-700 mb-1">Tanggal Kepulangan *</label>
					<input
						id="tambah-ret"
						type="date"
						name="return_date"
						bind:value={returnDate}
						required
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>

				<div>
					<label for="tambah-quota" class="block text-xs font-bold text-slate-700 mb-1">Total Kuota Kursi Tersedia *</label>
					<input
						id="tambah-quota"
						type="number"
						name="quota_total"
						bind:value={quotaTotal}
						min="1"
						max="100"
						required
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
					/>
				</div>
			</div>
			<p class="text-[11px] text-slate-500">
				* Jadwal tambahan lainnya dapat ditambahkan sewaktu-waktu di halaman "Kelola Paket & Kuota".
			</p>
		</div>

		<!-- Submit Button -->
		<div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 text-center">
			<a
				href="/mitra/tours"
				class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 text-center"
			>
				Batal
			</a>
			<button
				type="submit"
				class="rounded-xl bg-orange-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all text-center"
			>
				Tayangkan Paket Tur
			</button>
		</div>
	</form>
</div>

