package com.importadora.mb.config;

import com.importadora.mb.domain.UsuarioMb;
import com.importadora.mb.domain.UsuarioMbRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioMbRepository usuarioRepo;

    public JwtAuthFilter(JwtUtil jwtUtil, UsuarioMbRepository usuarioRepo) {
        this.jwtUtil = jwtUtil;
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractEmail(token);
        UsuarioMb usuario = usuarioRepo.findByEmail(email).orElse(null);
        if (usuario == null || !"ACTIVO".equals(usuario.getEstado())) {
            filterChain.doFilter(request, response);
            return;
        }

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()));
        var auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}