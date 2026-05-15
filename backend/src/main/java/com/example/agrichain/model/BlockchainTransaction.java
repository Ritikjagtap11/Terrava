package com.example.agrichain.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_transactions")
@EntityListeners(AuditingEntityListener.class)
public class BlockchainTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_hash", unique = true, nullable = false, length = 66)
    private String transactionHash;

    @Column(name = "transaction_type", length = 50)
    private String transactionType;

    @Column(name = "from_address", length = 42)
    private String fromAddress;

    @Column(name = "to_address", length = 42)
    private String toAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "block_number")
    private Long blockNumber;

    @Column(name = "gas_used")
    private Long gasUsed;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ======================
    // Constructors
    // ======================

    public BlockchainTransaction() {
    }

    public BlockchainTransaction(Long id, String transactionHash,
                                 String transactionType,
                                 String fromAddress, String toAddress,
                                 Product product, Order order,
                                 Long blockNumber, Long gasUsed,
                                 LocalDateTime createdAt) {

        this.id = id;
        this.transactionHash = transactionHash;
        this.transactionType = transactionType;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.product = product;
        this.order = order;
        this.blockNumber = blockNumber;
        this.gasUsed = gasUsed;
        this.createdAt = createdAt;
    }

    // ======================
    // Getters & Setters
    // ======================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        this.fromAddress = fromAddress;
    }

    public String getToAddress() {
        return toAddress;
    }

    public void setToAddress(String toAddress) {
        this.toAddress = toAddress;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Long getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(Long blockNumber) {
        this.blockNumber = blockNumber;
    }

    public Long getGasUsed() {
        return gasUsed;
    }

    public void setGasUsed(Long gasUsed) {
        this.gasUsed = gasUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
