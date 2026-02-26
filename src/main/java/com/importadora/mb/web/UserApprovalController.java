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

    @PostMapping("/register")
    public ResponseEntity<UserApprovalDto> register(@Valid @RequestBody RegisterRequest request) {
        UserApprovalDto dto = service.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/status/{firebaseUid}")
    public ResponseEntity<UserApprovalDto> getStatus(@PathVariable String firebaseUid) {
        return service.getStatus(firebaseUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    public List<UserApprovalDto> getPending(@RequestHeader("X-Admin-Uid") String adminUid) {
        return service.getPending();
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<UserApprovalDto> approve(@PathVariable Long id,
                                                    @RequestHeader("X-Admin-Uid") String adminUid) {
        return service.approve(id, adminUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<UserApprovalDto> reject(@PathVariable Long id,
                                                   @RequestHeader("X-Admin-Uid") String adminUid) {
        return service.reject(id, adminUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }
}
