package com.importadora.mb.web;

import com.importadora.mb.domain.ClienteMb;

import java.math.BigDecimal;

public record ClienteMbDto(
        Long id,
        String fullName,
        String city,
        String registrationDate,
        BigDecimal debt,
        BigDecimal payment,
        BigDecimal totalAmount,
        Boolean discount,
        String status
) {
    public static ClienteMbDto fromEntity(ClienteMb c) {
        String name = (c.getFirstName() + " " + c.getLastName()).trim();
        String date = c.getRegistrationDate() != null ? c.getRegistrationDate().toString() : null;
        return new ClienteMbDto(
                c.getId(),
                name,
                c.getCity(),
                date,
                c.getDebt(),
                c.getPayment(),
                c.getTotalAmount(),
                c.getDiscount(),
                c.getStatus()
        );
    }
}
