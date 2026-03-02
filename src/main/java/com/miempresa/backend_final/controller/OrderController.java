package com.miempresa.backend_final.controller;

import com.miempresa.backend_final.entity.Order;
import com.miempresa.backend_final.entity.OrderTracking;
import com.miempresa.backend_final.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Locale;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // RF7 - Crear pedido
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Order> create(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // RF8 - Pedidos por usuario
    @GetMapping("/user/{userId}")
    public Flux<Order> getByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    // RF10 - Ver estado del pedido
    @GetMapping("/{id}")
    public Mono<Order> getById(@PathVariable Long id, Locale locale) {
        return orderService.getOrderById(id, locale);
    }

    // RF9 - Confirmar pedido
    @PatchMapping("/{id}/confirm")
    public Mono<Order> confirmOrder(@PathVariable Long id, Locale locale) {
        return orderService.confirmOrder(id, locale);
    }

    // Actualizar estado generico
    @PatchMapping("/{id}/status")
    public Mono<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Locale locale) {
        return orderService.updateOrderStatus(id, status, locale);
    }

    // Historial de tracking
    @GetMapping("/{id}/tracking")
    public Flux<OrderTracking> getTracking(@PathVariable Long id) {
        return orderService.getTrackingHistory(id);
    }
}