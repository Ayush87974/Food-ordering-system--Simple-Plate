package com.foodorder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.dto.OrderResponse;
import com.foodorder.dto.UpdateOrderStatusRequest;
import com.foodorder.model.AppUser;
import com.foodorder.service.CurrentUserService;
import com.foodorder.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/owner/orders")
public class OwnerOrderController {

	private final OrderService orderService;
	private final CurrentUserService currentUserService;

	public OwnerOrderController(OrderService orderService, CurrentUserService currentUserService) {
		this.orderService = orderService;
		this.currentUserService = currentUserService;
	}

	@GetMapping
	public List<OrderResponse> list() {
		AppUser owner = currentUserService.requireUser();
		return orderService.listAllForOwner();
	}

	@PatchMapping("/{id}/status")
	public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest body) {
		AppUser owner = currentUserService.requireUser();
		return orderService.updateStatus(id, body.status(), owner);
	}
}
