package com.publigana.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @Size(max = 100, message = "Los nombres no deben superar 100 caracteres")
        String nombres,


        @Size(max = 100, message = "Los apellidos no deben superar 100 caracteres")
        String apellidos,


        @Size(max = 150, message = "El nombre de empresa no debe superar 150 caracteres")
        String nombreEmpresa,


        @Size(max = 50, message = "El NIT no debe superar 50 caracteres")
        String nit,


        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        @Size(max = 150, message = "El correo no debe superar 150 caracteres")
        String correo,


        @NotBlank(message = "La contraseña es obligatoria")
        @Size(
                min = 8,
                max = 255,
                message = "La contraseña debe tener entre 8 y 255 caracteres"
        )
        String contrasena,


        @Size(max = 20, message = "El teléfono no debe superar 20 caracteres")
        String telefono,


        @NotBlank(message = "El rol es obligatorio")
        @Pattern(
                regexp = "(?i)promotor|negocio|admin",
                message = "El rol debe ser promotor, negocio o admin"
        )
        String rol

) {
}