package com.miempresa.backend_final.service;

import com.miempresa.backend_final.entity.Order;
import com.miempresa.backend_final.entity.OrderTracking;
import com.miempresa.backend_final.repository.OrderRepository;
import com.miempresa.backend_final.repository.OrderTrackingRepository;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderTrackingRepository trackingRepository;
    private final MessageSource messageSource;

    public OrderService(OrderRepository orderRepository,
                        OrderTrackingRepository trackingRepository,
                        MessageSource messageSource) {
        this.orderRepository = orderRepository;
        this.trackingRepository = trackingRepository;
        this.messageSource = messageSource;
    }

    // RF7 - Crear pedido
    public Mono<Order> createOrder(Order order) {
        order.setStatus("PENDING");
        return orderRepository.save(order)
            .flatMap(saved -> {
                OrderTracking event = new OrderTracking();
                event.setOrderId(saved.getId());
                event.setStatus("PENDING");
                event.setDescription("Pedido creado");
                event.setTrackedAt(LocalDateTime.now());
                return trackingRepository.save(event).thenReturn(saved);
            });
    }

    // RF8 - Consultar pedidos por usuario
    public Flux<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // RF10 - Ver estado del pedido
    public Mono<Order> getOrderById(Long id, Locale locale) {
        return orderRepository.findById(id)
            .switchIfEmpty(Mono.error(new IllegalArgumentException(
                messageSource.getMessage("error.order.not.found", null, locale)
            )));
    }

    // RF9 - Confirmar pedido
    public Mono<Order> confirmOrder(Long orderId, Locale locale) {
        return updateOrderStatus(orderId, "CONFIRMED", locale);
    }

    // Actualizar estado generico
    public Mono<Order> updateOrderStatus(Long orderId, String newStatus, Locale locale) {
        return orderRepository.findById(orderId)
            .switchIfEmpty(Mono.error(new IllegalArgumentException(
                messageSource.getMessage("error.order.not.found", null, locale)
            )))
            .flatMap(order -> {
                order.setStatus(newStatus);
                return orderRepository.save(order);
            })
            .flatMap(updated -> {
                OrderTracking event = new OrderTracking();
                event.setOrderId(updated.getId());
                event.setStatus(newStatus);
                event.setDescription("Estado actualizado a " + newStatus);
                event.setTrackedAt(LocalDateTime.now());
                return trackingRepository.save(event).thenReturn(updated);
            });
    }

    // Historial de seguimiento
    public Flux<OrderTracking> getTrackingHistory(Long orderId) {
        return trackingRepository.findByOrderIdOrderByTrackedAtDesc(orderId);
    }
}