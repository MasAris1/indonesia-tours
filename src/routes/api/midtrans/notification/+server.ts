import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyMidtransSignature } from '$lib/server/midtrans';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const payload = await request.json();
		const orderId = payload.order_id;
		const statusCode = payload.status_code;
		const grossAmount = payload.gross_amount;
		const signatureKey = payload.signature_key;
		const transactionStatus = payload.transaction_status;
		const fraudStatus = payload.fraud_status;

		// Verify Midtrans signature
		const isValid = verifyMidtransSignature({
			orderId,
			statusCode,
			grossAmount,
			signatureKey
		});

		if (!isValid) {
			return json({ message: 'Invalid signature key' }, { status: 403 });
		}

		// Find booking by orderId or gateway_order_id in payments
		const { data: payment } = await locals.supabase
			.from('payments')
			.select('booking_id, id')
			.eq('gateway_order_id', orderId)
			.single();

		if (!payment) {
			return json({ message: 'Payment record not found' }, { status: 404 });
		}

		const isPaid =
			transactionStatus === 'settlement' ||
			(transactionStatus === 'capture' && fraudStatus === 'accept');

		if (isPaid) {
			const { error: markErr } = await locals.supabase.rpc('mark_booking_paid', {
				p_booking_id: payment.booking_id,
				p_gateway_ref: payload.transaction_id || orderId,
				p_paid_at: payload.settlement_time || new Date().toISOString()
			});

			if (markErr) {
				console.error('Error marking booking paid via webhook:', markErr);
				return json({ message: markErr.message }, { status: 500 });
			}
		}

		return json({ status: 'OK' });
	} catch (err) {
		console.error('Webhook error:', err);
		return json({ message: 'Server error handling notification' }, { status: 500 });
	}
};

