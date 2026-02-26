package com.importadora.mb.service;

import com.importadora.mb.domain.UserApproval;
import com.importadora.mb.domain.UserApprovalRepository;
import com.importadora.mb.web.RegisterRequest;
import com.importadora.mb.web.UserApprovalDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserApprovalService {

    private static final Logger log = LoggerFactory.getLogger(UserApprovalService.class);

    private final UserApprovalRepository repository;

    public UserApprovalService(UserApprovalRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserApprovalDto register(RegisterRequest request) {
        // Check if already registered
        Optional<UserApproval> existing = repository.findByFirebaseUid(request.firebaseUid());
        if (existing.isPresent()) {
            return UserApprovalDto.fromEntity(existing.get());
        }

        UserApproval entity = new UserApproval();
        entity.setFirebaseUid(request.firebaseUid());
        entity.setEmail(request.email());
        entity.setNombre(request.nombre());
        entity.setStatus("PENDING");
        entity.setRole("USER");

        UserApproval saved = repository.save(entity);
        log.info("Registered user firebaseUid={} email={}", saved.getFirebaseUid(), saved.getEmail());
        return UserApprovalDto.fromEntity(saved);
    }

    public Optional<UserApprovalDto> getStatus(String firebaseUid) {
        return repository.findByFirebaseUid(firebaseUid)
                .map(UserApprovalDto::fromEntity);
    }

    public List<UserApprovalDto> getPending() {
        return repository.findByStatus("PENDING").stream()
                .map(UserApprovalDto::fromEntity)
                .toList();
    }

    @Transactional
    public Optional<UserApprovalDto> approve(Long id, String adminUid) {
        // Verify admin
        Optional<UserApproval> admin = repository.findByFirebaseUid(adminUid);
        if (admin.isEmpty() || !"ADMIN".equals(admin.get().getRole())) {
            return Optional.empty();
        }

        return repository.findById(id).map(user -> {
            user.setStatus("APPROVED");
            user.setApprovedBy(adminUid);
            user.setApprovedAt(OffsetDateTime.now());
            UserApproval saved = repository.save(user);
            log.info("Approved user id={} by admin={}", id, adminUid);
            return UserApprovalDto.fromEntity(saved);
        });
    }

    @Transactional
    public Optional<UserApprovalDto> reject(Long id, String adminUid) {
        Optional<UserApproval> admin = repository.findByFirebaseUid(adminUid);
        if (admin.isEmpty() || !"ADMIN".equals(admin.get().getRole())) {
            return Optional.empty();
        }

        return repository.findById(id).map(user -> {
            user.setStatus("REJECTED");
            user.setApprovedBy(adminUid);
            user.setApprovedAt(OffsetDateTime.now());
            UserApproval saved = repository.save(user);
            log.info("Rejected user id={} by admin={}", id, adminUid);
            return UserApprovalDto.fromEntity(saved);
        });
    }
}
