package com.importadora.mb.web;

import com.importadora.mb.domain.UsuarioMb;
import com.importadora.mb.domain.UsuarioMbRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioMbRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioMbRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDto> getAll() {
        return usuarioRepo.findAll().stream().map(UsuarioDto::fromEntity).toList();
    }

    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody RegisterRequest request) {
        if (usuarioRepo.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        String encoded = passwordEncoder.encode(request.password());
        UsuarioMb usuario = new UsuarioMb(request.email(), encoded, request.nombre(), "AGENT");
        usuarioRepo.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioDto.fromEntity(usuario));
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioDto> changeRol(@PathVariable Long id, @RequestParam String rol) {
        return usuarioRepo.findById(id)
                .map(u -> {
                    u.setRol(rol);
                    usuarioRepo.save(u);
                    return ResponseEntity.ok(UsuarioDto.fromEntity(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioDto> changeEstado(@PathVariable Long id, @RequestParam String estado) {
        return usuarioRepo.findById(id)
                .map(u -> {
                    u.setEstado(estado);
                    usuarioRepo.save(u);
                    return ResponseEntity.ok(UsuarioDto.fromEntity(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
