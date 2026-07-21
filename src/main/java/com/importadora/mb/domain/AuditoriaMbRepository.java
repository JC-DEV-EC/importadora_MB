package com.importadora.mb.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditoriaMbRepository extends JpaRepository<AuditoriaMb, Long> {

    List<AuditoriaMb> findAllByOrderByCreatedAtDesc();
}
