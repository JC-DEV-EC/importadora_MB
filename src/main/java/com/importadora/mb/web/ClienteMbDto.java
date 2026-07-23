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
        String status,
        String phone,
        String email,
        String cedula,
        BigDecimal ivaPorcentaje,
        BigDecimal ivaAmount
) {
    public static ClienteMbDto fromEntity(ClienteMb c, BigDecimal ivaPorcentaje) {
        String name = (c.getFirstName() + " " + c.getLastName()).trim();
        String date = c.getRegistrationDate() != null ? c.getRegistrationDate().toString() : null;
        BigDecimal total = c.getTotalAmount() != null ? c.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal iva = BigDecimal.ZERO;
        if (ivaPorcentaje != null && ivaPorcentaje.compareTo(BigDecimal.ZERO) > 0 && total.compareTo(BigDecimal.ZERO) > 0) {
            iva = total.multiply(ivaPorcentaje).divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
        }
        return new ClienteMbDto(
                c.getId(),
                name,
                c.getCity(),
                date,
                c.getDebt(),
                c.getPayment(),
                total,
                c.getDiscount(),
                c.getStatus(),
                c.getPhone(),
                c.getEmail(),
                c.getCedula(),
                ivaPorcentaje,
                iva
        );
    }

    public static ClienteMbDto fromEntity(ClienteMb c) {
        return fromEntity(c, null);
    }
}
