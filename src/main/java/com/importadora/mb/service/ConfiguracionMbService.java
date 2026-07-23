package com.importadora.mb.service;

import com.importadora.mb.domain.ConfiguracionMb;
import com.importadora.mb.domain.ConfiguracionMbRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ConfiguracionMbService {

    private static final Logger log = LoggerFactory.getLogger(ConfiguracionMbService.class);
    private final ConfiguracionMbRepository repository;
    private final WebSocketPublisher webSocketPublisher;

    public ConfiguracionMbService(ConfiguracionMbRepository repository, WebSocketPublisher webSocketPublisher) {
        this.repository = repository;
        this.webSocketPublisher = webSocketPublisher;
    }

    @PostConstruct
    @Transactional
    public void seedDefaults() {
        Map<String, String> defaults = new LinkedHashMap<>();
        defaults.put("interes_mora", "2.5");
        defaults.put("dias_gracia", "15");
        defaults.put("iva_porcentaje", "12");
        defaults.put("descuento_porcentaje", "10");
        defaults.put("whatsapp_numero", "+593 99 999 9999");
        defaults.put("email_contacto", "info@importadoramb.com");
        defaults.put("limite_credito_default", "500.00");
        defaults.put("nombre_empresa", "Importadora MB");

        for (var entry : defaults.entrySet()) {
            if (!repository.existsByClave(entry.getKey())) {
                ConfiguracionMb entity = new ConfiguracionMb(entry.getKey(), entry.getValue(), "");
                repository.save(entity);
                log.info("Config seed creada: {} = {}", entry.getKey(), entry.getValue());
            }
        }
    }

    public List<ConfiguracionMb> findAll() {
        return repository.findAll();
    }

    public Optional<ConfiguracionMb> getByClave(String clave) {
        return repository.findByClave(clave);
    }

    public String getValor(String clave, String defaultVal) {
        return repository.findByClave(clave)
            .map(ConfiguracionMb::getValor)
            .orElse(defaultVal);
    }

    public BigDecimal getValorDecimal(String clave, BigDecimal defaultVal) {
        try {
            String val = getValor(clave, null);
            return val != null ? new BigDecimal(val) : defaultVal;
        } catch (NumberFormatException e) {
            return defaultVal;
        }
    }

    @Transactional
    public Optional<ConfiguracionMb> update(String clave, String valor) {
        return repository.findByClave(clave)
            .map(entity -> {
                entity.setValor(valor);
                entity.setUpdatedAt(LocalDateTime.now());
                ConfiguracionMb saved = repository.save(entity);
                log.info("Configuracion actualizada clave={} valor={}", clave, valor);
                webSocketPublisher.publish("CONFIG_UPDATED");
                return saved;
            });
    }

    @Transactional
    public ConfiguracionMb create(String clave, String valor, String descripcion) {
        if (repository.existsByClave(clave)) {
            throw new IllegalArgumentException("Ya existe una configuracion con la clave: " + clave);
        }
        ConfiguracionMb entity = new ConfiguracionMb(clave, valor, descripcion);
        entity = repository.save(entity);
        log.info("Configuracion creada clave={} valor={}", clave, valor);
        return entity;
    }
}
