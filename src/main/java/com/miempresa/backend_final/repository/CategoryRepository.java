package com.miempresa.backend_final.repository;

import com.miempresa.backend_final.entity.Category;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface CategoryRepository extends ReactiveCrudRepository<Category, Long> {
    Mono<Category> findByName(String name);
}