package com.miempresa.backend_final.repository;

import com.miempresa.backend_final.entity.OrderTracking;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface OrderTrackingRepository extends ReactiveCrudRepository<OrderTracking, Long> {
    Flux<OrderTracking> findByOrderIdOrderByTrackedAtDesc(Long orderId);
}