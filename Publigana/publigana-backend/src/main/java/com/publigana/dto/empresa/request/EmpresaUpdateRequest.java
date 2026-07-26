package com.publigana.dto.empresa.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record EmpresaUpdateRequest(
        @NotBlank(message = "El nombre de la empresa es obligatorio")
        @Size(max = 150, message = "El nombre no puede superar 150 caracteres")
        String nombre,

        String descripcion,

        @Size(max = 255, message = "La dirección no puede superar 255 caracteres")
        String direccion,

        @Size(max = 20, message = "El teléfono no puede superar 20 caracteres")
        String telefono,

        @Email(message = "El correo de la empresa no tiene un formato válido")
        @Size(max = 150, message = "El correo no puede superar 150 caracteres")
        String correo,

        @Size(max = 255, message = "El logo no puede superar 255 caracteres")
        String logo,

        @Size(max = 255, message = "El sitio web no puede superar 255 caracteres")
        String sitioWeb,

        @NotNull(message = "El identificador del usuario propietario es obligatorio")
        UUID usuarioId,

        Long categoriaId,

        @NotNull(message = "El estado de la empresa es obligatorio")
        Boolean estado
) {
}
