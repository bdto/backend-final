package com.miempresa.backend_final.service;

import com.miempresa.backend_final.entity.Category;
import com.miempresa.backend_final.entity.Product;
import com.miempresa.backend_final.repository.CategoryRepository;
import com.miempresa.backend_final.repository.ProductRepository;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Locale;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MessageSource messageSource;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          MessageSource messageSource) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.messageSource = messageSource;
    }

    // RF4 - Productos por categoria
    public Flux<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // RF4 - Listar categorias
    public Flux<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // RF5 - Detalle de producto
    public Mono<Product> getProductById(Long id, Locale locale) {
        return productRepository.findById(id)
            .switchIfEmpty(Mono.error(new IllegalArgumentException(
                messageSource.getMessage("error.product.not.found", null, locale)
            )));
    }

    // RF6 - Busqueda por nombre
    public Flux<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Crear producto (admin)
    public Mono<Product> createProduct(Product product) {
        product.setActive(true);
        return productRepository.save(product);
    }

    // Listar activos
    public Flux<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrue();
    }
}