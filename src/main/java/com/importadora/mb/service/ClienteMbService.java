package com.importadora.mb.service;

import com.importadora.mb.domain.ClienteMb;
import com.importadora.mb.domain.ClienteMbRepository;
import com.importadora.mb.web.ClientChargeRequest;
import com.importadora.mb.web.ClientCreateRequest;
import com.importadora.mb.web.ClientPaymentRequest;
import com.importadora.mb.web.ClientUpdateRequest;
import com.importadora.mb.web.ClienteMbDto;
import com.importadora.mb.web.PageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteMbService {

    private static final Logger log = LoggerFactory.getLogger(ClienteMbService.class);

    private final ClienteMbRepository repository;
    private final MovimientoMbService movimientoService;
    private final NotificacionMbService notificacionService;

    public ClienteMbService(ClienteMbRepository repository, MovimientoMbService movimientoService, NotificacionMbService notificacionService) {
        this.repository = repository;
        this.movimientoService = movimientoService;
        this.notificacionService = notificacionService;
    }

    public List<ClienteMbDto> findAll() {
        return repository.findAll()
                .stream()
                .map(ClienteMbDto::fromEntity)
                .toList();
    }

    public PageResponse<ClienteMbDto> findAllPaginated(int page, int size, String q) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ClienteMb> resultPage;

        if (q != null && !q.isBlank()) {
            resultPage = repository.search(q, pageable);
        } else {
            resultPage = repository.findAll(pageable);
        }

        List<ClienteMbDto> content = resultPage.stream()
                .map(ClienteMbDto::fromEntity)
                .toList();

        return PageResponse.of(resultPage, content);
    }

    public Optional<ClienteMbDto> findById(Long id) {
        return repository.findById(id)
                .map(ClienteMbDto::fromEntity);
    }

    @Transactional
    public ClienteMbDto create(ClientCreateRequest request, Long usuarioId) {
        ClienteMb entity = new ClienteMb();
        entity.setFirstName(request.firstName());
        entity.setLastName(request.lastName());
        entity.setCity(request.city());
        entity.setRegistrationDate(request.registrationDate());

        BigDecimal initialDebt = request.initialDebt() != null ? request.initialDebt() : BigDecimal.ZERO;
        entity.setDebt(initialDebt);
        entity.setPayment(BigDecimal.ZERO);
        entity.setDiscount(Boolean.TRUE.equals(request.discount()));

        recalculateFinancials(entity);

        ClienteMb saved = repository.save(entity);
        log.info("Created client id={} name={} {} city={} initialDebt={} discount={}",
                saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getCity(),
                saved.getDebt(), saved.getDiscount());

        String nombreCompleto = saved.getFirstName() + " " + saved.getLastName();
        notificacionService.crear(usuarioId, "success",
            "Cliente \"" + nombreCompleto + "\" creado con éxito",
            saved.getId());

        return ClienteMbDto.fromEntity(saved);
    }

    @Transactional
    public Optional<ClienteMbDto> update(Long id, ClientUpdateRequest request) {
        return repository.findById(id)
                .map(entity -> {
                    entity.setFirstName(request.firstName());
                    entity.setLastName(request.lastName());
                    entity.setCity(request.city());
                    entity.setRegistrationDate(request.registrationDate());
                    if (request.discount() != null) {
                        entity.setDiscount(request.discount());
                    }
                    recalculateFinancials(entity);
                    ClienteMb saved = repository.save(entity);
                    log.info("Updated client id={} name={} {} city={} discount={} status={} totalAmount={}",
                            saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getCity(),
                            saved.getDiscount(), saved.getStatus(), saved.getTotalAmount());
                    return ClienteMbDto.fromEntity(saved);
                });
    }

    @Transactional
    public Optional<ClienteMbDto> addCharge(Long id, ClientChargeRequest request, Long usuarioId) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Charge amount must be greater than zero");
        }
        return repository.findById(id)
                .map(entity -> {
                    String nombre = entity.getFirstName() + " " + entity.getLastName();
                    BigDecimal currentDebt = nullSafe(entity.getDebt());
                    BigDecimal newDebt = currentDebt.add(request.amount());
                    entity.setDebt(newDebt);
                    recalculateFinancials(entity);
                    ClienteMb saved = repository.save(entity);
                    movimientoService.registrar(
                            saved.getId(), "CARGO", request.amount(),
                            request.description(), saved.getTotalAmount());
                    log.info("Added charge clientId={} amount={} newDebt={} totalAmount={} status={}",
                            saved.getId(), request.amount(), saved.getDebt(), saved.getTotalAmount(), saved.getStatus());

                    String desc = request.description() != null ? " - " + request.description() : "";
                    notificacionService.crear(usuarioId, "warning",
                        "Cargo de $" + String.format("%.2f", request.amount()) + " a " + nombre + desc,
                        saved.getId());

                    return ClienteMbDto.fromEntity(saved);
                });
    }

    @Transactional
    public Optional<ClienteMbDto> addPayment(Long id, ClientPaymentRequest request, Long usuarioId) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        return repository.findById(id)
                .map(entity -> {
                    String nombre = entity.getFirstName() + " " + entity.getLastName();
                    BigDecimal currentPayment = nullSafe(entity.getPayment());
                    BigDecimal newPayment = currentPayment.add(request.amount());

                    BigDecimal grossDebt = nullSafe(entity.getDebt());
                    if (newPayment.compareTo(grossDebt) > 0) {
                        newPayment = grossDebt;
                    }

                    entity.setPayment(newPayment);
                    recalculateFinancials(entity);
                    ClienteMb saved = repository.save(entity);
                    movimientoService.registrar(
                            saved.getId(), "PAGO", request.amount(),
                            request.description(), saved.getTotalAmount());
                    log.info("Added payment clientId={} amount={} paymentTotal={} remaining={} status={}",
                            saved.getId(), request.amount(), saved.getPayment(),
                            saved.getTotalAmount(), saved.getStatus());

                    String desc = request.description() != null ? " - " + request.description() : "";
                    notificacionService.crear(usuarioId, "success",
                        "Pago de $" + String.format("%.2f", request.amount()) + " de " + nombre + desc,
                        saved.getId());

                    return ClienteMbDto.fromEntity(saved);
                });
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
        log.info("Deleted client id={}", id);
    }

    private void recalculateFinancials(ClienteMb entity) {
        BigDecimal debt = nullSafe(entity.getDebt());
        BigDecimal payment = nullSafe(entity.getPayment());
        boolean hasDiscount = Boolean.TRUE.equals(entity.getDiscount());

        BigDecimal base = debt.subtract(payment);
        if (base.compareTo(BigDecimal.ZERO) < 0) {
            base = BigDecimal.ZERO;
        }

        BigDecimal net = hasDiscount ? base.multiply(new BigDecimal("0.9")) : base;
        entity.setTotalAmount(net);

        if (net.compareTo(BigDecimal.ZERO) <= 0) {
            entity.setStatus("CANCELLED");
        } else {
            entity.setStatus("ACTIVE");
        }
    }

    public String exportCsv() {
        List<ClienteMb> clients = repository.findAll();
        // BOM para que Excel detecte UTF-8 correctamente
        StringBuilder sb = new StringBuilder("\uFEFF");
        sb.append("ID;Nombre;Apellido;Ciudad;Fecha de Registro;Deuda (USD);Pagado (USD);Saldo (USD);Descuento;Estado\n");
        for (ClienteMb c : clients) {
            sb.append(c.getId()).append(';');
            sb.append(escapeCsv(c.getFirstName())).append(';');
            sb.append(escapeCsv(c.getLastName())).append(';');
            sb.append(escapeCsv(c.getCity())).append(';');
            sb.append(c.getRegistrationDate() != null ? c.getRegistrationDate().toLocalDate().toString() : "").append(';');
            sb.append(String.format("%.2f", nullSafe(c.getDebt()))).append(';');
            sb.append(String.format("%.2f", nullSafe(c.getPayment()))).append(';');
            sb.append(String.format("%.2f", nullSafe(c.getTotalAmount()))).append(';');
            sb.append(Boolean.TRUE.equals(c.getDiscount()) ? "Sí" : "No").append(';');
            sb.append("ACTIVE".equals(c.getStatus()) ? "Activo" : "Cancelado").append('\n');
        }
        return sb.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(";") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
