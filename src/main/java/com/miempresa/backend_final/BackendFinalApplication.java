package com.miempresa.backend_final;

import com.miempresa.backend_final.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class BackendFinalApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendFinalApplication.class, args);
    }
}