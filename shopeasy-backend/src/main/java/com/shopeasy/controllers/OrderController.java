package com.shopeasy.controllers;

import com.shopeasy.DTOs.OrderRequestDTO;
import com.shopeasy.DTOs.OrderResponseDTO;
import com.shopeasy.enums.OrderStatus;
import com.shopeasy.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping("/")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<OrderResponseDTO> placeOrder(@Valid @RequestBody OrderRequestDTO dto, Authentication authentication) {
        String userId = authentication.getName();
        return new ResponseEntity<>(orderService.placeOrder(dto, userId), HttpStatus.CREATED);
    }
    
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }
    
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
    
    @PutMapping("{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, OrderStatus.valueOf(status)));
    }
    
    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUYER')")
    public ResponseEntity<String> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Order with ID: " + orderId + " has been cancelled.");
    }
    
}
