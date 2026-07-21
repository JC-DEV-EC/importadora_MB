package com.importadora.mb.web;

import com.importadora.mb.domain.ConfiguracionMb;

public record ConfiguracionMbDto(
    Long id,
    String clave,
    String valor,
    String descripcion
) {
    public static ConfiguracionMbDto fromEntity(ConfiguracionMb c) {
        return new ConfiguracionMbDto(
            c.getId(),
            c.getClave(),
            c.getValor(),
            c.getDescripcion()
        );
    }
}
