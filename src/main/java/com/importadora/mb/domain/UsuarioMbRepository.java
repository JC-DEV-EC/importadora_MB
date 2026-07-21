package com.importadora.mb.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioMbRepository extends JpaRepository<UsuarioMb, Long> {
    Optional<UsuarioMb> findByEmail(String email);
    boolean existsByEmail(String email);
}