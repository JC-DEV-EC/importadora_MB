package com.importadora.mb.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones_mb")
public class NotificacionMb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false, length = 20)
    private String tipo = "info";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(nullable = false)
    private Boolean leido = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public NotificacionMb() {}

    public NotificacionMb(Long usuarioId, String tipo, String mensaje, Long clienteId) {
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.clienteId = clienteId;
        this.leido = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Boolean getLeido() { return leido; }
    public void setLeido(Boolean leido) { this.leido = leido; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
