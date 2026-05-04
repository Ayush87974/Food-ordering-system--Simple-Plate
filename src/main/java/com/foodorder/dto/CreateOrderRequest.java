package com.foodorder.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
		@NotBlank @Size(max = 120) String customerName,
		@NotBlank @Size(max = 500) String deliveryAddress,
		@NotBlank @Size(max = 40) String phone,
		@NotEmpty @Valid List<OrderLineRequest> items) {
}
