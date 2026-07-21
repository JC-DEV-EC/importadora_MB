package com.importadora.mb.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantillaMbRepository extends JpaRepository<PlantillaMb, Long> {

    List<PlantillaMb> findByTipoAndActivoTrue(String tipo);
}
