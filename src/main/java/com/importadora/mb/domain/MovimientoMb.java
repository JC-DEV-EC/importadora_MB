package com.importadora.mb.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_mb")
public class MovimientoMb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    @Column(name = "tipo", nullable = false, length = 20)
    private String tipo;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "saldo_resultante", nullable = false)
    private BigDecimal saldoResultante;

    public MovimientoMb() {}

    public MovimientoMb(Long clienteId, String tipo, BigDecimal monto, String descripcion, LocalDateTime fecha, BigDecimal saldoResultante) {
        this.clienteId = clienteId;
        this.tipo = tipo;
        this.monto = monto;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.saldoResultante = saldoResultante;
    }

    public Long getId() { return id; }
    public Long getClienteId() { return clienteId; }
    public String getTipo() { return tipo; }
    public BigDecimal getMonto() { return monto; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFecha() { return fecha; }
    public BigDecimal getSaldoResultante() { return saldoResultante; }
}