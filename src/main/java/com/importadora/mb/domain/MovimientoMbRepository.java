package com.importadora.mb.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoMbRepository extends JpaRepository<MovimientoMb, Long> {

    List<MovimientoMb> findByClienteIdOrderByFechaDesc(Long clienteId);

    Page<MovimientoMb> findByClienteIdOrderByFechaDesc(Long clienteId, Pageable pageable);

    List<MovimientoMb> findByFechaBetweenOrderByFechaAsc(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM MovimientoMb m WHERE m.tipo = :tipo AND m.fecha BETWEEN :start AND :end")
    BigDecimal sumByTipoAndFechaBetween(@Param("tipo") String tipo, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
