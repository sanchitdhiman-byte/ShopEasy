package com.shopeasy.repositories;

import aj.org.objectweb.asm.commons.Remapper;
import com.shopeasy.models.Product;
import com.shopeasy.models.ShoppingCart;
import com.shopeasy.models.ShoppingCartItem;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, String> {
    
    Optional<ShoppingCartItem> findByShoppingCartAndProduct(ShoppingCart shoppingCart, Product product);
    
    List<ShoppingCartItem> findByShoppingCart(ShoppingCart shoppingCart);
    
    void deleteAllByShoppingCart(ShoppingCart shoppingCart);
}
