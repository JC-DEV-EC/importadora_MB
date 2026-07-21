package com.importadora.mb.web;

import com.importadora.mb.domain.UsuarioMb;

public record UsuarioDto(
        Long id,
        String email,
        String nombre,
        String rol,
        String estado,
        String createdAt
) {
    public static UsuarioDto fromEntity(UsuarioMb u) {
        return new UsuarioDto(
                u.getId(),
                u.getEmail(),
                u.getNombre(),
                u.getRol(),
                u.getEstado(),
                u.getCreatedAt() != null ? u.getCreatedAt().toString() : null
        );
    }
}