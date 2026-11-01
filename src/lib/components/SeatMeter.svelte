<script lang="ts">
	let { quotaTotal, quotaBooked }: { quotaTotal: number; quotaBooked: number } = $props();

	let remaining = $derived(Math.max(0, quotaTotal - quotaBooked));
	let percent = $derived(Math.min(100, Math.round((quotaBooked / quotaTotal) * 100)));
	let isCritical = $derived(remaining <= 3 && remaining > 0);
	let isSoldOut = $derived(remaining <= 0);
</script>

<div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5">
	<div class="mb-1.5 flex items-center justify-between text-xs font-semibold">
		{#if isSoldOut}
			<span class="inline-flex items-center gap-1.5 font-bold text-red-600">
				<span class="h-2 w-2 rounded-full bg-red-500"></span>
				Kursi Habis (Sold Out)
			</span>
		{:else if isCritical}
			<span class="inline-flex items-center gap-1.5 font-bold text-orange-600">
				<span class="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
				Sisa {remaining} Kursi Lagi!
			</span>
		{:else}
			<span class="inline-flex items-center gap-1.5 font-semibold text-teal-800">
				<span class="h-2 w-2 rounded-full bg-teal-500"></span>
				Tersedia {remaining} Kursi
			</span>
		{/if}

		<span class="text-[11px] font-medium text-slate-500">
			Terisi {percent}% ({quotaBooked}/{quotaTotal})
		</span>
	</div>

	<!-- Progress Track -->
	<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
		<div
			class="h-full rounded-full transition-all duration-500 {isSoldOut ? 'bg-red-500' : isCritical ? 'bg-orange-500' : 'bg-teal-600'}"
			style="width: {percent}%"
		></div>
	</div>
</div>

