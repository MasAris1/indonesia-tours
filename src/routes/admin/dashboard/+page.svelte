<script lang="ts">
	import type { PageData } from './$types';
	import {
		DollarSign,
		Percent,
		Users,
		Building2,
		Wallet,
		ShieldCheck,
		Compass,
		ArrowRight,
		CheckCircle2,
		Clock,
		AlertCircle
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Dashboard Metrik — Back-Office Admin</title>
</svelte:head>

<div class="space-y-8">
	<!-- Top Title -->
	<div>
		<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
			Ikhtisar Platform & Metrik Bisnis
		</h2>
		<p class="text-xs text-slate-500 mt-1">
			Laporan menyeluruh volume transaksi GMV, take-rate komisi 10%, dan performa mitra terdaftar.
		</p>
	</div>

	<!-- 4 Key KPI Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Total GMV -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Merchandise Value</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
					<DollarSign class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-black text-slate-900">{formatRupiah(data.metrics?.totalGMV || 0)}</span>
				<p class="text-[11px] text-slate-400 mt-0.5">Total transaksi berhasil</p>
			</div>
		</div>

		<!-- Pendapatan Komisi Platform -->
		<div class="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/70 to-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-teal-900 uppercase tracking-wider">Pendapatan Platform (10%)</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
					<Percent class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-black text-teal-800">{formatRupiah(data.metrics?.totalPlatformRevenue || 0)}</span>
				<p class="text-[11px] text-teal-700/80 mt-0.5">Take-rate bersih platform</p>
			</div>
		</div>

		<!-- Kursi Terjual (Pax) -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiket / Pax Terjual</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
					<Users class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-black text-orange-600">{data.metrics?.totalPaxSold || 0}</span>
				<span class="text-xs text-slate-500 ml-1">wisatawan</span>
			</div>
		</div>

		<!-- Mitra Terverifikasi -->
		<div class="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra Operator Tur</span>
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
					<Building2 class="h-5 w-5" />
				</div>
			</div>
			<div class="mt-3 flex items-baseline gap-2">
				<span class="text-2xl font-black text-slate-900">{data.metrics?.verifiedPartners || 0}</span>
				<span class="text-xs font-bold text-emerald-700">Aktif</span>
				{#if data.metrics?.pendingPartners > 0}
					<span class="text-xs font-bold text-amber-600">({data.metrics.pendingPartners} pending)</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Action Needed Alert Section (if pending partners or pending payouts) -->
	{#if (data.metrics?.pendingPartners > 0) || (data.pendingPayouts?.length > 0)}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#if data.metrics?.pendingPartners > 0}
				<div class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold">
							!
						</div>
						<div>
							<h4 class="text-xs font-extrabold text-amber-950">{data.metrics.pendingPartners} Mitra Menunggu Verifikasi</h4>
							<p class="text-[11px] text-amber-800">Tinjau legalitas NIB & sertifikasi HPI</p>
						</div>
					</div>
					<a
						href="/admin/mitra"
						class="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 text-center"
					>
						Tinjau Mitra
					</a>
				</div>
			{/if}

			{#if data.pendingPayouts?.length > 0}
				<div class="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold">
							<Wallet class="h-5 w-5" />
						</div>
						<div>
							<h4 class="text-xs font-extrabold text-orange-950">{data.pendingPayouts.length} Permohonan Payout Rekber</h4>
							<p class="text-[11px] text-orange-800">Otorisasi pencairan dana ke rekening mitra</p>
						</div>
					</div>
					<a
						href="/admin/payouts"
						class="rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-700 text-center"
					>
						Otorisasi
					</a>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Recent Bookings Table -->
	<div class="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
			<div>
				<h3 class="text-base font-extrabold text-slate-900">Transaksi & Pesanan Terkini</h3>
				<p class="text-xs text-slate-500">Aktivitas pemesanan paket open trip di seluruh Indonesia</p>
			</div>
			<a href="/admin/laporan" class="text-xs font-bold text-teal-700 hover:underline">
				Buka Laporan Transaksi Lengkap
			</a>
		</div>

		<!-- Mobile Card View (Phone screens) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each data.recentBookings as b}
				{@const comm = Math.round(Number(b.total_price) * 0.1)}
				<div class="py-3 space-y-2">
					<div class="flex items-start justify-between gap-2">
						<div>
							<span class="font-mono font-black text-slate-900 text-xs">{b.booking_code}</span>
							<span class="text-[11px] text-slate-500 block">{b.schedule?.tour?.title || '-'}</span>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase shrink-0
							{b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
							{b.status}
						</span>
					</div>

					<div class="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
						<div>
							<span class="font-bold text-slate-800">{b.contact_name || 'Wisatawan'}</span>
							<span class="text-[10px] text-slate-400 block">{b.pax_count} pax • {b.schedule?.tour?.partner?.company_name || 'Mitra'}</span>
						</div>
						<div class="text-right">
							<span class="font-black text-slate-900 block">{formatRupiah(b.total_price)}</span>
							<span class="text-[10px] text-teal-700 font-bold">+{formatRupiah(comm)} (10%)</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					Belum ada data transaksi.
				</div>
			{/each}
		</div>

		<!-- Desktop & Tablet Spreadsheet Table -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
					<tr>
						<th class="py-3 px-4">Booking Ref</th>
						<th class="py-3 px-4">Tur & Destinasi</th>
						<th class="py-3 px-4">Operator Mitra</th>
						<th class="py-3 px-4">Customer</th>
						<th class="py-3 px-4">Nilai Transaksi</th>
						<th class="py-3 px-4">Komisi (10%)</th>
						<th class="py-3 px-4 text-center">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.recentBookings as b}
						{@const comm = Math.round(Number(b.total_price) * 0.1)}
						<tr class="hover:bg-slate-50/50">
							<td class="py-3.5 px-4 font-mono font-black text-slate-900">
								{b.booking_code}
							</td>
							<td class="py-3.5 px-4">
								<span class="font-extrabold text-slate-900 line-clamp-1 max-w-[180px]">
									{b.schedule?.tour?.title || '-'}
								</span>
							</td>
							<td class="py-3.5 px-4 text-slate-600">
								{b.schedule?.tour?.partner?.company_name || 'Mitra Tour'}
							</td>
							<td class="py-3.5 px-4">
								<span class="text-slate-800 font-bold">{b.contact_name || 'Wisatawan'}</span>
								<span class="text-[10px] text-slate-400 block">{b.pax_count} pax</span>
							</td>
							<td class="py-3.5 px-4 font-black text-slate-900">
								{formatRupiah(b.total_price)}
							</td>
							<td class="py-3.5 px-4 text-teal-700 font-black">
								+{formatRupiah(comm)}
							</td>
							<td class="py-3.5 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
									{b.status}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="py-8 text-center text-xs text-slate-400">
								Belum ada data transaksi.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

