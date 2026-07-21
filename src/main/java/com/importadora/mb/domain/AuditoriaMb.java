package com.importadora.mb.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_mb")
public class AuditoriaMb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "usuario_nombre", nullable = false)
    private String usuarioNombre;

    @Column(nullable = false, length = 50)
    private String accion;

    @Column(nullable = false, length = 50)
    private String entidad;

    @Column(name = "entidad_id")
    private Long entidadId;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuditoriaMb() {}

    public AuditoriaMb(Long usuarioId, String usuarioNombre, String accion, String entidad, Long entidadId, String detalle) {
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.accion = accion;
        this.entidad = entidad;
        this.entidadId = entidadId;
        this.detalle = detalle;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }
    public String getEntidad() { return entidad; }
    public void setEntidad(String entidad) { this.entidad = entidad; }
    public Long getEntidadId() { return entidadId; }
    public void setEntidadId(Long entidadId) { this.entidadId = entidadId; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
