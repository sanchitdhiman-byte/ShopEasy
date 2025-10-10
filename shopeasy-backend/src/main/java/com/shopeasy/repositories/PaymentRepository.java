package com.shopeasy.repositories;

import com.shopeasy.enums.PaymentStatus;
import com.shopeasy.models.Order;
import com.shopeasy.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
    
    List<Payment> findByOrder(Order order);
}
