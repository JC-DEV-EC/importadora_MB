package com.importadora.mb.web;

import com.importadora.mb.domain.MovimientoMb;
import java.math.BigDecimal;

public record MovimientoMbDto(
        Long id,
        Long clienteId,
        String tipo,
        BigDecimal monto,
        String descripcion,
        String fecha,
        BigDecimal saldoResultante
) {
    public static MovimientoMbDto fromEntity(MovimientoMb m) {
        return new MovimientoMbDto(
                m.getId(),
                m.getClienteId(),
                m.getTipo(),
                m.getMonto(),
                m.getDescripcion(),
                m.getFecha() != null ? m.getFecha().toString() : null,
                m.getSaldoResultante()
        );
    }
}