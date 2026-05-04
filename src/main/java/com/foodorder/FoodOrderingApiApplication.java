package com.foodorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.foodorder.config.AppPaymentProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppPaymentProperties.class)
public class FoodOrderingApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodOrderingApiApplication.class, args);
	}

}
