package com.importadora.mb.service;

import com.importadora.mb.domain.ClienteMb;
import com.importadora.mb.domain.ClienteMbRepository;
import com.importadora.mb.web.ClientChargeRequest;
import com.importadora.mb.web.ClientCreateRequest;
import com.importadora.mb.web.ClientPaymentRequest;
import com.importadora.mb.web.ClientUpdateRequest;
import com.importadora.mb.web.ClienteMbDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteMbService {

    private final ClienteMbRepository repository;

    public ClienteMbService(ClienteMbRepository repository) {
        this.repository = repository;
    }

    public List<ClienteMbDto> findAll() {
        return repository.findAll()
                .stream()
                .map(ClienteMbDto::fromEntity)
                .toList();
    }

    public Optional<ClienteMbDto> findById(Long id) {
        return repository.findById(id)
                .map(ClienteMbDto::fromEntity);
    }

    @Transactional
    public ClienteMbDto create(ClientCreateRequest request) {
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

        return ClienteMbDto.fromEntity(repository.save(entity));
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
                    return ClienteMbDto.fromEntity(repository.save(entity));
                });
    }

    @Transactional
    public Optional<ClienteMbDto> addCharge(Long id, ClientChargeRequest request) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Charge amount must be greater than zero");
        }
        return repository.findById(id)
                .map(entity -> {
                    BigDecimal currentDebt = nullSafe(entity.getDebt());
                    entity.setDebt(currentDebt.add(request.amount()));
                    recalculateFinancials(entity);
                    return ClienteMbDto.fromEntity(repository.save(entity));
                });
    }

    @Transactional
    public Optional<ClienteMbDto> addPayment(Long id, ClientPaymentRequest request) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        return repository.findById(id)
                .map(entity -> {
                    BigDecimal currentPayment = nullSafe(entity.getPayment());
                    BigDecimal newPayment = currentPayment.add(request.amount());

                    BigDecimal grossDebt = nullSafe(entity.getDebt());
                    if (newPayment.compareTo(grossDebt) > 0) {
                        newPayment = grossDebt; // no permitir pagar más de la deuda bruta
                    }

                    entity.setPayment(newPayment);
                    recalculateFinancials(entity);
                    return ClienteMbDto.fromEntity(repository.save(entity));
                });
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
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

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
