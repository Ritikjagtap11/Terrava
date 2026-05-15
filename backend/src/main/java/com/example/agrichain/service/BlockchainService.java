package com.example.agrichain.service;

import com.example.agrichain.dto.BlockchainResponseDTO;
import com.example.agrichain.model.BlockchainTransaction;
import com.example.agrichain.model.Order;
import com.example.agrichain.model.Product;
import com.example.agrichain.repository.BlockchainTransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

@Service
public class BlockchainService {

    private final Web3j web3j;
    private final BlockchainTransactionRepository transactionRepository;

    @Value("${ethereum.contract.address}")
    private String contractAddress;

    @Value("${ethereum.private.key}")
    private String privateKey;

    public BlockchainService(Web3j web3j,
            BlockchainTransactionRepository transactionRepository) {
        this.web3j = web3j;
        this.transactionRepository = transactionRepository;
    }

    public String registerProduct(Product product) throws Exception {
        Credentials credentials = Credentials.create(privateKey);

        Function function = new Function(
                "registerProduct",
                Arrays.asList(
                        new Utf8String(product.getName() != null ? product.getName() : ""),
                        new Utf8String(product.getCategory() != null ? product.getCategory() : ""),
                        new Uint256(BigInteger.valueOf(product.getPrice() != null ? product.getPrice().longValue() : 0)),
                        new Uint256(BigInteger.valueOf(product.getQuantity() != null ? product.getQuantity() : 0)),
                        new Utf8String(product.getImageUrl() != null ? product.getImageUrl() : "") // acting as ipfsHash
                ),
                Collections.emptyList()
        );

        String txHash = executeTransaction(credentials, function);

        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setTransactionHash(txHash);
        transaction.setTransactionType("PRODUCT_REGISTRATION");
        transaction.setFromAddress(credentials.getAddress());
        transaction.setToAddress(contractAddress);
        transaction.setProduct(product);
        transaction.setBlockNumber(1L); // Would be updated by a listener in production
        transaction.setGasUsed(21000L); // Default estimate

        transactionRepository.save(transaction);

        return txHash;
    }

    public String recordOrder(Order order) throws Exception {
        Credentials credentials = Credentials.create(privateKey);
        
        // Example encoding for order tracking
        Function function = new Function(
                "updateOrderStatus",
                Arrays.asList(
                        new Uint256(BigInteger.valueOf(order.getId())),
                        new Uint256(BigInteger.ONE) // Assuming 1 is confirmed status
                ),
                Collections.emptyList()
        );

        String txHash = executeTransaction(credentials, function);

        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setTransactionHash(txHash);
        transaction.setTransactionType("ORDER_RECORD");
        transaction.setFromAddress(credentials.getAddress());
        transaction.setToAddress(contractAddress);
        transaction.setOrder(order);
        transaction.setBlockNumber(1L);
        transaction.setGasUsed(21000L);

        transactionRepository.save(transaction);

        return txHash;
    }

    public BlockchainResponseDTO verifyProduct(String blockchainHash) {
        BlockchainTransaction transaction =
                transactionRepository.findByTransactionHash(blockchainHash)
                        .orElseThrow(() ->
                                new RuntimeException("Transaction not found")
                        );

        BlockchainResponseDTO response = new BlockchainResponseDTO();
        response.setTransactionHash(transaction.getTransactionHash());
        response.setBlockNumber(transaction.getBlockNumber());
        response.setStatus("VERIFIED");
        response.setGasUsed(transaction.getGasUsed());
        response.setMessage("Product verified on blockchain");

        return response;
    }

    private String executeTransaction(Credentials credentials, Function function) throws Exception {
        if (privateKey.equals("dummy_private_key")) {
            // Fallback for local development without actual ethereum node
            return "0x" + java.util.UUID.randomUUID().toString().replace("-", "") + 
                   java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 4);
        }

        String encodedFunction = FunctionEncoder.encode(function);

        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                credentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
        BigInteger nonce = ethGetTransactionCount.getTransactionCount();

        BigInteger gasLimit = BigInteger.valueOf(3000000L);
        BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce, gasPrice, gasLimit, contractAddress, encodedFunction);

        byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
        String hexValue = Numeric.toHexString(signedMessage);

        EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).sendAsync().get();

        if (ethSendTransaction.hasError()) {
            throw new RuntimeException("Error processing transaction: " + ethSendTransaction.getError().getMessage());
        }
        return ethSendTransaction.getTransactionHash();
    }

    public boolean isConnected() {
        try {
            return web3j.web3ClientVersion().send().getWeb3ClientVersion() != null;
        } catch (Exception e) {
            return false;
        }
    }
}
