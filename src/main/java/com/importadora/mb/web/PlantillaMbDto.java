package com.importadora.mb.web;

import com.importadora.mb.domain.PlantillaMb;

public record PlantillaMbDto(
    Long id,
    String nombre,
    String tipo,
    String asunto,
    String cuerpo,
    String variables,
    Boolean activo,
    String createdAt
) {
    public static PlantillaMbDto fromEntity(PlantillaMb p) {
        return new PlantillaMbDto(
            p.getId(),
            p.getNombre(),
            p.getTipo(),
            p.getAsunto(),
            p.getCuerpo(),
            p.getVariables(),
            p.getActivo(),
            p.getCreatedAt() != null ? p.getCreatedAt().toString() : null
        );
    }
}
