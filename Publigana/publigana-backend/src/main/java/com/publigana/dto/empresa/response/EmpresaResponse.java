package com.publigana.dto.empresa.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmpresaResponse(
        Long id,
        String nombre,
        String descripcion,
        String direccion,
        String telefono,
        String correo,
        String logo,
        String sitioWeb,
        Boolean estado,
        LocalDateTime fechaRegistro,
        UUID usuarioId,
        Long categoriaId,
        String categoriaNombre
) {
}
