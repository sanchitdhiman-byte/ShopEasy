package com.shopeasy.repositories;

import com.shopeasy.models.Seller;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, String> {
    Optional<Seller> findByUser(User user);
}
