package com.importadora.mb.web;

import com.importadora.mb.domain.AuditoriaMb;

public record AuditoriaMbDto(
    Long id,
    Long usuarioId,
    String usuarioNombre,
    String accion,
    String entidad,
    Long entidadId,
    String detalle,
    String createdAt
) {
    public static AuditoriaMbDto fromEntity(AuditoriaMb a) {
        return new AuditoriaMbDto(
            a.getId(),
            a.getUsuarioId(),
            a.getUsuarioNombre(),
            a.getAccion(),
            a.getEntidad(),
            a.getEntidadId(),
            a.getDetalle(),
            a.getCreatedAt() != null ? a.getCreatedAt().toString() : null
        );
    }
}
