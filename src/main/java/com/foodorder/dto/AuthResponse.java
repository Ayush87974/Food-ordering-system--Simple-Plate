package com.foodorder.dto;

import com.foodorder.model.Role;

public record AuthResponse(String token, String username, Role role) {
}
