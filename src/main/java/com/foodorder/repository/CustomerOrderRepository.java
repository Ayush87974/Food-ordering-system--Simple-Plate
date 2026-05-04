package com.foodorder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foodorder.model.CustomerOrder;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

	List<CustomerOrder> findByCustomerUser_IdOrderByCreatedAtDesc(Long customerUserId);

	Optional<CustomerOrder> findByIdAndCustomerUser_Id(Long id, Long customerUserId);

	List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
