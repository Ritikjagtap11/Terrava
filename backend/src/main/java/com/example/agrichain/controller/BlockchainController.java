package com.example.agrichain.controller;

import com.example.agrichain.dto.BlockchainResponseDTO;
import com.example.agrichain.service.BlockchainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    private final BlockchainService blockchainService;

    // ✅ Manual constructor injection
    public BlockchainController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    @GetMapping("/verify/{hash}")
    public ResponseEntity<BlockchainResponseDTO> verifyProduct(@PathVariable String hash) {
        return ResponseEntity.ok(blockchainService.verifyProduct(hash));
    }

    @GetMapping("/status")
    public ResponseEntity<String> getBlockchainStatus() {
        boolean connected = blockchainService.isConnected();
        return ResponseEntity.ok(connected ? "Connected" : "Disconnected");
    }
}
