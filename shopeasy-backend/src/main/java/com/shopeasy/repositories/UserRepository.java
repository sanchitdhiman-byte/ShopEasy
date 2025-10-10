package com.shopeasy.repositories;

import com.shopeasy.enums.Role;
import com.shopeasy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmailAndRole(String email, Role role);
    
    Optional<User> findByPhoneAndRole(String phone, Role role);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);
    
    List<User> findByRole(Role role);
    
    Optional<User> findByUserId(String userId);
    
}
