package com.importadora.mb.service;

import com.importadora.mb.domain.ConfiguracionMb;
import com.importadora.mb.domain.ConfiguracionMbRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracionMbService {

    private static final Logger log = LoggerFactory.getLogger(ConfiguracionMbService.class);
    private final ConfiguracionMbRepository repository;

    public ConfiguracionMbService(ConfiguracionMbRepository repository) {
        this.repository = repository;
    }

    public List<ConfiguracionMb> findAll() {
        return repository.findAll();
    }

    public Optional<ConfiguracionMb> getByClave(String clave) {
        return repository.findByClave(clave);
    }

    @Transactional
    public Optional<ConfiguracionMb> update(String clave, String valor) {
        return repository.findByClave(clave)
            .map(entity -> {
                entity.setValor(valor);
                entity.setUpdatedAt(LocalDateTime.now());
                ConfiguracionMb saved = repository.save(entity);
                log.info("Configuracion actualizada clave={} valor={}", clave, valor);
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
