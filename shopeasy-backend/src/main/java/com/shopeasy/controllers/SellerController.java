package com.shopeasy.controllers;

import com.shopeasy.DTOs.DashboardStatsDTO;
import com.shopeasy.DTOs.OrderResponseDTO;
import com.shopeasy.DTOs.ProductRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.models.User;
import com.shopeasy.repositories.UserRepository;
import com.shopeasy.security.JwtUtil;
import com.shopeasy.service.SellerService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SELLER')")
public class SellerController {
    
    private final SellerService sellerService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    
    @GetMapping("/{sellerId}/products")
    public ResponseEntity<List<ProductResponseDTO>> getProductsBySellerId(@PathVariable String sellerId) {
        return ResponseEntity.ok(sellerService.getProductsBySellerId(sellerId));
    }
    
    @PostMapping("/product/add")
    public ResponseEntity<ProductResponseDTO> addProduct(
            @RequestPart("product") @Valid ProductRequestDTO dto,
            @RequestPart("images") List<MultipartFile> images,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos,
            HttpServletRequest request
    ) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        String userId = jwtUtil.extractClaim(token, Claims::getSubject);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new ResponseEntity<>(sellerService.addProduct(dto, user, images, videos), HttpStatus.CREATED);
    }
    
    @PutMapping("/{productId}/update")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable String productId, @Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(sellerService.updateProduct(productId, dto));
    }
    
    @GetMapping("/me/orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(HttpServletRequest request) {
        String userId = jwtUtil.extractClaim(request.getHeader("Authorization").substring(7), Claims::getSubject);
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(sellerService.getOrdersBySellerId(user));
    }
    
    @GetMapping("/dashboard")
    public DashboardStatsDTO getDashboardStats(@RequestHeader("Authorization") String header) {
        String userId = jwtUtil.extractClaim(header.substring(7), Claims::getSubject);
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return sellerService.getDashboardStats(user);
    }
}
