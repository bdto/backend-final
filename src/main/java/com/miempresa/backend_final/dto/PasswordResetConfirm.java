package com.miempresa.backend_final.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetConfirm(
    @NotBlank String token,
    @NotBlank @Size(min = 8) String newPassword
) {}