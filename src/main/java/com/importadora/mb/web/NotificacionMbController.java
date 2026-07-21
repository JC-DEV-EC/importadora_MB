package com.importadora.mb.web;

import com.importadora.mb.service.NotificacionMbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificacionMbController {

    private final NotificacionMbService service;
    private final com.importadora.mb.domain.UsuarioMbRepository usuarioRepository;

    public NotificacionMbController(
        NotificacionMbService service,
        com.importadora.mb.domain.UsuarioMbRepository usuarioRepository
    ) {
        this.service = service;
        this.usuarioRepository = usuarioRepository;
    }

    private Long obtenerUsuarioId(Principal principal) {
        return usuarioRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
            .getId();
    }

    @GetMapping
    public ResponseEntity<PageResponse<NotificacionMbDto>> listar(
        Principal principal,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(service.listar(obtenerUsuarioId(principal), page, size));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificacionMbDto>> noLeidas(Principal principal) {
        return ResponseEntity.ok(service.noLeidas(obtenerUsuarioId(principal)));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(Principal principal) {
        long count = service.contarNoLeidas(obtenerUsuarioId(principal));
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id, Principal principal) {
        service.marcarLeida(id, obtenerUsuarioId(principal));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> marcarTodasLeidas(Principal principal) {
        service.marcarTodasLeidas(obtenerUsuarioId(principal));
        return ResponseEntity.ok().build();
    }
}
