package com.foodorder.dto;

import java.math.BigDecimal;

import com.foodorder.model.MenuItem;

public record MenuItemResponse(Long id, String name, String description, String category, BigDecimal price,
		String imageUrl) {

	public static MenuItemResponse from(MenuItem item) {
		return new MenuItemResponse(item.getId(), item.getName(), item.getDescription(), item.getCategory(),
				item.getPrice(), item.getImageUrl());
	}
}
