<script lang="ts">
	import { page } from '$app/state';
	import { Compass, Home, Ticket, MessageCircle, AlertTriangle, ArrowLeft } from '@lucide/svelte';
</script>

<div class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
	<div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 shadow-inner mb-6">
		{#if page.status === 404}
			<Compass class="h-10 w-10 animate-bounce" />
		{:else}
			<AlertTriangle class="h-10 w-10 text-orange-600" />
		{/if}
	</div>

	<span class="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-black text-slate-600">
		ERROR {page.status}
	</span>

	<h1 class="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
		{#if page.status === 404}
			Halaman Tidak Ditemukan
		{:else if page.status === 403}
			Akses Ditolak
		{:else if page.status === 500}
			Terjadi Kendala pada Sistem
		{:else}
			Terjadi Kesalahan
		{/if}
	</h1>

	<p class="mt-2 text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
		{#if page.status === 404}
			Maaf, rute perjalanan atau halaman yang Anda tuju mungkin sudah dipindahkan atau tidak tersedia.
		{:else}
			{page.error?.message || 'Permintaan Anda belum dapat diproses saat ini. Tim kami telah mencatat kendala ini.'}
		{/if}
	</p>

	<!-- Quick Actions -->
	<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-900 active:scale-95 transition-all"
		>
			<Home class="h-4 w-4" />
			<span>Kembali ke Beranda</span>
		</a>

		<a
			href="/pesanan"
			class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
		>
			<Ticket class="h-4 w-4 text-teal-700" />
			<span>Cek Pesanan Saya</span>
		</a>

		<a
			href="https://wa.me/6281234567890?text=Halo%20Admin%20Indonesia%20Tours%2C%20saya%20mengalami%20error"
			target="_blank"
			rel="noreferrer"
			class="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-orange-700 hover:bg-orange-100 transition-all"
		>
			<MessageCircle class="h-4 w-4 text-orange-600" />
			<span>Bantuan WhatsApp</span>
		</a>
	</div>
</div>

