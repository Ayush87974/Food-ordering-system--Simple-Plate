package com.foodorder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foodorder.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

	List<MenuItem> findByCategoryOrderByNameAsc(String category);

	List<MenuItem> findAllByOrderByCategoryAscNameAsc();
}
