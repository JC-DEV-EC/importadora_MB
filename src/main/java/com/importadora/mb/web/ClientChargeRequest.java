package com.importadora.mb.web;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ClientChargeRequest(
        @NotNull BigDecimal amount,
        String description
) {
}
