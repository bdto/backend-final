package com.miempresa.backend_final.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class DemoController {

    // Tarea 1 - Ruta publica (acceso libre)
    @GetMapping("/public")
    public Mono<Map<String, String>> publicEndpoint() {
        return Mono.just(Map.of(
            "message", "Endpoint publico - accesible sin autenticacion",
            "role", "NONE"
        ));
    }

    // Tarea 1 - Ruta /user (USER y ADMIN)
    @GetMapping("/user")
    public Mono<Map<String, String>> userEndpoint() {
        return Mono.just(Map.of(
            "message", "Bienvenido, tienes rol USER o ADMIN",
            "role", "ROLE_USER"
        ));
    }

    // Tarea 1 - Ruta /admin (solo ADMIN)
    @GetMapping("/admin")
    public Mono<Map<String, String>> adminEndpoint() {
        return Mono.just(Map.of(
            "message", "Bienvenido administrador",
            "role", "ROLE_ADMIN"
        ));
    }
}