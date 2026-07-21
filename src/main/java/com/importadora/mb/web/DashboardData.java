package com.importadora.mb.web;

import java.math.BigDecimal;

public record DashboardData(
    long totalClientes,
    long clientesActivos,
    BigDecimal deudaTotal,
    BigDecimal cobradoTotal,
    BigDecimal pendienteTotal,
    BigDecimal cobradoEsteMes,
    BigDecimal cargosEsteMes
) {}
