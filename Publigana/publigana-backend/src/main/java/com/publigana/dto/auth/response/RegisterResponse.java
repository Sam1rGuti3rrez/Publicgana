package com.publigana.dto.auth.response;

import java.util.UUID;

public record RegisterResponse(
        UUID id,
        String nombres,
        String apellidos,
        String correo,
        String telefono,
        Boolean activo,
        String rol
) {
}