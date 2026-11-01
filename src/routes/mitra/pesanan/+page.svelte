<script lang="ts">
	import type { PageData } from './$types';
	import {
		Users,
		Calendar,
		Phone,
		Mail,
		Search,
		CheckCircle2,
		Clock,
		XCircle,
		MessageSquare
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	let filteredBookings = $derived(
		(data.bookings || []).filter((b: any) => {
			if (!searchQuery) return true;
			const q = searchQuery.toLowerCase();
			return (
				b.booking_code.toLowerCase().includes(q) ||
				(b.contact_name || '').toLowerCase().includes(q) ||
				(b.schedule?.tour?.title || '').toLowerCase().includes(q)
			);
		})
	);

	function formatRupiah(amount: number) {
		return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Manifest Pesanan — Portal Mitra</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h2 class="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
				Manifest Pesanan Penumpang
			</h2>
			<p class="text-xs text-slate-500 mt-1">
				Daftar nama wisatawan dan status tiket yang memesan paket open trip Anda.
			</p>
		</div>

		<!-- Search Bar -->
		<div class="relative w-full sm:w-64">
			<Search class="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
			<input
				type="text"
				placeholder="Cari kode / nama..."
				bind:value={searchQuery}
				class="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-orange-600 focus:outline-none"
			/>
		</div>
	</div>

	<!-- Status Filter Tabs -->
	<div class="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
		{#each [
			{ id: 'ALL', label: 'Semua Status' },
			{ id: 'PAID', label: 'Lunas (Confirmed)' },
			{ id: 'PENDING', label: 'Menunggu Pembayaran' },
			{ id: 'CANCELLED', label: 'Dibatalkan' }
		] as tab}
			<a
				href="/mitra/pesanan?status={tab.id}"
				class="rounded-xl px-3.5 py-2 whitespace-nowrap transition-colors {data.statusFilter === tab.id ? 'bg-orange-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}"
			>
				{tab.label}
			</a>
		{/each}
	</div>

	<!-- Manifest Table Card -->
	<div class="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
		<!-- Mobile Card View (md:hidden) -->
		<div class="block md:hidden divide-y divide-slate-100">
			{#each filteredBookings as b}
				<div class="p-4 space-y-3">
					<div class="flex items-center justify-between">
						<div>
							<span class="font-mono font-black text-slate-900 text-sm">{b.booking_code}</span>
							<span class="block text-[10px] text-slate-400">
								{new Date(b.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
							</span>
						</div>
						<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase {b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
							{#if b.status === 'PAID'}
								<CheckCircle2 class="h-3 w-3" />
								<span>LUNAS</span>
							{:else if b.status === 'PENDING'}
								<Clock class="h-3 w-3" />
								<span>MENUNGGU</span>
							{:else}
								<XCircle class="h-3 w-3" />
								<span>BATAL</span>
							{/if}
						</span>
					</div>

					<div>
						<h4 class="font-extrabold text-slate-900 text-xs">{b.schedule?.tour?.title || '-'}</h4>
						<div class="flex items-center gap-1 text-[11px] text-teal-700 font-bold mt-0.5">
							<Calendar class="h-3 w-3" />
							<span>{b.schedule?.departure_date ? new Date(b.schedule.departure_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
						</div>
					</div>

					<div class="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
						<div>
							<span class="text-slate-500 text-[11px] block">Pemesan:</span>
							<span class="font-bold text-slate-900">{b.contact_name || 'Wisatawan'} ({b.pax_count} pax)</span>
						</div>
						<div class="text-right">
							<span class="text-slate-500 text-[11px] block">Total:</span>
							<span class="font-black text-slate-900">{formatRupiah(b.total_price)}</span>
						</div>
					</div>

					{#if b.contact_phone}
						<a
							href="https://wa.me/{b.contact_phone.replace(/^0/, '62').replace(/[^\d]/g, '')}?text=Halo%20{encodeURIComponent(b.contact_name || '')},%20saya%20dari%20operator%20terkait%20pesanan%20{b.booking_code}"
							target="_blank"
							class="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
						>
							<MessageSquare class="h-3.5 w-3.5" />
							<span>Hubungi via WhatsApp</span>
						</a>
					{/if}
				</div>
			{:else}
				<div class="py-12 text-center text-xs text-slate-400">
					Tidak ada data pesanan yang sesuai filter.
				</div>
			{/each}
		</div>

		<!-- Desktop Table View (hidden md:block) -->
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
					<tr>
						<th class="py-3.5 px-4 sm:px-6">Kode Booking</th>
						<th class="py-3.5 px-4">Paket & Jadwal</th>
						<th class="py-3.5 px-4">Kontak Peserta</th>
						<th class="py-3.5 px-4 text-center">Jumlah Pax</th>
						<th class="py-3.5 px-4">Total Biaya</th>
						<th class="py-3.5 px-4 text-center">Status</th>
						<th class="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
					{#each filteredBookings as b}
						<tr class="hover:bg-orange-50/20 transition-colors">
							<td class="py-4 px-4 sm:px-6 font-mono font-black text-slate-900">
								{b.booking_code}
								<span class="block font-sans text-[10px] font-normal text-slate-400 mt-0.5">
									{new Date(b.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
								</span>
							</td>

							<td class="py-4 px-4">
								<span class="font-extrabold text-slate-900 line-clamp-1 max-w-[200px]">
									{b.schedule?.tour?.title || '-'}
								</span>
								<div class="flex items-center gap-1 text-[11px] text-teal-700 font-bold mt-1">
									<Calendar class="h-3 w-3" />
									<span>
										{b.schedule?.departure_date ? new Date(b.schedule.departure_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
									</span>
								</div>
							</td>

							<td class="py-4 px-4">
								<span class="font-extrabold text-slate-900 block">{b.contact_name || 'Wisatawan'}</span>
								<div class="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
									{#if b.contact_phone}
										<span class="font-mono">{b.contact_phone}</span>
									{/if}
								</div>
							</td>

							<td class="py-4 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-800">
									<Users class="h-3 w-3" />
									<span>{b.pax_count}</span>
								</span>
							</td>

							<td class="py-4 px-4 font-black text-slate-900">
								{formatRupiah(b.total_price)}
							</td>

							<td class="py-4 px-4 text-center">
								<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase
									{b.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
									{#if b.status === 'PAID'}
										<CheckCircle2 class="h-3 w-3" />
										<span>LUNAS</span>
									{:else if b.status === 'PENDING'}
										<Clock class="h-3 w-3" />
										<span>MENUNGGU</span>
									{:else}
										<XCircle class="h-3 w-3" />
										<span>BATAL</span>
									{/if}
								</span>
							</td>

							<td class="py-4 px-4 sm:px-6 text-right">
								{#if b.contact_phone}
									<a
										href="https://wa.me/{b.contact_phone.replace(/^0/, '62').replace(/[^\d]/g, '')}?text=Halo%20{encodeURIComponent(b.contact_name || '')},%20saya%20dari%20operator%20terkait%20pesanan%20{b.booking_code}"
										target="_blank"
										class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
										title="Hubungi via WhatsApp"
									>
										<MessageSquare class="h-3 w-3" />
										<span>WA</span>
									</a>
								{:else}
									<span class="text-slate-300">-</span>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="py-12 text-center text-xs text-slate-400">
								Tidak ada data pesanan yang sesuai filter.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

