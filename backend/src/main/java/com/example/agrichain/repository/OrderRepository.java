package com.example.agrichain.repository;

import com.example.agrichain.model.Order;
import com.example.agrichain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(User customer);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(Order.OrderStatus status);
    Optional<Order> findByTransactionHash(String transactionHash);
}