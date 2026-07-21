package com.importadora.mb.web;

import com.importadora.mb.domain.UsuarioMbRepository;
import com.importadora.mb.service.ClienteMbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.security.Principal;

@RestController
@RequestMapping("/api/clients")
public class ClienteMbController {

    private final ClienteMbService service;
    private final UsuarioMbRepository usuarioRepository;

    public ClienteMbController(ClienteMbService service, UsuarioMbRepository usuarioRepository) {
        this.service = service;
        this.usuarioRepository = usuarioRepository;
    }

    private Long obtenerUsuarioId(Principal principal) {
        return usuarioRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
            .getId();
    }

    @GetMapping
    public PageResponse<ClienteMbDto> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q) {
        return service.findAllPaginated(page, size, q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteMbDto> getOne(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteMbDto> create(@Valid @RequestBody ClientCreateRequest request, Principal principal) {
        ClienteMbDto created = service.create(request, obtenerUsuarioId(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteMbDto> update(@PathVariable Long id,
                                               @Valid @RequestBody ClientUpdateRequest request) {
        return service.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/charges")
    public ResponseEntity<ClienteMbDto> addCharge(@PathVariable Long id,
                                                  @Valid @RequestBody ClientChargeRequest request,
                                                  Principal principal) {
        return service.addCharge(id, request, obtenerUsuarioId(principal))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<ClienteMbDto> addPayment(@PathVariable Long id,
                                                    @Valid @RequestBody ClientPaymentRequest request,
                                                    Principal principal) {
        return service.addPayment(id, request, obtenerUsuarioId(principal))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/export")
    public ResponseEntity<org.springframework.core.io.Resource> export(@RequestParam(defaultValue = "csv") String format) {
        String csv = service.exportCsv();
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        var resource = new org.springframework.core.io.ByteArrayResource(bytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=clientes.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header("Content-Type", "text/csv; charset=UTF-8")
                .body(resource);
    }
}
