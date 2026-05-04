package com.foodorder.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.dto.CreateOrderRequest;
import com.foodorder.dto.OrderResponse;
import com.foodorder.dto.PaymentInitiationResponse;
import com.foodorder.dto.PaymentRequest;
import com.foodorder.dto.PaymentVerifyRequest;
import com.foodorder.model.AppUser;
import com.foodorder.service.CurrentUserService;
import com.foodorder.service.OrderPaymentService;
import com.foodorder.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;
	private final OrderPaymentService orderPaymentService;
	private final CurrentUserService currentUserService;

	public OrderController(OrderService orderService, OrderPaymentService orderPaymentService,
			CurrentUserService currentUserService) {
		this.orderService = orderService;
		this.orderPaymentService = orderPaymentService;
		this.currentUserService = currentUserService;
	}

	@GetMapping("/me")
	public List<OrderResponse> myOrders() {
		AppUser user = currentUserService.requireUser();
		return orderService.listMine(user);
	}

	@GetMapping("/{id}")
	public OrderResponse get(@PathVariable Long id) {
		AppUser user = currentUserService.requireUser();
		return orderService.getById(id, user);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public OrderResponse create(@Valid @RequestBody CreateOrderRequest body) {
		AppUser user = currentUserService.requireUser();
		return orderService.create(body, user);
	}

	@PostMapping("/{id}/payment/initiate")
	public PaymentInitiationResponse initiatePayment(@PathVariable Long id, @Valid @RequestBody PaymentRequest body) {
		AppUser user = currentUserService.requireUser();
		return orderPaymentService.initiate(id, body, user);
	}

	@PostMapping("/{id}/payment/verify")
	public OrderResponse verifyPayment(@PathVariable Long id, @RequestBody PaymentVerifyRequest body) {
		AppUser user = currentUserService.requireUser();
		return orderPaymentService.verify(id, body, user);
	}
}
