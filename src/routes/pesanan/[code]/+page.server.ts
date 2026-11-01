import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import QRCode from 'qrcode';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const { code } = params;
	const isJustPaid = url.searchParams.get('paid') === 'true';

	const { data, error: rpcError } = await locals.supabase.rpc('get_booking_details', {
		p_booking_code: code
	});

	if (rpcError || !data || !data.booking) {
		console.error('get_booking_details error:', rpcError);
		throw error(404, 'Tiket atau pesanan tidak ditemukan');
	}

	// Generate QR Code data URL for the digital ticket
	const ticketQrDataUrl = await QRCode.toDataURL(
		`INDONESIA-TOURS-TICKET:${data.booking.booking_code}:${data.booking.id}`,
		{ width: 250, margin: 1, color: { dark: '#00685f', light: '#ffffff' } }
	);

	return {
		bookingDetails: data,
		ticketQrDataUrl,
		isJustPaid
	};
};

export const actions: Actions = {
	cancel: async ({ request, locals, params }) => {
		const { code } = params;

		if (!locals.user) {
			return fail(401, { message: 'Silakan masuk terlebih dahulu untuk membatalkan pesanan' });
		}

		const formData = await request.formData();
		const reason = formData.get('reason')?.toString()?.trim() || 'Pembatalan oleh peserta';

		const { data: details } = await locals.supabase.rpc('get_booking_details', {
			p_booking_code: code
		});

		if (!details || !details.booking) {
			return fail(404, { message: 'Pesanan tidak ditemukan' });
		}

		const booking = details.booking;

		// Verify booking ownership: must be the customer who booked or an admin
		if (locals.user.id !== booking.user_id && locals.profile?.role !== 'admin') {
			return fail(403, { message: 'Akses ditolak: Anda tidak memiliki wewenang untuk membatalkan pesanan ini' });
		}

		// Call cancel_booking RPC with authenticated user id
		const { error: cancelErr } = await locals.supabase.rpc('cancel_booking', {
			p_user_id: booking.user_id,
			p_booking_id: booking.id,
			p_reason: reason
		});

		if (cancelErr) {
			console.error('cancel_booking error:', cancelErr);
			return fail(400, { message: `Gagal membatalkan tiket: ${cancelErr.message}` });
		}

		return {
			cancelled: true,
			message: 'Pesanan berhasil dibatalkan. Pengajuan refund Anda telah dicatat (REFUND_REQUESTED).'
		};
	}
};

