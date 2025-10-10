package com.shopeasy.repositories;

import com.shopeasy.models.ShoppingCart;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    
    ShoppingCart findByUser(User user);
}
