package com.foodorder.dto;

import com.foodorder.model.PaymentGateway;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(@NotNull PaymentGateway gateway) {
}
