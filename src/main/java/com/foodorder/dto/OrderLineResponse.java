package com.foodorder.dto;

import java.math.BigDecimal;

import com.foodorder.model.OrderLine;

public record OrderLineResponse(String menuItemName, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {

	public static OrderLineResponse from(OrderLine line) {
		return new OrderLineResponse(line.getMenuItem().getName(), line.getQuantity(), line.getUnitPrice(),
				line.getLineTotal());
	}
}
