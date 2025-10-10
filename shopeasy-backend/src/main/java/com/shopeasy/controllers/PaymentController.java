package com.shopeasy.controllers;

import com.shopeasy.DTOs.PaymentRequestDTO;
import com.shopeasy.DTOs.PaymentResponseDTO;
import com.shopeasy.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<PaymentResponseDTO> createPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        return new ResponseEntity<>(paymentService.initiatePayment(dto), HttpStatus.CREATED);
    }
    
    @PostMapping("/verify")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        return ResponseEntity.ok(paymentService.verifyPayment(dto));
    }
    
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUYER')")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(@PathVariable String paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentDetails(paymentId));
    }
    
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String userId
    ) {
        return ResponseEntity.ok(paymentService.getAllPayments(status, orderId, userId));
    }
    
    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<PaymentResponseDTO> refundPayment(@PathVariable String paymentId, @RequestBody String reason) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId, reason));
    }
    
}
