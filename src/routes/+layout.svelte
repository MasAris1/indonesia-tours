<script lang="ts">
	import './layout.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MobileBottomNav from '$lib/components/MobileBottomNav.svelte';
	import AuthPortal from '$lib/components/AuthPortal.svelte';

	let { data, children }: LayoutProps = $props();

	let isAuthRoute = $derived(
		page.url.pathname === '/masuk' || page.url.pathname === '/daftar'
	);
</script>

<svelte:head>
	<title>Indonesia Tours — Platform Open Trip Terkurasi & Aman</title>
	<meta
		name="description"
		content="Pesan tiket open trip Bromo, Labuan Bajo, Raja Ampat dengan kepastian sisa kursi real-time dan pembayaran rekber escrow aman via Midtrans."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden bg-surface text-slate-800">
	<Navbar user={data.user} profile={data.profile} />
	<main class="flex-1 w-full min-w-0 max-w-full pb-16 md:pb-0">
		{#if isAuthRoute}
			<AuthPortal />
		{:else}
			{@render children()}
		{/if}
	</main>
	<Footer />
	<MobileBottomNav user={data.user} profile={data.profile} />
</div>
