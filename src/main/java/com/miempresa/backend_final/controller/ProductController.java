package com.miempresa.backend_final.controller;

import com.miempresa.backend_final.entity.Category;
import com.miempresa.backend_final.entity.Product;
import com.miempresa.backend_final.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Locale;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // RF4 - Productos por categoria
    @GetMapping("/category/{categoryId}")
    public Flux<Product> getByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    // RF4 - Listar categorias
    @GetMapping("/categories")
    public Flux<Category> getCategories() {
        return productService.getAllCategories();
    }

    // RF5 - Detalle de producto
    @GetMapping("/{id}")
    public Mono<Product> getById(@PathVariable Long id, Locale locale) {
        return productService.getProductById(id, locale);
    }

    // RF6 - Busqueda por nombre
    @GetMapping("/search")
    public Flux<Product> search(@RequestParam String name) {
        return productService.searchByName(name);
    }

    // Crear producto (solo ADMIN)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Product> create(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Listar todos los activos
    @GetMapping
    public Flux<Product> getAll() {
        return productService.getAllActiveProducts();
    }
}