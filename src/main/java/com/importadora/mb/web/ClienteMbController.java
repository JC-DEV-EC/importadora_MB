package com.importadora.mb.web;

import com.importadora.mb.service.ClienteMbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClienteMbController {

    private final ClienteMbService service;

    public ClienteMbController(ClienteMbService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClienteMbDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteMbDto> getOne(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteMbDto> create(@Valid @RequestBody ClientCreateRequest request) {
        ClienteMbDto created = service.create(request);
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
                                                  @Valid @RequestBody ClientChargeRequest request) {
        return service.addCharge(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<ClienteMbDto> addPayment(@PathVariable Long id,
                                                   @Valid @RequestBody ClientPaymentRequest request) {
        return service.addPayment(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
