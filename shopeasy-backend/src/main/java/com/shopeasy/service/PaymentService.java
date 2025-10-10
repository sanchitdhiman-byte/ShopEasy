package com.shopeasy.service;

import com.shopeasy.DTOs.PaymentRequestDTO;
import com.shopeasy.DTOs.PaymentResponseDTO;
import com.shopeasy.enums.PaymentStatus;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Order;
import com.shopeasy.models.Payment;
import com.shopeasy.repositories.OrderRepository;
import com.shopeasy.repositories.PaymentRepository;
import com.shopeasy.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    
    public PaymentResponseDTO initiatePayment(PaymentRequestDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new DataNotFoundException("Order not found."));
        
        Payment payment = Payment.builder()
                .order(order)
                .amount(dto.getAmount())
                .paymentStatus(PaymentStatus.PENDING)
                .paymentMethod(dto.getPaymentMethod())
                .build();
        
        Payment saved = paymentRepository.save(payment);
        return modelMapper.map(saved, PaymentResponseDTO.class);
    }
    
    public PaymentResponseDTO verifyPayment(@Valid PaymentRequestDTO dto) {
        return null;
    }
    
    public PaymentResponseDTO getPaymentDetails(String paymentId) {
        return null;
    }
    
    public PaymentResponseDTO refundPayment(String paymentId, String reason) {
        return null;
    }
    
    public List<PaymentResponseDTO> getAllPayments(String status, String orderId, String userId) {
        return null;
    }
}
