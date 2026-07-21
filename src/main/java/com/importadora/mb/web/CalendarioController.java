package com.importadora.mb.web;

import com.importadora.mb.domain.ClienteMb;
import com.importadora.mb.domain.ClienteMbRepository;
import com.importadora.mb.domain.MovimientoMb;
import com.importadora.mb.domain.MovimientoMbRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    private final MovimientoMbRepository movimientoRepository;
    private final ClienteMbRepository clienteRepository;

    public CalendarioController(MovimientoMbRepository movimientoRepository, ClienteMbRepository clienteRepository) {
        this.movimientoRepository = movimientoRepository;
        this.clienteRepository = clienteRepository;
    }

    @GetMapping
    public ResponseEntity<List<CalendarioEvento>> getEventos(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startDate = LocalDate.parse(start).atStartOfDay();
        LocalDateTime endDate = LocalDate.parse(end).atTime(LocalTime.MAX);

        List<MovimientoMb> movimientos = movimientoRepository.findByFechaBetweenOrderByFechaAsc(startDate, endDate);

        List<CalendarioEvento> eventos = movimientos.stream()
            .map(m -> {
                String nombreCliente = clienteRepository.findById(m.getClienteId())
                    .map(c -> c.getFirstName() + " " + c.getLastName())
                    .orElse("Cliente #" + m.getClienteId());
                String title = ("CARGO".equals(m.getTipo()) ? "Cargo" : "Pago") + " - " + nombreCliente;
                return new CalendarioEvento(
                    title,
                    m.getFecha() != null ? m.getFecha().toLocalDate().toString() : null,
                    m.getTipo(),
                    nombreCliente,
                    m.getClienteId(),
                    m.getMonto()
                );
            })
            .toList();

        return ResponseEntity.ok(eventos);
    }
}
