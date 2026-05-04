package com.foodorder.dto;

import com.foodorder.model.PaymentGateway;

public record PaymentInitiationResponse(String redirectUrl, PaymentGateway gateway) {
}
