package com.importadora.mb.web;

import com.importadora.mb.service.UserApprovalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserApprovalController {

    private final UserApprovalService service;

    public UserApprovalController(UserApprovalService service) {
        this.service = service;
    }

    @GetMapping("/status/{email}")
    public ResponseEntity<UsuarioDto> getStatus(@PathVariable String email) {
        return service.getStatus(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    public List<UsuarioDto> getPending(@RequestHeader("X-Admin-Email") String adminEmail) {
        return service.getPending();
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<UsuarioDto> approve(@PathVariable Long id,
                                               @RequestHeader("X-Admin-Email") String adminEmail) {
        return service.approve(id, adminEmail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<UsuarioDto> reject(@PathVariable Long id,
                                              @RequestHeader("X-Admin-Email") String adminEmail) {
        return service.reject(id, adminEmail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @GetMapping("/users")
    public List<UsuarioDto> getAllUsers(@RequestHeader("X-Admin-Email") String adminEmail) {
        return service.getAllUsers(adminEmail);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UsuarioDto> changeRole(@PathVariable Long id,
                                                  @RequestParam String role,
                                                  @RequestHeader("X-Admin-Email") String adminEmail) {
        return service.changeRole(id, role, adminEmail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                           @RequestHeader("X-Admin-Email") String adminEmail) {
        if (service.deleteUser(id, adminEmail)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}