package com.importadora.mb.web;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String email,
        @NotBlank String password,
        @NotBlank String nombre
) {}
