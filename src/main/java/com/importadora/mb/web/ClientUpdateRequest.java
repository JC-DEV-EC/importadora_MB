package com.importadora.mb.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ClientUpdateRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        String city,
        LocalDate registrationDate,
        Boolean discount
) {
}
