package com.foodorder.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.foodorder.model.CustomerOrder;
import com.foodorder.model.OrderStatus;
import com.foodorder.model.PaymentGateway;

public record OrderResponse(
		Long id,
		String customerName,
		String deliveryAddress,
		String phone,
		OrderStatus status,
		BigDecimal total,
		Instant createdAt,
		boolean paid,
		PaymentGateway paymentGateway,
		List<OrderLineResponse> lines) {

	public static OrderResponse from(CustomerOrder order) {
		List<OrderLineResponse> lineDtos = order.getLines().stream().map(OrderLineResponse::from).toList();
		return new OrderResponse(order.getId(), order.getCustomerName(), order.getDeliveryAddress(), order.getPhone(),
				order.getStatus(), order.getTotal(), order.getCreatedAt(), order.isPaid(), order.getPaymentGateway(),
				lineDtos);
	}
}
