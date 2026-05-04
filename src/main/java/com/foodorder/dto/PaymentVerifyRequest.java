package com.foodorder.dto;

/**
 * Sent by the SPA after the customer returns from a hosted checkout.
 */
public record PaymentVerifyRequest(
		String stripeSessionId,
		String razorpayPaymentId,
		String razorpayPaymentLinkId,
		String razorpaySignature,
		String paypalOrderId,
		Boolean cancelled) {
}
