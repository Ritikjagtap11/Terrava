package com.example.agrichain.dto;

public class BlockchainResponseDTO {

    private String transactionHash;
    private Long blockNumber;
    private String status;
    private Long gasUsed;
    private String message;

    // ======================
    // Constructors
    // ======================

    public BlockchainResponseDTO() {
    }

    public BlockchainResponseDTO(String transactionHash,
                                 Long blockNumber,
                                 String status,
                                 Long gasUsed,
                                 String message) {
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.status = status;
        this.gasUsed = gasUsed;
        this.message = message;
    }

    // ======================
    // Getters & Setters
    // ======================

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public Long getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(Long blockNumber) {
        this.blockNumber = blockNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getGasUsed() {
        return gasUsed;
    }

    public void setGasUsed(Long gasUsed) {
        this.gasUsed = gasUsed;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
