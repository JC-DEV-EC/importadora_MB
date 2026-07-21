package com.importadora.mb.web;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ClientPaymentRequest(
        @NotNull BigDecimal amount,
        String description,
        String reference
) {
}
