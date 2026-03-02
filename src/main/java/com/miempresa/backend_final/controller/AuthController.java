package com.miempresa.backend_final.controller;

import com.miempresa.backend_final.dto.*;
import com.miempresa.backend_final.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // RF1 - Registro
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            Locale locale) {
        return authService.register(request, locale);
    }

    // RF2 - Login
    @PostMapping("/login")
    public Mono<AuthResponse> login(
            @Valid @RequestBody AuthRequest request,
            Locale locale) {
        return authService.login(request, locale);
    }

    // RF3 - Solicitar recuperacion de contrasena
    @PostMapping("/password-reset/request")
    public Mono<Map<String, String>> requestReset(
            @Valid @RequestBody PasswordResetRequest request,
            Locale locale) {
        return authService.requestPasswordReset(request.email(), locale)
            .map(token -> Map.of(
                "message", "Token de recuperacion generado",
                "resetToken", token
            ));
    }

    // RF3 - Confirmar nueva contrasena
    @PostMapping("/password-reset/confirm")
    public Mono<Map<String, String>> confirmReset(
            @Valid @RequestBody PasswordResetConfirm request,
            Locale locale) {
        return authService.confirmPasswordReset(
                request.token(), request.newPassword(), locale)
            .map(msg -> Map.of("message", msg));
    }
}