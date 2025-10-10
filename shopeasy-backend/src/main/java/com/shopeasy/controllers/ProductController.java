package com.shopeasy.controllers;

import com.shopeasy.DTOs.ProductRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.DTOs.ReviewRequestDTO;
import com.shopeasy.DTOs.ReviewResponseDTO;
import com.shopeasy.models.CustomUserDetails;
import com.shopeasy.models.User;
import com.shopeasy.repositories.UserRepository;
import com.shopeasy.security.JwtUtil;
import com.shopeasy.service.ProductService;
import com.shopeasy.service.ReviewService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'BUYER')")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable String productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }
    
    @DeleteMapping("/{productId}/")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product has been deleted.");
    }
    
    @PostMapping("/{productId}/reviews/")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ReviewResponseDTO> addReview(@PathVariable String productId, @RequestBody ReviewRequestDTO dto, Authentication authentication) {
        String userId = authentication.getName();
        return new ResponseEntity<>(reviewService.addReview(productId, dto, userId), HttpStatus.CREATED);
    }
    
    @GetMapping("/{productId}/reviews/")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getAllReviews(productId));
    }

}
