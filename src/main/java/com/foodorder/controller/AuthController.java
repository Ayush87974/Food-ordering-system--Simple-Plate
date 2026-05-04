package com.foodorder.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.dto.AuthResponse;
import com.foodorder.dto.LoginRequest;
import com.foodorder.dto.RegisterRequest;
import com.foodorder.model.Role;
import com.foodorder.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse registerCustomer(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request, Role.CUSTOMER);
	}

	@PostMapping("/register/owner")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse registerOwner(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request, Role.OWNER);
	}
}
