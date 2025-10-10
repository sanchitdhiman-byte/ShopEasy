package com.shopeasy.service;

import com.shopeasy.DTOs.ShoppingCartItemResponseDTO;
import com.shopeasy.DTOs.ShoppingCartRequestDTO;
import com.shopeasy.DTOs.ShoppingCartResponseDTO;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Product;
import com.shopeasy.models.ShoppingCart;
import com.shopeasy.models.ShoppingCartItem;
import com.shopeasy.models.User;
import com.shopeasy.repositories.ProductRepository;
import com.shopeasy.repositories.ShoppingCartItemRepository;
import com.shopeasy.repositories.ShoppingCartRepository;
import com.shopeasy.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {
    
    private final ProductRepository productRepository;
    private final ShoppingCartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    
    public ShoppingCartResponseDTO addProduct(@Valid ShoppingCartRequestDTO dto, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found."));
        
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new DataNotFoundException("Product not found."));
        
        if (dto.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }
        
        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user);
        
        ShoppingCartItem item = cartItemRepository.findByShoppingCartAndProduct(shoppingCart, product)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + dto.getQuantity());
                    return existing;
                })
                .orElse(ShoppingCartItem.builder()
                        .shoppingCart(shoppingCart)
                        .product(product)
                        .quantity(dto.getQuantity())
                        .build());
        
        cartItemRepository.save(item);
        
        return buildCartResponse(user);
    }
    
    public List<ShoppingCartItemResponseDTO> getCartItems(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found."));
        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user);
        return cartItemRepository.findByShoppingCart(shoppingCart).stream()
                .map(this::mapToItemDTO)
                .toList();
    }
    
    public ShoppingCartItemResponseDTO updateCartItem(String itemId, @Valid ShoppingCartRequestDTO dto) {
        
        ShoppingCartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found."));
        
        item.setQuantity(dto.getQuantity());
        cartItemRepository.save(item);
        
        return mapToItemDTO(item);
    }
    
    public void removeCartItem(String itemId) {
        
        ShoppingCartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found."));
        
        cartItemRepository.delete(item);
    }
    
    public void clearCartItems(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found."));
        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user);
        cartItemRepository.deleteAllByShoppingCart(shoppingCart);
    }
    
    private ShoppingCartResponseDTO buildCartResponse(User user) {
        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user);
        List<ShoppingCartItemResponseDTO> items = cartItemRepository.findByShoppingCart(shoppingCart).stream()
                .map(this::mapToItemDTO)
                .toList();
        
        double total = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        
        return ShoppingCartResponseDTO.builder()
                .userId(user.getUserId())
                .cartItems(items)
                .cartTotal(total)
                .build();
    }
    
   private ShoppingCartItemResponseDTO mapToItemDTO(ShoppingCartItem item) {
       return ShoppingCartItemResponseDTO.builder()
               .cartItemId(item.getItemId())
               .productId(item.getProduct().getProductId())
               .productName(item.getProduct().getProductName())
               .quantity(item.getQuantity())
               .price(item.getProduct().getPrice())
               .build();
   }
    
    public void mergeGuestCartWithUserCart(String userId, List<ShoppingCartRequestDTO> guestItems) {
        User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found."));
        ShoppingCart userCart = shoppingCartRepository.findByUser(user);
        if (userCart == null) {
            userCart = ShoppingCart.builder()
                    .user(user)
                    .cartItems(new ArrayList<>())
                    .build();
            shoppingCartRepository.save(userCart);
        }
        
        for (ShoppingCartRequestDTO guestItem : guestItems) {
            Optional<ShoppingCartItem> existing = userCart.getCartItems().stream()
                    .filter(ci -> ci.getProduct().getProductId().equals(guestItem.getProductId()))
                    .findFirst();
            
            if (existing.isPresent()) {
                ShoppingCartItem updated = existing.get();
                updated.setQuantity(updated.getQuantity() + guestItem.getQuantity());
                cartItemRepository.save(updated);
            } else {
                Product product = productRepository.findById(guestItem.getProductId())
                        .orElseThrow(() -> new DataNotFoundException("Product not found."));
                ShoppingCartItem cartItem = cartItemRepository.findByShoppingCartAndProduct(userCart, product)
                        .map(item -> {
                            item.setQuantity(item.getQuantity() + guestItem.getQuantity());
                            return item;
                        })
                        .orElse(ShoppingCartItem.builder()
                                .shoppingCart(userCart)
                                .product(product)
                                .quantity(guestItem.getQuantity())
                                .build());
                cartItemRepository.save(cartItem);
            }
        }
    }
    
}
