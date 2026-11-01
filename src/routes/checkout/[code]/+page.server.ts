import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { chargePayment } from '$lib/server/midtrans';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;

	const { data, error: rpcError } = await locals.supabase.rpc('get_booking_details', {
		p_booking_code: code
	});

	if (rpcError || !data || !data.booking) {
		console.error('get_booking_details error:', rpcError);
		throw error(404, 'Pesanan tidak ditemukan');
	}

	// If already paid, redirect straight to the digital ticket page
	if (data.booking.booking_status === 'PAID') {
		throw redirect(303, `/pesanan/${code}`);
	}

	const isSimulatedAllowed =
		process.env.MIDTRANS_IS_PRODUCTION !== 'true' &&
		process.env.NODE_ENV !== 'production' &&
		!process.env.MIDTRANS_SERVER_KEY;

	return {
		bookingDetails: data,
		isSimulatedAllowed
	};
};

export const actions: Actions = {
	apply_promo: async ({ request, locals, params }) => {
		const { code } = params;
		const formData = await request.formData();
		const promoCode = formData.get('promo_code')?.toString().trim().toUpperCase();

		if (!promoCode) {
			return fail(400, { message: 'Masukkan kode voucher terlebih dahulu' });
		}

		const { data: details } = await locals.supabase.rpc('get_booking_details', {
			p_booking_code: code
		});

		if (!details || !details.booking) {
			return fail(404, { message: 'Pesanan tidak ditemukan' });
		}

		const booking = details.booking;

		// Call validate_promo RPC
		const { data: promoRes, error: promoErr } = await locals.supabase.rpc('validate_promo', {
			p_code: promoCode,
			p_amount: Number(booking.total_price)
		});

		if (promoErr || !promoRes?.success) {
			return fail(400, { message: promoRes?.message || promoErr?.message || 'Kode promo tidak valid' });
		}

		// Update total_price in bookings with discounted final amount
		const { error: updateErr } = await locals.supabase
			.from('bookings')
			.update({
				total_price: promoRes.final_amount,
				last_updated_date: new Date().toISOString()
			})
			.eq('id', booking.id);

		if (updateErr) {
			return fail(500, { message: 'Gagal menerapkan voucher: ' + updateErr.message });
		}

		return {
			promoSuccess: true,
			promoResult: promoRes,
			message: promoRes.message
		};
	},

	charge: async ({ request, locals, params }) => {
		const { code } = params;
		const formData = await request.formData();
		const method = formData.get('method')?.toString() as 'qris' | 'va';
		const bank = formData.get('bank')?.toString() || 'bca';

		const { data: details, error: detailsErr } = await locals.supabase.rpc('get_booking_details', {
			p_booking_code: code
		});

		if (detailsErr || !details || !details.booking) {
			return fail(404, { message: 'Pesanan tidak ditemukan' });
		}

		const booking = details.booking;
		const orderId = `${booking.booking_code}-${Date.now().toString().slice(-4)}`;

		// Call Midtrans Charge (or local simulation fallback)
		const chargeResult = await chargePayment({
			orderId,
			grossAmount: Number(booking.total_price),
			method: method || 'qris',
			bank,
			customerDetails: {
				firstName: booking.contact_name,
				email: booking.contact_email,
				phone: booking.contact_phone
			}
		});

		if (!chargeResult.success) {
			return fail(400, { message: chargeResult.errorMessage || 'Gagal membuat tagihan pembayaran' });
		}

		// Insert or get payment in DB
		const { error: payErr } = await locals.supabase.rpc('create_or_get_payment', {
			p_booking_id: booking.id,
			p_method: method === 'qris' ? 'QRIS' : 'VA',
			p_bank: chargeResult.bank || bank.toUpperCase(),
			p_amount: booking.total_price,
			p_gateway_order_id: orderId,
			p_qr_string: chargeResult.qrString || null,
			p_qr_url: chargeResult.qrUrl || null,
			p_va_number: chargeResult.vaNumber || null,
			p_expired_at: chargeResult.expiryTime || booking.expires_at,
			p_raw_response: chargeResult.rawResponse || { simulated: true }
		});

		if (payErr) {
			console.error('create_or_get_payment error:', payErr);
		}

		return {
			success: true,
			charge: chargeResult
		};
	},

	// Built-in Simulator Action for Local Development Verification
	simulate_pay: async ({ locals, params }) => {
		if (process.env.MIDTRANS_IS_PRODUCTION === 'true') {
			return fail(403, { message: 'Simulasi pembayaran dinonaktifkan di lingkungan produksi. Harap selesaikan pembayaran resmi.' });
		}

		const { code } = params;

		const { data: details } = await locals.supabase.rpc('get_booking_details', {
			p_booking_code: code
		});

		if (!details || !details.booking) {
			return fail(404, { message: 'Pesanan tidak ditemukan' });
		}

		const booking = details.booking;

		// Call mark_booking_paid RPC
		const { error: paidErr } = await locals.supabase.rpc('mark_booking_paid', {
			p_booking_id: booking.id,
			p_gateway_ref: `SIM-${Date.now()}`,
			p_paid_at: new Date().toISOString()
		});

		if (paidErr) {
			console.error('mark_booking_paid error:', paidErr);
			return fail(500, { message: `Gagal simulasi bayar: ${paidErr.message}` });
		}

		throw redirect(303, `/pesanan/${code}?paid=true`);
	}
};
