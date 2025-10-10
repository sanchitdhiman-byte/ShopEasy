package com.shopeasy.repositories;

import com.shopeasy.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    
    boolean existsByCategoryName(String categoryName);
    
    Category findByCategoryName(String categoryName);
    
    Category findByCategoryId(String categoryId);
    
    List<Category> findByCategoryNameContainingIgnoreCase(String query);
}
