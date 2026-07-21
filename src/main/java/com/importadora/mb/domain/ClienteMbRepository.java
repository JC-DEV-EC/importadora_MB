package com.importadora.mb.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteMbRepository extends JpaRepository<ClienteMb, Long> {

    @Query("""
        SELECT c FROM ClienteMb c
        WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.city) LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    Page<ClienteMb> search(@Param("q") String q, Pageable pageable);

    Page<ClienteMb> findAll(Pageable pageable);
}
