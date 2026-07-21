package com.importadora.mb.web;

import com.importadora.mb.service.PlantillaMbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
public class PlantillaMbController {

    private final PlantillaMbService service;

    public PlantillaMbController(PlantillaMbService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PlantillaMbDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantillaMbDto> findById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PlantillaMbDto>> findByTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(service.findByTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<PlantillaMbDto> create(@RequestBody PlantillaMbDto dto) {
        PlantillaMbDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantillaMbDto> update(@PathVariable Long id, @RequestBody PlantillaMbDto dto) {
        return service.update(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
