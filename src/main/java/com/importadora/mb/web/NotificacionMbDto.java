package com.importadora.mb.web;

import com.importadora.mb.domain.NotificacionMb;

public record NotificacionMbDto(
    Long id,
    String tipo,
    String mensaje,
    Long clienteId,
    Boolean leido,
    String createdAt
) {
    public static NotificacionMbDto fromEntity(NotificacionMb n) {
        return new NotificacionMbDto(
            n.getId(),
            n.getTipo(),
            n.getMensaje(),
            n.getClienteId(),
            n.getLeido(),
            n.getCreatedAt() != null ? n.getCreatedAt().toString() : null
        );
    }
}
