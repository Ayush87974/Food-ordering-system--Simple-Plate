package com.foodorder.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderLineRequest(
		@NotNull Long menuItemId,
		@NotNull @Min(1) Integer quantity) {
}
