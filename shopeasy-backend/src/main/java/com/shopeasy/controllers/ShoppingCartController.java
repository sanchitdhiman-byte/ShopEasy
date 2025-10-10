package com.shopeasy.controllers;

import com.shopeasy.DTOs.ShoppingCartItemResponseDTO;
import com.shopeasy.DTOs.ShoppingCartRequestDTO;
import com.shopeasy.DTOs.ShoppingCartResponseDTO;
import com.shopeasy.security.JwtUtil;
import com.shopeasy.service.ShoppingCartService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('BUYER')")
public class ShoppingCartController {
    
    private final ShoppingCartService shoppingCartService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/add")
    public ResponseEntity<ShoppingCartResponseDTO> addProduct(@Valid @RequestBody ShoppingCartRequestDTO dto, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String userId = jwtUtil.extractClaim(token, Claims::getSubject);
        
        return new ResponseEntity<>(shoppingCartService.addProduct(dto, userId), HttpStatus.CREATED);
    }
    
    @GetMapping("/")
    public ResponseEntity<List<ShoppingCartItemResponseDTO>> getCartItems(@RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.extractClaim(authHeader.substring(7), Claims::getSubject);
        System.out.println(userId);
        return ResponseEntity.ok(shoppingCartService.getCartItems(userId));
    }
    
    @PutMapping("/update/{itemId}")
    public ResponseEntity<ShoppingCartItemResponseDTO> updateCartItem(@PathVariable String itemId, @Valid @RequestBody ShoppingCartRequestDTO dto) {
        return ResponseEntity.ok(shoppingCartService.updateCartItem(itemId, dto));
    }
    
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable String itemId) {
        shoppingCartService.removeCartItem(itemId);
        return ResponseEntity.ok("Item removed from cart successfully");
    }
    
    @DeleteMapping("/clear/")
    public ResponseEntity<String> clearCartItems(Authentication authentication) {
        String userId = authentication.getName();
        shoppingCartService.clearCartItems(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
    
    @PostMapping("/cart/merge")
    public ResponseEntity<?> mergeCart(@RequestBody List<ShoppingCartRequestDTO> guestItems, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String userId = jwtUtil.extractClaim(token, Claims::getSubject);
        shoppingCartService.mergeGuestCartWithUserCart(userId, guestItems);
        return ResponseEntity.ok().build();
    }
}
