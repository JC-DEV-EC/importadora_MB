package com.importadora.mb.web;

import com.importadora.mb.domain.ClienteMbRepository;
import com.importadora.mb.domain.MovimientoMbRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ClienteMbRepository clienteRepository;
    private final MovimientoMbRepository movimientoRepository;

    public ReporteController(ClienteMbRepository clienteRepository, MovimientoMbRepository movimientoRepository) {
        this.clienteRepository = clienteRepository;
        this.movimientoRepository = movimientoRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardData> dashboard() {
        long totalClientes = clienteRepository.count();
        long clientesActivos = clienteRepository.countByStatus("ACTIVE");
        BigDecimal deudaTotal = clienteRepository.sumDebt();
        BigDecimal cobradoTotal = clienteRepository.sumPayment();
        BigDecimal pendienteTotal = clienteRepository.sumTotalAmount();

        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(LocalTime.MAX);

        BigDecimal cobradoEsteMes = movimientoRepository.sumByTipoAndFechaBetween("PAGO", inicioMes, finMes);
        BigDecimal cargosEsteMes = movimientoRepository.sumByTipoAndFechaBetween("CARGO", inicioMes, finMes);

        return ResponseEntity.ok(new DashboardData(
            totalClientes,
            clientesActivos,
            deudaTotal,
            cobradoTotal,
            pendienteTotal,
            cobradoEsteMes,
            cargosEsteMes
        ));
    }
}
