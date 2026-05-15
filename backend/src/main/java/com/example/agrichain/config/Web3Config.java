package com.example.agrichain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

@Configuration
public class Web3Config {
    
    @Value("${ethereum.node.url}")
    private String nodeUrl;
    
    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(nodeUrl));
    }
    
    @Bean
    public DefaultGasProvider gasProvider() {
        return new DefaultGasProvider();
    }
}