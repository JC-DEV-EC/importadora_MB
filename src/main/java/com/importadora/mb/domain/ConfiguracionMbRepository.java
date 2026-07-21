package com.importadora.mb.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfiguracionMbRepository extends JpaRepository<ConfiguracionMb, Long> {

    Optional<ConfiguracionMb> findByClave(String clave);

    boolean existsByClave(String clave);
}
