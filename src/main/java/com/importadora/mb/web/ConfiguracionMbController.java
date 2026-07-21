package com.importadora.mb.web;

import com.importadora.mb.domain.ConfiguracionMb;
import com.importadora.mb.service.ConfiguracionMbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionMbController {

    private final ConfiguracionMbService service;

    public ConfiguracionMbController(ConfiguracionMbService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ConfiguracionMb>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{clave}")
    public ResponseEntity<ConfiguracionMb> getByClave(@PathVariable String clave) {
        return service.getByClave(clave)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{clave}")
    public ResponseEntity<ConfiguracionMb> update(@PathVariable String clave, @RequestBody Map<String, String> body) {
        return service.update(clave, body.get("valor"))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ConfiguracionMb> create(@RequestBody ConfiguracionMb config) {
        ConfiguracionMb created = service.create(config.getClave(), config.getValor(), config.getDescripcion());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
