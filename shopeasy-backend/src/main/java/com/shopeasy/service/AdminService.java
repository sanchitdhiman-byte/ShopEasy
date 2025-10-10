package com.shopeasy.service;

import com.shopeasy.DTOs.DashboardDTO;
import com.shopeasy.DTOs.OrderItemDTO;
import com.shopeasy.DTOs.PaymentResponseDTO;
import com.shopeasy.DTOs.UserResponseDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Order;
import com.shopeasy.models.Payment;
import com.shopeasy.models.User;
import com.shopeasy.repositories.OrderRepository;
import com.shopeasy.repositories.PaymentRepository;
import com.shopeasy.repositories.SellerRepository;
import com.shopeasy.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SellerRepository sellerRepository;
    private final ModelMapper modelMapper;
    
    public DashboardDTO getDashboard() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalSellers = sellerRepository.count();
        
        return DashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalSellers(totalSellers)
                .build();
    }
    
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    public UserResponseDTO updateRole(String userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        user.setRole(newRole);
        User updated = userRepository.save(user);
        
        return modelMapper.map(updated, UserResponseDTO.class);
    }
    
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        userRepository.delete(user);
    }
    
    public List<OrderItemDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderItemDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<PaymentResponseDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .map(payment -> modelMapper.map(payment, PaymentResponseDTO.class))
                .collect(Collectors.toList());
    }
}
