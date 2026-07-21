package com.importadora.mb.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ClienteMbRepository extends JpaRepository<ClienteMb, Long> {

    @Query("""
        SELECT c FROM ClienteMb c
        WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.city) LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    Page<ClienteMb> search(@Param("q") String q, Pageable pageable);

    Page<ClienteMb> findAll(Pageable pageable);

    Page<ClienteMb> findByTotalAmountGreaterThanOrderByTotalAmountDesc(BigDecimal totalAmount, Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(c.debt), 0) FROM ClienteMb c")
    BigDecimal sumDebt();

    @Query("SELECT COALESCE(SUM(c.payment), 0) FROM ClienteMb c")
    BigDecimal sumPayment();

    @Query("SELECT COALESCE(SUM(c.totalAmount), 0) FROM ClienteMb c")
    BigDecimal sumTotalAmount();
}
