package com.importadora.mb.service;

import com.importadora.mb.domain.PlantillaMb;
import com.importadora.mb.domain.PlantillaMbRepository;
import com.importadora.mb.web.PlantillaMbDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlantillaMbService {

    private static final Logger log = LoggerFactory.getLogger(PlantillaMbService.class);
    private final PlantillaMbRepository repository;

    public PlantillaMbService(PlantillaMbRepository repository) {
        this.repository = repository;
    }

    public List<PlantillaMbDto> findAll() {
        return repository.findAll()
            .stream()
            .map(PlantillaMbDto::fromEntity)
            .toList();
    }

    public Optional<PlantillaMbDto> findById(Long id) {
        return repository.findById(id)
            .map(PlantillaMbDto::fromEntity);
    }

    public List<PlantillaMbDto> findByTipo(String tipo) {
        return repository.findByTipoAndActivoTrue(tipo)
            .stream()
            .map(PlantillaMbDto::fromEntity)
            .toList();
    }

    @Transactional
    public PlantillaMbDto create(PlantillaMbDto dto) {
        PlantillaMb entity = new PlantillaMb(
            dto.nombre(),
            dto.tipo(),
            dto.asunto(),
            dto.cuerpo(),
            dto.variables(),
            dto.activo() != null ? dto.activo() : true
        );
        entity = repository.save(entity);
        log.info("Plantilla creada id={} nombre={} tipo={}", entity.getId(), entity.getNombre(), entity.getTipo());
        return PlantillaMbDto.fromEntity(entity);
    }

    @Transactional
    public Optional<PlantillaMbDto> update(Long id, PlantillaMbDto dto) {
        return repository.findById(id)
            .map(entity -> {
                entity.setNombre(dto.nombre());
                entity.setTipo(dto.tipo());
                entity.setAsunto(dto.asunto());
                entity.setCuerpo(dto.cuerpo());
                entity.setVariables(dto.variables());
                if (dto.activo() != null) {
                    entity.setActivo(dto.activo());
                }
                PlantillaMb saved = repository.save(entity);
                log.info("Plantilla actualizada id={} nombre={} tipo={}", saved.getId(), saved.getNombre(), saved.getTipo());
                return PlantillaMbDto.fromEntity(saved);
            });
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
        log.info("Plantilla eliminada id={}", id);
    }
}
