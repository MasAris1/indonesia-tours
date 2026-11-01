<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {
		User,
		Mail,
		Phone,
		Shield,
		Building2,
		Ticket,
		LogOut,
		Sparkles,
		CheckCircle2,
		AlertCircle,
		ArrowRight
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let fullName = $state(data.profile?.full_name || '');
	let phone = $state(data.profile?.phone || '');
</script>

<svelte:head>
	<title>Akun Saya — Indonesia Tours</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Akun Saya</h1>
			<p class="mt-1 text-sm text-slate-500">
				Kelola profil, riwayat petualangan, dan akses portal manajemen tur Anda.
			</p>
		</div>

		<form method="POST" action="/keluar">
			<button
				type="submit"
				class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
			>
				<LogOut class="h-4 w-4" />
				<span>Keluar Akun</span>
			</button>
		</form>
	</div>

	{#if form?.message}
		<div class="mb-6 flex items-center gap-2 rounded-2xl p-4 text-sm font-semibold shadow-sm {form.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}">
			{#if form.success}
				<CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-600" />
			{:else}
				<AlertCircle class="h-5 w-5 shrink-0 text-red-600" />
			{/if}
			<span>{form.message}</span>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Left: Profile Summary Card -->
		<div class="space-y-6">
			<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
				<div class="flex items-center gap-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-2xl font-black text-white shadow-md">
						{(data.profile?.full_name || data.profile?.email || 'U')[0].toUpperCase()}
					</div>
					<div class="min-w-0 flex-1">
						<h2 class="truncate text-base font-extrabold text-slate-900">
							{data.profile?.full_name || 'Wisatawan Indonesia'}
						</h2>
						<p class="truncate text-xs text-slate-500">{data.profile?.email}</p>
						<div class="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider
							{data.profile?.role === 'admin' ? 'bg-red-100 text-red-800' : data.profile?.role === 'partner' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'}">
							{#if data.profile?.role === 'admin'}
								<Shield class="h-3 w-3" />
								<span>Admin Platform</span>
							{:else if data.profile?.role === 'partner'}
								<Building2 class="h-3 w-3" />
								<span>Mitra Operator</span>
							{:else}
								<User class="h-3 w-3" />
								<span>Customer</span>
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-center">
					<div class="rounded-xl bg-slate-50 p-2.5">
						<span class="block text-xs text-slate-500">Total Pesanan</span>
						<span class="text-lg font-black text-slate-900">{data.stats.totalTrips}</span>
					</div>
					<div class="rounded-xl bg-teal-50/60 p-2.5">
						<span class="block text-xs text-teal-700">Trip Aktif</span>
						<span class="text-lg font-black text-teal-900">{data.stats.activeTrips}</span>
					</div>
				</div>
			</div>

			<!-- Role Testing Switcher Widget (Fase 3 Quick Toggle) -->
			<div class="rounded-3xl border border-dashed border-teal-300 bg-teal-50/50 p-5 shadow-sm">
				<div class="flex items-center gap-2 text-teal-950 font-bold text-xs">
					<Sparkles class="h-4 w-4 text-orange-600" />
					<span>Uji Coba Multi-Role (Penguji/Dosen):</span>
				</div>
				<p class="mt-1 text-[11px] text-slate-600 leading-relaxed">
					Beralih peran secara instan untuk menguji tampilan dan fitur masing-masing role tanpa harus re-login:
				</p>

				<form method="POST" action="?/switchRoleDemo" class="mt-3 grid grid-cols-3 gap-1.5">
					<button
						type="submit"
						name="role"
						value="customer"
						class="rounded-xl border py-2 text-center text-xs font-bold transition-all {data.profile?.role === 'customer' ? 'border-teal-600 bg-teal-700 text-white shadow-sm' : 'border-teal-200 bg-white text-teal-900 hover:bg-teal-100/70'}"
					>
						Customer
					</button>
					<button
						type="submit"
						name="role"
						value="partner"
						class="rounded-xl border py-2 text-center text-xs font-bold transition-all {data.profile?.role === 'partner' ? 'border-orange-600 bg-orange-600 text-white shadow-sm' : 'border-orange-200 bg-white text-orange-900 hover:bg-orange-100/70'}"
					>
						Mitra
					</button>
					<button
						type="submit"
						name="role"
						value="admin"
						class="rounded-xl border py-2 text-center text-xs font-bold transition-all {data.profile?.role === 'admin' ? 'border-red-600 bg-red-700 text-white shadow-sm' : 'border-red-200 bg-white text-red-900 hover:bg-red-100/70'}"
					>
						Admin
					</button>
				</form>
			</div>
		</div>

		<!-- Right: Quick Portals & Profile Form -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Quick Portal Access Cards -->
			<div class="space-y-3">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Pusat Navigasi & Layanan</h3>

				<!-- Pesanan Saya Card -->
				<a
					href="/pesanan"
					class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-teal-600 hover:shadow-md transition-all group"
				>
					<div class="flex items-center gap-3.5 min-w-0 flex-1">
						<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors">
							<Ticket class="h-5 w-5" />
						</div>
						<div class="min-w-0 flex-1">
							<h4 class="text-sm font-extrabold text-slate-900 truncate">Pesanan & E-Tiket Saya</h4>
							<p class="text-xs text-slate-500 line-clamp-1">Lihat digital boarding pass, QR Code, dan tautan WhatsApp trip</p>
						</div>
					</div>
					<ArrowRight class="h-5 w-5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all shrink-0" />
				</a>

				<!-- Portal Mitra Card -->
				{#if data.profile?.role === 'partner' || data.profile?.role === 'admin'}
					<a
						href="/mitra/dashboard"
						class="flex items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50/70 to-white p-4 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group"
					>
						<div class="flex items-center gap-3.5 min-w-0 flex-1">
							<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition-colors">
								<Building2 class="h-5 w-5" />
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h4 class="text-sm font-extrabold text-orange-950 truncate">Portal Mitra Operator</h4>
									<span class="rounded bg-orange-200/60 px-1.5 py-0.2 text-[10px] font-black text-orange-800 shrink-0">Fase 3</span>
								</div>
								<p class="text-xs text-slate-600 line-clamp-1">Kelola paket tur, tambah jadwal kuota, manifest peserta, dan ajukan klaim payout rekber</p>
							</div>
						</div>
						<ArrowRight class="h-5 w-5 text-orange-500 group-hover:text-orange-700 group-hover:translate-x-1 transition-all shrink-0" />
					</a>
				{:else}
					<a
						href="/mitra/daftar"
						class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-600 hover:shadow-md transition-all group"
					>
						<div class="flex items-center gap-3.5 min-w-0 flex-1">
							<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-teal-700 group-hover:text-white transition-colors">
								<Building2 class="h-5 w-5" />
							</div>
							<div class="min-w-0 flex-1">
								<h4 class="text-sm font-extrabold text-slate-900 truncate">Daftar Jadi Mitra Operator</h4>
								<p class="text-xs text-slate-500 line-clamp-1">Buka akses menjual paket open trip ke ribuan wisatawan terverifikasi</p>
							</div>
						</div>
						<ArrowRight class="h-5 w-5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all shrink-0" />
					</a>
				{/if}

				<!-- Back-Office Admin Card -->
				{#if data.profile?.role === 'admin'}
					<a
						href="/admin/dashboard"
						class="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-md hover:bg-slate-800 transition-all group"
					>
						<div class="flex items-center gap-3.5 min-w-0 flex-1">
							<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
								<Shield class="h-5 w-5" />
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h4 class="text-sm font-extrabold text-white truncate">Back-Office Admin Platform</h4>
									<span class="rounded bg-red-600 px-1.5 py-0.2 text-[10px] font-black text-white shrink-0">Admin</span>
								</div>
								<p class="text-xs text-slate-400 line-clamp-1">Dashboard GMV & komisi platform 10%, verifikasi kurasi mitra, otorisasi rilis payout, ekspor CSV</p>
							</div>
						</div>
						<ArrowRight class="h-5 w-5 text-teal-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
					</a>
				{/if}
			</div>

			<!-- Update Profile Form -->
			<div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
				<h3 class="text-base font-extrabold text-slate-900 mb-4">Informasi Profil Pemesan</h3>

				<form method="POST" action="?/updateProfile" class="space-y-4">
					<div>
						<label for="akun-fullname" class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
						<div class="relative">
							<User class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
							<input
								id="akun-fullname"
								type="text"
								name="full_name"
								bind:value={fullName}
								placeholder="Nama sesuai KTP"
								required
								class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label for="akun-email" class="block text-xs font-bold text-slate-700 mb-1">Email (Akun Login)</label>
						<div class="relative">
							<Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
							<input
								id="akun-email"
								type="email"
								disabled
								value={data.profile?.email || ''}
								class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 cursor-not-allowed"
							/>
						</div>
					</div>

					<div>
						<label for="akun-phone" class="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / Telepon</label>
						<div class="relative">
							<Phone class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
							<input
								id="akun-phone"
								type="tel"
								name="phone"
								bind:value={phone}
								placeholder="081234567890"
								class="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:outline-none"
							/>
						</div>
						<p class="mt-1 text-[11px] text-slate-500">Nomor ini digunakan untuk undangan grup WhatsApp koordinasi open trip.</p>
					</div>

					<div class="pt-2">
						<button
							type="submit"
							class="rounded-xl bg-teal-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-teal-800 active:scale-95 transition-all"
						>
							Simpan Perubahan
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

