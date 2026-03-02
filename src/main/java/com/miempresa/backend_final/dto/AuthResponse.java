package com.miempresa.backend_final.dto;

public record AuthResponse(
    String token,
    String username,
    String role
) {}