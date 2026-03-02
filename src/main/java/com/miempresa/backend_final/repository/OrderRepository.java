package com.miempresa.backend_final.repository;

import com.miempresa.backend_final.entity.Order;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface OrderRepository extends ReactiveCrudRepository<Order, Long> {
    Flux<Order> findByUserId(Long userId);
    Flux<Order> findByStatus(String status);
}