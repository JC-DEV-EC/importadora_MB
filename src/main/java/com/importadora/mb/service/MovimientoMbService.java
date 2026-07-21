package com.importadora.mb.service;

import com.importadora.mb.domain.MovimientoMb;
import com.importadora.mb.domain.MovimientoMbRepository;
import com.importadora.mb.web.MovimientoMbDto;
import com.importadora.mb.web.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimientoMbService {

    private final MovimientoMbRepository repository;

    public MovimientoMbService(MovimientoMbRepository repository) {
        this.repository = repository;
    }

    public List<MovimientoMbDto> findByClienteId(Long clienteId) {
        return repository.findByClienteIdOrderByFechaDesc(clienteId)
                .stream()
                .map(MovimientoMbDto::fromEntity)
                .toList();
    }

    public PageResponse<MovimientoMbDto> findByClienteIdPaginated(Long clienteId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fecha"));
        Page<MovimientoMb> resultPage = repository.findByClienteIdOrderByFechaDesc(clienteId, pageable);
        var content = resultPage.stream().map(MovimientoMbDto::fromEntity).toList();
        return PageResponse.of(resultPage, content);
    }

    public MovimientoMbDto registrar(Long clienteId, String tipo, BigDecimal monto, String descripcion, BigDecimal saldoResultante) {
        MovimientoMb m = new MovimientoMb(clienteId, tipo, monto, descripcion, LocalDateTime.now(), saldoResultante);
        MovimientoMb saved = repository.save(m);
        return MovimientoMbDto.fromEntity(saved);
    }
}