package com.importadora.mb.web;

import com.importadora.mb.service.AuditoriaMbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaMbController {

    private final AuditoriaMbService service;

    public AuditoriaMbController(AuditoriaMbService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AuditoriaMbDto>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(service.listar(page, size));
    }
}
