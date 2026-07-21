package com.importadora.mb.service;

import com.importadora.mb.domain.AuditoriaMb;
import com.importadora.mb.domain.AuditoriaMbRepository;
import com.importadora.mb.web.AuditoriaMbDto;
import com.importadora.mb.web.PageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditoriaMbService {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaMbService.class);
    private final AuditoriaMbRepository repository;

    public AuditoriaMbService(AuditoriaMbRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void registrar(Long usuarioId, String usuarioNombre, String accion, String entidad, Long entidadId, String detalle) {
        AuditoriaMb auditoria = new AuditoriaMb(usuarioId, usuarioNombre, accion, entidad, entidadId, detalle);
        repository.save(auditoria);
        log.info("Auditoria registrada: usuario={} accion={} entidad={} entidadId={}", usuarioNombre, accion, entidad, entidadId);
    }

    public PageResponse<AuditoriaMbDto> listar(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditoriaMb> result = repository.findAll(pageable);
        var content = result.stream().map(AuditoriaMbDto::fromEntity).toList();
        return PageResponse.of(result, content);
    }
}
