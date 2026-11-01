import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user || locals.profile?.role !== 'admin') {
		return new Response('Unauthorized', { status: 401 });
	}

	const { data: bookings } = await locals.supabase
		.from('bookings')
		.select(`
			booking_code, pax_count, total_price, status, booking_status, created_date, contact_name, contact_phone,
			schedule:tour_schedules(departure_date, tour:tours(title, destination, partner:partner_profiles(company_name, commission_rate)))
		`)
		.order('created_date', { ascending: false });

	const rows = [
		[
			'Kode Booking',
			'Tanggal Pesan',
			'Paket Open Trip',
			'Destinasi',
			'Mitra Operator',
			'Nama Peserta',
			'No Telepon',
			'Jumlah Pax',
			'Nilai Bruto (GMV IDR)',
			'Komisi Platform 10% (IDR)',
			'Penerimaan Mitra (IDR)',
			'Status Pembayaran'
		]
	];

	for (const b of (bookings || [])) {
		const sched = Array.isArray(b.schedule) ? b.schedule[0] : (b.schedule as any);
		const tour = Array.isArray(sched?.tour) ? sched?.tour[0] : sched?.tour;
		const partner = Array.isArray(tour?.partner) ? tour?.partner[0] : tour?.partner;

		const rate = Number(partner?.commission_rate || 10);
		const gross = Number(b.total_price || 0);
		const comm = Math.round(gross * (rate / 100));
		const net = gross - comm;

		rows.push([
			b.booking_code,
			new Date(b.created_date).toISOString().slice(0, 10),
			`"${(tour?.title || '').replace(/"/g, '""')}"`,
			`"${(tour?.destination || '').replace(/"/g, '""')}"`,
			`"${(partner?.company_name || '').replace(/"/g, '""')}"`,
			`"${(b.contact_name || '').replace(/"/g, '""')}"`,
			`'${b.contact_phone || ''}`,
			String(b.pax_count || 1),
			String(gross),
			String(comm),
			String(net),
			b.booking_status || b.status
		]);
	}

	const csvContent = rows.map((r) => r.join(',')).join('\r\n');

	return new Response(csvContent, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="laporan-transaksi-indonesia-tours-${new Date().toISOString().slice(0, 10)}.csv"`
		}
	});
};
