package com.shopeasy.service;

import com.shopeasy.DTOs.OrderRequestDTO;
import com.shopeasy.DTOs.OrderResponseDTO;
import com.shopeasy.enums.OrderStatus;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Order;
import com.shopeasy.models.User;
import com.shopeasy.repositories.OrderRepository;
import com.shopeasy.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    
    public OrderResponseDTO placeOrder(OrderRequestDTO dto, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        Order order = modelMapper.map(dto, Order.class);
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        
        Order saved = orderRepository.save(order);
        return modelMapper.map(saved, OrderResponseDTO.class);
    }
    
    public List<OrderResponseDTO> getMyOrders(String userId) {
        List<Order> orders = orderRepository.findByUser(
                userRepository.findById(userId)
                        .orElseThrow(() -> new DataNotFoundException("User not found."))
        );
        
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    public OrderResponseDTO getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Order not found."));
        
        return modelMapper.map(order, OrderResponseDTO.class);
    }
    
    public OrderResponseDTO updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Order not found."));
        
        order.setOrderStatus(newStatus);
        Order updated = orderRepository.save(order);
        
        return modelMapper.map(updated, OrderResponseDTO.class);
    }
    
    public void cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Order not found."));
        
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Only pending orders can be cancelled.");
        }
        
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
