package com.foodorder.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.payment")
public class AppPaymentProperties {

	/**
	 * Customer SPA origin, e.g. http://localhost:5173 — used for provider return URLs.
	 */
	private String frontendBaseUrl = "http://localhost:5173";

	private String stripeSecretKey = "";

	private String razorpayKeyId = "";

	private String razorpayKeySecret = "";

	private String paypalClientId = "";

	private String paypalClientSecret = "";

	/** sandbox | live */
	private String paypalMode = "sandbox";

	/** Multiply USD order total for Razorpay INR link (menu prices are USD). */
	private String usdToInrRate = "83";

	public String getFrontendBaseUrl() {
		return frontendBaseUrl;
	}

	public void setFrontendBaseUrl(String frontendBaseUrl) {
		this.frontendBaseUrl = frontendBaseUrl;
	}

	public String getStripeSecretKey() {
		return stripeSecretKey;
	}

	public void setStripeSecretKey(String stripeSecretKey) {
		this.stripeSecretKey = stripeSecretKey;
	}

	public String getRazorpayKeyId() {
		return razorpayKeyId;
	}

	public void setRazorpayKeyId(String razorpayKeyId) {
		this.razorpayKeyId = razorpayKeyId;
	}

	public String getRazorpayKeySecret() {
		return razorpayKeySecret;
	}

	public void setRazorpayKeySecret(String razorpayKeySecret) {
		this.razorpayKeySecret = razorpayKeySecret;
	}

	public String getPaypalClientId() {
		return paypalClientId;
	}

	public void setPaypalClientId(String paypalClientId) {
		this.paypalClientId = paypalClientId;
	}

	public String getPaypalClientSecret() {
		return paypalClientSecret;
	}

	public void setPaypalClientSecret(String paypalClientSecret) {
		this.paypalClientSecret = paypalClientSecret;
	}

	public String getPaypalMode() {
		return paypalMode;
	}

	public void setPaypalMode(String paypalMode) {
		this.paypalMode = paypalMode;
	}

	public String getUsdToInrRate() {
		return usdToInrRate;
	}

	public void setUsdToInrRate(String usdToInrRate) {
		this.usdToInrRate = usdToInrRate;
	}

	public boolean hasStripe() {
		return stripeSecretKey != null && !stripeSecretKey.isBlank();
	}

	public boolean hasRazorpay() {
		return razorpayKeyId != null && !razorpayKeyId.isBlank() && razorpayKeySecret != null
				&& !razorpayKeySecret.isBlank();
	}

	public boolean hasPaypal() {
		return paypalClientId != null && !paypalClientId.isBlank() && paypalClientSecret != null
				&& !paypalClientSecret.isBlank();
	}

	public String paypalApiBase() {
		return "live".equalsIgnoreCase(paypalMode) ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
	}
}
