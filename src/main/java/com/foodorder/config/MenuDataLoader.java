package com.foodorder.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.foodorder.model.MenuItem;
import com.foodorder.repository.MenuItemRepository;

@Configuration
public class MenuDataLoader {

	@Bean
	CommandLineRunner seedMenu(MenuItemRepository repo) {
		return args -> {
			if (repo.count() > 0) {
				return;
			}
			repo.save(new MenuItem("Margherita Pizza", "Tomato, mozzarella, basil", "Pizza", bd("9.99"),
					"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Pepperoni Pizza", "Tomato, mozzarella, pepperoni", "Pizza", bd("11.49"),
					"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Garlic Bread", "Toasted with garlic butter", "Sides", bd("4.50"),
					"https://images.unsplash.com/photo-1576100882584-561a6a8b112f?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Caesar Salad", "Romaine, parmesan, croutons", "Salads", bd("7.25"),
					"https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Grilled Chicken Bowl", "Rice, veggies, house sauce", "Mains", bd("10.99"),
					"https://images.unsplash.com/photo-1598515214224-623eaee00efb?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Veggie Burger", "Plant patty, lettuce, tomato", "Mains", bd("9.50"),
					"https://images.unsplash.com/photo-1520072959219-c595feb870b0?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Chocolate Brownie", "Warm brownie with cocoa", "Desserts", bd("5.00"),
					"https://images.unsplash.com/photo-1607920591413-4ec007e7007b?auto=format&w=640&h=420&fit=crop&q=80"));
			repo.save(new MenuItem("Fresh Lime Soda", "Sparkling lime drink", "Drinks", bd("2.99"),
					"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&w=640&h=420&fit=crop&q=80"));
		};
	}

	private static BigDecimal bd(String v) {
		return new BigDecimal(v);
	}
}
