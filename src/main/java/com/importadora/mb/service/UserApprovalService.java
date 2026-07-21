package com.importadora.mb.service;

import com.importadora.mb.domain.UsuarioMb;
import com.importadora.mb.domain.UsuarioMbRepository;
import com.importadora.mb.web.RegisterRequest;
import com.importadora.mb.web.UsuarioDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserApprovalService {

    private static final Logger log = LoggerFactory.getLogger(UserApprovalService.class);

    private final UsuarioMbRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserApprovalService(UsuarioMbRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioDto register(RegisterRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        String encoded = passwordEncoder.encode(request.password());
        UsuarioMb entity = new UsuarioMb(request.email(), encoded, request.nombre(), "AGENT");
        UsuarioMb saved = repository.save(entity);
        log.info("Registered user email={} nombre={}", saved.getEmail(), saved.getNombre());
        return UsuarioDto.fromEntity(saved);
    }

    public Optional<UsuarioDto> getStatus(String email) {
        return repository.findByEmail(email).map(UsuarioDto::fromEntity);
    }

    public List<UsuarioDto> getPending() {
        return repository.findAll().stream()
                .filter(u -> "INACTIVO".equals(u.getEstado()))
                .map(UsuarioDto::fromEntity)
                .toList();
    }

    @Transactional
    public Optional<UsuarioDto> approve(Long id, String adminEmail) {
        if (!isAdmin(adminEmail)) return Optional.empty();
        return repository.findById(id).map(user -> {
            user.setEstado("ACTIVO");
            UsuarioMb saved = repository.save(user);
            log.info("Approved user id={} by admin={}", id, adminEmail);
            return UsuarioDto.fromEntity(saved);
        });
    }

    @Transactional
    public Optional<UsuarioDto> reject(Long id, String adminEmail) {
        if (!isAdmin(adminEmail)) return Optional.empty();
        return repository.findById(id).map(user -> {
            user.setEstado("INACTIVO");
            UsuarioMb saved = repository.save(user);
            log.info("Rejected user id={} by admin={}", id, adminEmail);
            return UsuarioDto.fromEntity(saved);
        });
    }

    public List<UsuarioDto> getAllUsers(String adminEmail) {
        if (!isAdmin(adminEmail)) return List.of();
        return repository.findAll().stream().map(UsuarioDto::fromEntity).toList();
    }

    @Transactional
    public Optional<UsuarioDto> changeRole(Long id, String newRole, String adminEmail) {
        if (!isAdmin(adminEmail)) return Optional.empty();
        return repository.findById(id).map(user -> {
            user.setRol(newRole);
            UsuarioMb saved = repository.save(user);
            log.info("Changed role of user id={} to {} by admin={}", id, newRole, adminEmail);
            return UsuarioDto.fromEntity(saved);
        });
    }

    @Transactional
    public boolean deleteUser(Long id, String adminEmail) {
        if (!isAdmin(adminEmail)) return false;
        if (repository.existsById(id)) {
            repository.deleteById(id);
            log.info("Deleted user id={} by admin={}", id, adminEmail);
            return true;
        }
        return false;
    }

    private boolean isAdmin(String email) {
        return repository.findByEmail(email)
                .map(u -> "ADMIN".equals(u.getRol()))
                .orElse(false);
    }
}