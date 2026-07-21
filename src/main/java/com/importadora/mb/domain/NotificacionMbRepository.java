package com.importadora.mb.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificacionMbRepository extends JpaRepository<NotificacionMb, Long> {

    Page<NotificacionMb> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId, Pageable pageable);

    List<NotificacionMb> findByUsuarioIdAndLeidoFalseOrderByCreatedAtDesc(Long usuarioId);

    long countByUsuarioIdAndLeidoFalse(Long usuarioId);

    @Modifying
    @Query("UPDATE NotificacionMb n SET n.leido = true WHERE n.usuarioId = :usuarioId AND n.leido = false")
    void marcarTodasComoLeidas(@Param("usuarioId") Long usuarioId);
}
