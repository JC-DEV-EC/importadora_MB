package com.importadora.mb.web;

import java.math.BigDecimal;

public record CalendarioEvento(
    String title,
    String date,
    String tipo,
    String clienteNombre,
    Long clienteId,
    BigDecimal monto
) {}
