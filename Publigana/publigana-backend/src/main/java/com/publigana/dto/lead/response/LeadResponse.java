package com.publigana.dto.lead.response;

import java.util.UUID;
public record LeadResponse(
        UUID id,
        String nombre,
        String correo,
        String ciudad,
        String tipoUsuario
) {
}
