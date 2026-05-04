package com.foodorder.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.foodorder.dto.AuthResponse;
import com.foodorder.dto.LoginRequest;
import com.foodorder.dto.RegisterRequest;
import com.foodorder.model.AppUser;
import com.foodorder.model.Role;
import com.foodorder.repository.AppUserRepository;
import com.foodorder.security.JwtService;

@Service
public class AuthService {

	private final AppUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@Transactional
	public AuthResponse register(RegisterRequest request, Role role) {
		if (userRepository.existsByUsername(request.username().trim())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
		}
		if (userRepository.existsByEmail(request.email().trim().toLowerCase())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
		}
		AppUser user = new AppUser();
		user.setUsername(request.username().trim());
		user.setEmail(request.email().trim().toLowerCase());
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(role);
		userRepository.save(user);
		String token = jwtService.generateToken(user);
		return new AuthResponse(token, user.getUsername(), user.getRole());
	}

	public AuthResponse login(LoginRequest request) {
		AppUser user = userRepository.findByUsername(request.username().trim())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		String token = jwtService.generateToken(user);
		return new AuthResponse(token, user.getUsername(), user.getRole());
	}
}
