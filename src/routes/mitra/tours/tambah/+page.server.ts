import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { partner } = await parent();
	if (!partner) throw redirect(303, '/mitra/daftar');
	return {};
};

export const actions: Actions = {
	createTour: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Silakan masuk terlebih dahulu' });

		// Fetch partner profile for this user
		let { data: partner } = await locals.supabase
			.from('partner_profiles')
			.select('id')
			.eq('user_id', user.id)
			.maybeSingle();

		// If admin testing without own partner profile, use first partner
		if (!partner && locals.profile?.role === 'admin') {
			const { data: firstPartner } = await locals.supabase
				.from('partner_profiles')
				.select('id')
				.limit(1)
				.single();
			partner = firstPartner;
		}

		if (!partner) return fail(401, { message: 'Akses mitra diperlukan' });

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const destination = formData.get('destination')?.toString().trim();
		const price = Number(formData.get('price') || 0);
		const duration = formData.get('duration')?.toString().trim() || '3H2N';
		const description = formData.get('description')?.toString().trim();
		const coverImageUrl = formData.get('cover_image_url')?.toString().trim() ||
			'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80';
		const meetingPoint = formData.get('meeting_point')?.toString().trim() || 'Bandara / Stasiun Terdekat';

		// Schedule fields
		const departureDate = formData.get('departure_date')?.toString();
		const returnDate = formData.get('return_date')?.toString();
		const quotaTotal = Number(formData.get('quota_total') || 12);

		if (!title || !destination || price <= 0 || !departureDate || !returnDate) {
			return fail(400, { message: 'Judul, Destinasi, Harga, dan Tanggal Jadwal wajib diisi' });
		}

		// Generate slug
		const baseSlug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
		const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

		// Mock itinerary & facilities
		const itinerary = [
			{ day: 1, title: 'Penjemputan & Menuju Lokasi Utama', activity: `Penjemputan peserta di ${meetingPoint}, briefing keselamatan, dan perjalanan santai.` },
			{ day: 2, title: 'Eksplorasi Destinasi & Golden Hour', activity: 'Menikmati keindahan alam spektakuler, sesi fotografi, snorkeling / trekking, dan santap kuliner lokal.' },
			{ day: 3, title: 'Oleh-oleh & Drop Off', activity: 'Belanja cinderamata khas lokal, persiapan check-out, dan kembali ke titik penjemputan.' }
		];

		const facilities = {
			included: [
				'Transportasi AC selama perjalanan',
				'Tiket masuk objek wisata & asuransi resmi',
				'Pramuwisata / Guide lokal berlisensi HPI',
				'Makan sesuai program itinerary & air mineral',
				'Dokumentasi foto perjalanan'
			],
			excluded: [
				'Tiket pesawat / kereta menuju titik kumpul',
				'Pengeluaran pribadi & tip sukarela guide',
				'Upgrade fasilitas di luar paket'
			]
		};

		// 1. Insert tour
		const { data: newTour, error: tourErr } = await locals.supabase
			.from('tours')
			.insert({
				partner_id: partner.id,
				title,
				slug,
				destination,
				price,
				duration,
				description: description || `Paket open trip seru bersama operator berlisensi resmi ke destinasi eksotis ${destination}.`,
				cover_image_url: coverImageUrl,
				meeting_point: meetingPoint,
				itinerary,
				facilities,
				status: 1
			})
			.select('id')
			.single();

		if (tourErr || !newTour) {
			return fail(500, { message: 'Gagal membuat paket tur: ' + (tourErr?.message || 'DB Error') });
		}

		// 2. Insert initial schedule
		const { error: schedErr } = await locals.supabase
			.from('tour_schedules')
			.insert({
				tour_id: newTour.id,
				departure_date: departureDate,
				return_date: returnDate,
				quota_total: quotaTotal,
				quota_booked: 0,
				status: 1
			});

		if (schedErr) {
			return fail(500, { message: 'Tur berhasil dibuat, namun jadwal gagal dibuat: ' + schedErr.message });
		}

		throw redirect(303, '/mitra/tours?created=true');
	}
};

