package com.importadora.mb.web;

import com.importadora.mb.service.MovimientoMbService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients/{id}/movements")
public class MovimientoMbController {

    private final MovimientoMbService service;

    public MovimientoMbController(MovimientoMbService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<MovimientoMbDto> getMovements(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.findByClienteIdPaginated(id, page, size);
    }

    @GetMapping(params = "all=true")
    public List<MovimientoMbDto> getAllMovements(@PathVariable Long id) {
        return service.findByClienteId(id);
    }
}