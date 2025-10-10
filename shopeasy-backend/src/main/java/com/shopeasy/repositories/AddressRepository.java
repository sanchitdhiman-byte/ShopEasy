package com.shopeasy.repositories;

import com.shopeasy.models.Address;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    
    List<Address> findByUser(User user);
}
