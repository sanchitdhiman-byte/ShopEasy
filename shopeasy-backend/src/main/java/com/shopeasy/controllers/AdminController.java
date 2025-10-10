package com.shopeasy.controllers;

import com.shopeasy.DTOs.DashboardDTO;
import com.shopeasy.DTOs.OrderItemDTO;
import com.shopeasy.DTOs.PaymentResponseDTO;
import com.shopeasy.DTOs.UserResponseDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    
    private final AdminService adminService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> adminDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @PutMapping("/users/{userId}/role/")
    public ResponseEntity<UserResponseDTO> updateRole(@PathVariable String userId, @RequestBody String role) {
        return ResponseEntity.ok(adminService.updateRole(userId, Role.valueOf(role)));
    }
    
    @DeleteMapping("/users/{userId}/")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
    
    @GetMapping("/orders/")
    public ResponseEntity<List<OrderItemDTO>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }
    
    @GetMapping("/payments/")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(adminService.getAllPayments());
    }
}
