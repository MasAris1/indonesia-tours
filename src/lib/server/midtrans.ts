import crypto from 'node:crypto';

export interface ChargeResult {
	success: boolean;
	orderId: string;
	grossAmount: number;
	paymentType: 'qris' | 'bank_transfer';
	bank?: string;
	qrString?: string;
	qrUrl?: string;
	vaNumber?: string;
	expiryTime?: string;
	rawResponse?: Record<string, unknown>;
	isSimulated: boolean;
	errorMessage?: string;
}

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = IS_PROD ? 'https://api.midtrans.com/v2' : 'https://api.sandbox.midtrans.com/v2';

export async function chargePayment({
	orderId,
	grossAmount,
	method,
	bank = 'bca',
	customerDetails
}: {
	orderId: string;
	grossAmount: number;
	method: 'qris' | 'va';
	bank?: 'bca' | 'bni' | 'bri' | 'mandiri' | string;
	customerDetails: {
		firstName: string;
		email: string;
		phone: string;
	};
}): Promise<ChargeResult> {
	// If MIDTRANS_SERVER_KEY is not configured, seamlessly provide mock/simulation
	if (!SERVER_KEY) {
		const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
		if (method === 'qris') {
			const mockQrString = `00020101021226670016ID.CO.INDONESIATOURS011893600999${orderId}520458125303360540${grossAmount}5802ID5915INDONESIA TOURS6007JAKARTA6304`;
			return {
				success: true,
				orderId,
				grossAmount,
				paymentType: 'qris',
				qrString: mockQrString,
				qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mockQrString)}`,
				expiryTime: expiry,
				isSimulated: true
			};
		} else {
			// Virtual Account simulation
			const bankCode = bank.toLowerCase();
			const prefix = bankCode === 'bca' ? '70012' : bankCode === 'bni' ? '8808' : bankCode === 'bri' ? '128' : '889';
			const vaNumber = `${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`;
			return {
				success: true,
				orderId,
				grossAmount,
				paymentType: 'bank_transfer',
				bank: bank.toUpperCase(),
				vaNumber,
				expiryTime: expiry,
				isSimulated: true
			};
		}
	}

	// Real Midtrans API call
	const authHeader = `Basic ${Buffer.from(`${SERVER_KEY}:`).toString('base64')}`;
	let body: Record<string, unknown> = {};

	if (method === 'qris') {
		body = {
			payment_type: 'qris',
			transaction_details: {
				order_id: orderId,
				gross_amount: Math.round(grossAmount)
			},
			customer_details: {
				first_name: customerDetails.firstName,
				email: customerDetails.email,
				phone: customerDetails.phone
			},
			qris: {
				acquirer: 'gopay'
			}
		};
	} else {
		body = {
			payment_type: 'bank_transfer',
			transaction_details: {
				order_id: orderId,
				gross_amount: Math.round(grossAmount)
			},
			customer_details: {
				first_name: customerDetails.firstName,
				email: customerDetails.email,
				phone: customerDetails.phone
			},
			bank_transfer: {
				bank: bank.toLowerCase()
			}
		};
	}

	try {
		const res = await fetch(`${BASE_URL}/charge`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: authHeader
			},
			body: JSON.stringify(body)
		});

		const data = await res.json();
		if (!res.ok || data.status_code?.startsWith('4') || data.status_code?.startsWith('5')) {
			return {
				success: false,
				orderId,
				grossAmount,
				paymentType: method === 'qris' ? 'qris' : 'bank_transfer',
				isSimulated: false,
				errorMessage: data.status_message || 'Gagal memproses ke Midtrans'
			};
		}

		let qrString: string | undefined;
		let qrUrl: string | undefined;
		let vaNumber: string | undefined;

		if (data.actions) {
			const qrAction = (data.actions as Array<{ name: string; url: string }>).find(
				(a) => a.name === 'generate-qr-code'
			);
			if (qrAction) qrUrl = qrAction.url;
		}
		if (data.qr_string) qrString = data.qr_string;

		if (data.va_numbers && data.va_numbers[0]) {
			vaNumber = data.va_numbers[0].va_number;
		} else if (data.permata_va_number) {
			vaNumber = data.permata_va_number;
		} else if (data.bill_key && data.biller_code) {
			vaNumber = `${data.biller_code} - ${data.bill_key}`;
		}

		return {
			success: true,
			orderId,
			grossAmount,
			paymentType: method === 'qris' ? 'qris' : 'bank_transfer',
			bank: bank.toUpperCase(),
			qrString,
			qrUrl: qrUrl || (qrString ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}` : undefined),
			vaNumber,
			expiryTime: data.expiry_time,
			rawResponse: data,
			isSimulated: false
		};
	} catch (err) {
		return {
			success: false,
			orderId,
			grossAmount,
			paymentType: method === 'qris' ? 'qris' : 'bank_transfer',
			isSimulated: false,
			errorMessage: err instanceof Error ? err.message : 'Koneksi Midtrans gagal'
		};
	}
}

export function verifyMidtransSignature({
	orderId,
	statusCode,
	grossAmount,
	signatureKey
}: {
	orderId: string;
	statusCode: string;
	grossAmount: string;
	signatureKey: string;
}): boolean {
	if (!SERVER_KEY) {
		// Only permit simulated signature if strictly in local non-production development
		return !IS_PROD && process.env.NODE_ENV !== 'production';
	}
	const hash = crypto
		.createHash('sha512')
		.update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
		.digest('hex');
	return hash === signatureKey;
}

