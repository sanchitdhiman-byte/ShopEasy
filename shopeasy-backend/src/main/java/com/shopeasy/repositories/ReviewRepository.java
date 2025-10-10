package com.shopeasy.repositories;

import com.shopeasy.models.Product;
import com.shopeasy.models.Review;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    
    Optional<Review> findByProductAndUser(Product product, User user);
    
    List<Review> findByProduct(Product product);
    
    List<Review> findByUser(User user);
}
