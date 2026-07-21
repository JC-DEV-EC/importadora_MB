package com.importadora.mb.web;

import com.importadora.mb.config.JwtUtil;
import com.importadora.mb.domain.UsuarioMb;
import com.importadora.mb.domain.UsuarioMbRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioMbRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioMbRepository usuarioRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        var usuario = usuarioRepo.findByEmail(request.email()).orElse(null);
        if (usuario == null || !passwordEncoder.matches(request.password(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!"ACTIVO".equals(usuario.getEstado())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getNombre(), usuario.getRol()));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (usuarioRepo.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        String encoded = passwordEncoder.encode(request.password());
        UsuarioMb usuario = new UsuarioMb(request.email(), encoded, request.nombre(), "AGENT");
        usuarioRepo.save(usuario);
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(token, usuario.getEmail(), usuario.getNombre(), usuario.getRol()));
    }
}