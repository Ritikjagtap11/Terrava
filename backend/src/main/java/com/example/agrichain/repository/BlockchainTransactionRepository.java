package com.example.agrichain.repository;

import com.example.agrichain.model.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, Long> {
    Optional<BlockchainTransaction> findByTransactionHash(String transactionHash);
}