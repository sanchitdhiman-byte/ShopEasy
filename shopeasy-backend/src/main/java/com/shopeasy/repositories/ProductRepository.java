package com.shopeasy.repositories;

import com.shopeasy.models.Category;
import com.shopeasy.models.Product;
import com.shopeasy.models.Seller;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategory(Category category);
    
    List<Product> findBySeller(Seller seller);
    
    List<Product> findByProductNameContainingIgnoreCase(String query);
    
    boolean existsByProductNameAndSellerAndCategory(String productName, Seller seller, Category category);
}
