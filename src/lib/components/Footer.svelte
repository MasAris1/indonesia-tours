<script lang="ts">
	import { Compass, ShieldCheck, HeartHandshake, Zap, ArrowUpRight } from '@lucide/svelte';
</script>

<footer class="w-full max-w-full overflow-hidden border-t border-slate-200 bg-slate-900 text-slate-300">
	<!-- Trust Value Props Banner -->
	<div class="border-b border-slate-800 bg-slate-950/60 py-8">
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8 w-full min-w-0">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-900/50 text-teal-400">
					<ShieldCheck class="h-6 w-6" />
				</div>
				<div>
					<h4 class="text-sm font-bold text-white">Rekening Bersama (Escrow)</h4>
					<p class="text-xs text-slate-400">Dana ditahan aman sampai trip selesai tuntas.</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-900/50 text-teal-400">
					<Zap class="h-6 w-6" />
				</div>
				<div>
					<h4 class="text-sm font-bold text-white">Sisa Kursi Real-Time</h4>
					<p class="text-xs text-slate-400">Kunci kursi atomik, anti-overbooking 100%.</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-900/50 text-teal-400">
					<HeartHandshake class="h-6 w-6" />
				</div>
				<div>
					<h4 class="text-sm font-bold text-white">Mitra Terverifikasi</h4>
					<p class="text-xs text-slate-400">Legalitas NIB & lisensi HPI terkurasi ketat.</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Footer Links -->
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full min-w-0">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="md:col-span-2">
				<div class="flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
						<Compass class="h-5 w-5" />
					</div>
					<span class="text-lg font-bold text-white">
						Indonesia<span class="text-orange-500">Tours</span>
					</span>
				</div>
				<p class="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
					Platform agregator Open & Private Trip terkurasi nomor satu di Indonesia. Temukan keajaiban nusantara dengan kepastian kuota, pembayaran online aman via Midtrans, dan tiket instan.
				</p>
			</div>

			<div>
				<h4 class="text-xs font-bold uppercase tracking-wider text-white">Destinasi Populer</h4>
				<ul class="mt-3 space-y-2 text-xs text-slate-400">
					<li><a href="/?destinasi=Labuan+Bajo" class="hover:text-teal-400">Labuan Bajo & Komodo</a></li>
					<li><a href="/?destinasi=Bromo" class="hover:text-teal-400">Gunung Bromo & Malang</a></li>
					<li><a href="/?destinasi=Raja+Ampat" class="hover:text-teal-400">Raja Ampat Wayag</a></li>
					<li><a href="/?destinasi=Dieng" class="hover:text-teal-400">Dataran Tinggi Dieng</a></li>
					<li><a href="/?destinasi=Sumba" class="hover:text-teal-400">Pulau Sumba Eksotis</a></li>
				</ul>
			</div>

			<div>
				<h4 class="text-xs font-bold uppercase tracking-wider text-white">Bantuan & Legalitas</h4>
				<ul class="mt-3 space-y-2 text-xs text-slate-400">
					<li><a href="/pesanan" class="hover:text-teal-400">Cek Tiket Saya</a></li>
					<li><a href="/#cara-kerja" class="hover:text-teal-400">Kebijakan Escrow</a></li>
					<li><a href="/#cara-kerja" class="hover:text-teal-400">Alur Refund Otomatis</a></li>
					<li>
						<a
							href="https://wa.me/6281234567890?text=Halo%20Admin%20Indonesia%20Tours"
							target="_blank"
							rel="noreferrer"
							class="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300"
						>
							<span>Customer Care 24/7</span>
							<ArrowUpRight class="h-3 w-3" />
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
			&copy; 2026 Indonesia Tours Platform. Hak Cipta Dilindungi. Sesuai PRD & Implementation Plan.
		</div>
	</div>
</footer>

