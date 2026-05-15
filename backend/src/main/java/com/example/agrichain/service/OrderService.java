package com.example.agrichain.service;

import com.example.agrichain.dto.OrderDTO;
import com.example.agrichain.exception.ResourceNotFoundException;
import com.example.agrichain.model.Order;
import com.example.agrichain.model.OrderItem;
import com.example.agrichain.model.Product;
import com.example.agrichain.model.User;
import com.example.agrichain.repository.OrderRepository;
import com.example.agrichain.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final BlockchainService blockchainService;

    // ✅ Manual constructor injection (No Lombok)
    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserService userService,
                        BlockchainService blockchainService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userService = userService;
        this.blockchainService = blockchainService;
    }

    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {

        User customer = userService.getCurrentUser();

        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingAddress(orderDTO.getShippingAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;

        // ✅ Add order items safely
        for (OrderDTO.OrderItemDTO itemDTO : orderDTO.getItems()) {

            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Product not found with id: "
                                    + itemDTO.getProductId())
                    );

            if (product.getQuantity() == null ||
                    product.getQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient quantity for product: " + product.getName()
                );
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());

            order.addOrderItem(orderItem);

            // ✅ Update product quantity
            product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
            productRepository.save(product);

            // ✅ Calculate total
            if (product.getPrice() != null) {
                totalAmount = totalAmount.add(
                        product.getPrice().multiply(
                                BigDecimal.valueOf(itemDTO.getQuantity())
                        )
                );
            }
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // ✅ Record on blockchain safely
        try {
            String txHash = blockchainService.recordOrder(savedOrder);
            savedOrder.setTransactionHash(txHash);
            savedOrder = orderRepository.save(savedOrder);
        } catch (Exception e) {
            System.err.println("Blockchain recording failed: " + e.getMessage());
        }

        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getCustomerOrders() {

        User customer = userService.getCurrentUser();

        return orderRepository.findByCustomer(customer)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found with id: " + id)
                );

        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found")
                );

        try {
            order.setStatus(
                    Order.OrderStatus.valueOf(status.toUpperCase())
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }

        Order updatedOrder = orderRepository.save(order);

        return convertToDTO(updatedOrder);
    }

    private String generateOrderNumber() {

        return "ORD-" +
                LocalDateTime.now().getYear() +
                "-" +
                UUID.randomUUID().toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    // ✅ Convert entity to DTO safely
    private OrderDTO convertToDTO(Order order) {

        OrderDTO dto = new OrderDTO();

        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());

        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
            dto.setCustomerName(order.getCustomer().getFullName());
        }

        dto.setTotalAmount(order.getTotalAmount());

        if (order.getStatus() != null) {
            dto.setStatus(order.getStatus().name());
        }

        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTransactionHash(order.getTransactionHash());
        dto.setShippingAddress(order.getShippingAddress());

        if (order.getOrderItems() != null) {
            dto.setItems(
                    order.getOrderItems().stream().map(item -> {

                        OrderDTO.OrderItemDTO itemDTO =
                                new OrderDTO.OrderItemDTO();

                        if (item.getProduct() != null) {
                            itemDTO.setProductId(item.getProduct().getId());
                            itemDTO.setProductName(item.getProduct().getName());
                        }

                        itemDTO.setQuantity(item.getQuantity());
                        itemDTO.setPrice(item.getPrice());

                        return itemDTO;

                    }).collect(Collectors.toList())
            );
        }

        return dto;
    }
}
