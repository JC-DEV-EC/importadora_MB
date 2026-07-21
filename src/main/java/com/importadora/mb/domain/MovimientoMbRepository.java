package com.importadora.mb.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoMbRepository extends JpaRepository<MovimientoMb, Long> {

    List<MovimientoMb> findByClienteIdOrderByFechaDesc(Long clienteId);

    Page<MovimientoMb> findByClienteIdOrderByFechaDesc(Long clienteId, Pageable pageable);
}