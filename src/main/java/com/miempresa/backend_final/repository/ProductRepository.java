package com.miempresa.backend_final.repository;

import com.miempresa.backend_final.entity.Product;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {
    Flux<Product> findByCategoryId(Long categoryId);
    Flux<Product> findByNameContainingIgnoreCase(String name);
    Flux<Product> findByActiveTrue();
}