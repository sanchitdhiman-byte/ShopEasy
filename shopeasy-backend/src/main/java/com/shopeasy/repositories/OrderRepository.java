package com.shopeasy.repositories;

import com.shopeasy.enums.OrderStatus;
import com.shopeasy.models.Order;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    List<Order> findByUser(User user);
    
    @Query(value = "SELECT SUM(amount) FROM orders", nativeQuery = true)
    Double sumTotalSales();
    
    long countByOrderStatus(OrderStatus orderStatus);
}
