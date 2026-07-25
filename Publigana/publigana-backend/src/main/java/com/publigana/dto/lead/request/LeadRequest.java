package com.publigana.dto.lead.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public record LeadRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es valido")
        String correo,

        @NotBlank(message = "La ciudad es obligatoria")
        String ciudad,

        @NotBlank(message = "El tipo de usuario es obligatorio")
        String tipoUsuario


) {
}
