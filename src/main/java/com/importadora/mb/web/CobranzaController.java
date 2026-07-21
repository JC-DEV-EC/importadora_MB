package com.importadora.mb.web;

import com.importadora.mb.domain.ClienteMbRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cobranza")
public class CobranzaController {

    private final ClienteMbRepository repository;

    public CobranzaController(ClienteMbRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ClienteMbDto>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "totalAmount"));
        var result = repository.findByTotalAmountGreaterThanOrderByTotalAmountDesc(BigDecimal.ZERO, pageable);
        var content = result.stream().map(ClienteMbDto::fromEntity).toList();
        return ResponseEntity.ok(PageResponse.of(result, content));
    }
}
