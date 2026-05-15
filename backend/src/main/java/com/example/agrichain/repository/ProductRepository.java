package com.example.agrichain.repository;

import com.example.agrichain.model.Product;
import com.example.agrichain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmer(User farmer);
    List<Product> findByCategory(String category);
    List<Product> findByIsVerified(Boolean isVerified);
    Optional<Product> findByBlockchainHash(String blockchainHash);
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();
    
    @Query("SELECT p FROM Product p WHERE p.quantity > 0 AND p.isVerified = true")
    List<Product> findAvailableProducts();
}