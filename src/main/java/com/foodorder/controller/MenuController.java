package com.foodorder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.dto.MenuItemResponse;
import com.foodorder.repository.MenuItemRepository;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

	private final MenuItemRepository menuItemRepository;

	public MenuController(MenuItemRepository menuItemRepository) {
		this.menuItemRepository = menuItemRepository;
	}

	@GetMapping
	public List<MenuItemResponse> list(@RequestParam(required = false) String category) {
		if (category != null && !category.isBlank()) {
			return menuItemRepository.findByCategoryOrderByNameAsc(category.trim()).stream()
					.map(MenuItemResponse::from).toList();
		}
		return menuItemRepository.findAllByOrderByCategoryAscNameAsc().stream().map(MenuItemResponse::from).toList();
	}
}
