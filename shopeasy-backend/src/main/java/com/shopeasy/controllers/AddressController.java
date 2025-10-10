package com.shopeasy.controllers;

import com.shopeasy.DTOs.AddressRequestDTO;
import com.shopeasy.DTOs.AddressResponseDTO;
import com.shopeasy.security.JwtUtil;
import com.shopeasy.service.AddressService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/me/addresses")
@RequiredArgsConstructor
public class AddressController {
    
    private final AddressService addressService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/")
    public ResponseEntity<AddressResponseDTO> createAddress(@RequestBody AddressRequestDTO dto, Authentication authentication) {
        String userId = authentication.getName();
        return new ResponseEntity<>(addressService.createAddress(dto, userId), HttpStatus.CREATED);
    }
    
    @GetMapping("/")
    public ResponseEntity<List<AddressResponseDTO>> getAllAddress(@RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.extractClaim(authHeader.substring(7), Claims::getSubject);
        
        return ResponseEntity.ok(addressService.getAllAddresses(userId));
    }
    
    @GetMapping("{addressId}/")
    public ResponseEntity<AddressResponseDTO> getAddressById(@PathVariable String addressId, Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(addressService.getAddressById(addressId, userId));
    }
    
    @PutMapping("{addressId}/")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<AddressResponseDTO> updateAddress(@PathVariable String addressId, @RequestBody AddressRequestDTO dto) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, dto));
    }
    
    @DeleteMapping("{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable String addressId, Authentication authentication) {
        String userId = authentication.getName();
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.ok("Address deleted successfully");
    }
    
}
