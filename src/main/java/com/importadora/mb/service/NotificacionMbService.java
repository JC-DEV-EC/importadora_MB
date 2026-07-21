package com.importadora.mb.service;

import com.importadora.mb.domain.NotificacionMb;
import com.importadora.mb.domain.NotificacionMbRepository;
import com.importadora.mb.web.NotificacionMbDto;
import com.importadora.mb.web.PageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificacionMbService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionMbService.class);
    private final NotificacionMbRepository repository;

    public NotificacionMbService(NotificacionMbRepository repository) {
        this.repository = repository;
    }

    public PageResponse<NotificacionMbDto> listar(Long usuarioId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<NotificacionMb> result = repository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId, pageable);
        return PageResponse.of(result, result.map(NotificacionMbDto::fromEntity).getContent());
    }

    public List<NotificacionMbDto> noLeidas(Long usuarioId) {
        return repository.findByUsuarioIdAndLeidoFalseOrderByCreatedAtDesc(usuarioId)
            .stream()
            .map(NotificacionMbDto::fromEntity)
            .toList();
    }

    public long contarNoLeidas(Long usuarioId) {
        return repository.countByUsuarioIdAndLeidoFalse(usuarioId);
    }

    @Transactional
    public NotificacionMbDto crear(Long usuarioId, String tipo, String mensaje, Long clienteId) {
        NotificacionMb notif = new NotificacionMb(usuarioId, tipo, mensaje, clienteId);
        notif = repository.save(notif);
        log.info("Notificacion creada para usuario {}: [{}] {} (clienteId={})", usuarioId, tipo, mensaje, clienteId);
        return NotificacionMbDto.fromEntity(notif);
    }

    @Transactional
    public void marcarLeida(Long id, Long usuarioId) {
        repository.findById(id).ifPresent(n -> {
            if (n.getUsuarioId().equals(usuarioId)) {
                n.setLeido(true);
                repository.save(n);
            }
        });
    }

    @Transactional
    public void marcarTodasLeidas(Long usuarioId) {
        repository.marcarTodasComoLeidas(usuarioId);
    }
}
