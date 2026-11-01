<script lang="ts">
	import type { PageData } from './$types';
	import {
		FileSpreadsheet,
		Download,
		DollarSign,
		Percent,
		Building2,
		Users,
		Calendar
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Laporan Transaksi & Komisi — Back-Office Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
				Laporan Keuangan, Penjualan & Komisi Platform
			</h2>
			<p class="text-xs text-slate-500 mt-1">
				Rekapitulasi pembukuan seluruh tiket open trip yang telah berhasil dipesan dan dibayar oleh wisatawan.
			</p>
		</div>

		<a
			href="/admin/laporan/export.csv"
			download
			class="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition-all self-start sm:self-auto"
		>
			<Download class="h-4 w-4" />
			<span>Ekspor Laporan (.CSV)</span>
		</a>
	</div>

	<!-- Financial Overview Cards -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-2xl border border-slate-200 bg-white p-4">
			<span class="text-[11px] font-bold text-slate-500 uppercase">Volume Bruto (GMV)</span>
			<span class="block text-lg sm:text-xl font-black text-slate-900 mt-1">{formatRupiah(data.summary?.totalGMV || 0)}</span>
		</div>

		<div class="rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
			<span class="text-[11px] font-bold text-teal-800 uppercase">Komisi Platform (10%)</span>
			<span class="block text-lg sm:text-xl font-black text-teal-900 mt-1">{formatRupiah(data.summary?.totalCommission || 0)}</span>
		</div>

		<div class="rounded-2xl border border-slate-200 bg-white p-4">
			<span class="text-[11px] font-bold text-slate-500 uppercase">Net ke Mitra Operator</span>
			<span class="block text-lg sm:text-xl font-black text-emerald-700 mt-1">{formatRupiah(data.summary?.totalNetToPartners || 0)}</span>
		</div>

		<div class="rounded-2xl border border-slate-200 bg-white p-4">
			<span class="text-[11px] font-bold text-slate-500 uppercase">Total Wisatawan / Pax</span>
			<span class="block text-lg sm:text-xl font-black text-orange-600 mt-1">{data.summary?.totalPax || 0} pax</span>
		</div>
	</div>

	<!-- Ledger Table Card -->
	<div class="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
		<div class="p-4 border-b border-slate-100 flex items-center justify-between">
			<h3 class="text-sm font-extrabold text-slate-900">Buku Besar Transaksi (Ledger)</h3>
			<span class="text-xs text-slate-500">{data.bookings?.length || 0} entri</span>
		</div>

		<!-- Mobile Card View (Phone screens) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each data.bookings as b}
				{@const rate = Number(b.schedule?.tour?.partner?.commission_rate || 10)}
				{@const gross = Number(b.total_price || 0)}
				{@const comm = Math.round(gross * (rate / 100))}
				{@const net = gross - comm}
				<div class="p-4 space-y-2.5">
					<div class="flex items-start justify-between gap-2">
						<div>
							<span class="font-mono font-bold text-slate-900 text-xs">{b.booking_code}</span>
							<span class="block text-[10px] text-slate-400">
								{new Date(b.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
							</span>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase shrink-0
							{b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
							{b.status}
						</span>
					</div>

					<div class="text-xs">
						<span class="font-bold text-slate-900 line-clamp-1">
							{b.schedule?.tour?.title || '-'}
						</span>
						<span class="text-[11px] text-slate-500 block mt-0.5">
							{b.schedule?.tour?.destination} • Oleh: {b.schedule?.tour?.partner?.company_name || 'Mitra'}
						</span>
						<span class="text-[11px] text-slate-600 block mt-0.5">
							Pemesan: <strong class="text-slate-800">{b.contact_name || 'Wisatawan'}</strong> ({b.pax_count} pax)
						</span>
					</div>

					<div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Bruto</span>
							<span class="font-bold text-slate-900">{formatRupiah(gross)}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Komisi ({rate}%)</span>
							<span class="font-bold text-teal-700">+{formatRupiah(comm)}</span>
						</div>
						<div>
							<span class="text-[10px] font-bold text-slate-400 uppercase block">Net Mitra</span>
							<span class="font-bold text-emerald-700">{formatRupiah(net)}</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					Belum ada catatan transaksi.
				</div>
			{/each}
		</div>

		<!-- Desktop & Tablet Spreadsheet Table -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-100">
					<tr>
						<th class="py-3 px-4">Booking Ref & Tanggal</th>
						<th class="py-3 px-4">Paket Open Trip</th>
						<th class="py-3 px-4">Mitra Operator</th>
						<th class="py-3 px-4">Customer</th>
						<th class="py-3 px-4">Nilai Bruto</th>
						<th class="py-3 px-4">Komisi Platform</th>
						<th class="py-3 px-4">Bersih Mitra</th>
						<th class="py-3 px-4 text-center">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each data.bookings as b}
						{@const rate = Number(b.schedule?.tour?.partner?.commission_rate || 10)}
						{@const gross = Number(b.total_price || 0)}
						{@const comm = Math.round(gross * (rate / 100))}
						{@const net = gross - comm}
						<tr class="hover:bg-slate-50/50">
							<td class="py-3.5 px-4 font-mono font-bold text-slate-900">
								{b.booking_code}
								<span class="block font-sans text-[10px] text-slate-400 font-normal">
									{new Date(b.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
								</span>
							</td>

							<td class="py-3.5 px-4">
								<span class="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
									{b.schedule?.tour?.title || '-'}
								</span>
								<span class="text-[10px] text-slate-400">{b.schedule?.tour?.destination}</span>
							</td>

							<td class="py-3.5 px-4 text-slate-600">
								{b.schedule?.tour?.partner?.company_name || 'Mitra'}
							</td>

							<td class="py-3.5 px-4">
								<span class="text-slate-800 font-bold">{b.contact_name || 'Wisatawan'}</span>
								<span class="text-[10px] text-slate-400 block">{b.pax_count} pax</span>
							</td>

							<td class="py-3.5 px-4 font-black text-slate-900">
								{formatRupiah(gross)}
							</td>

							<td class="py-3.5 px-4 text-teal-700 font-black">
								+{formatRupiah(comm)} <span class="text-[10px] text-slate-400 font-normal">({rate}%)</span>
							</td>

							<td class="py-3.5 px-4 font-bold text-emerald-700">
								{formatRupiah(net)}
							</td>

							<td class="py-3.5 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase
									{b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
									{b.status}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="py-8 text-center text-xs text-slate-400">
								Belum ada catatan transaksi.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

