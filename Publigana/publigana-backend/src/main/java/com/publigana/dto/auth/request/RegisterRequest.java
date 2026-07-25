package com.publigana.dto.auth.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres no deben superar 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no deben superar 100 caracteres")
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato valido")
    @Size(max = 150, message = "El correo no debe superar 150 caracteres")
    @JsonAlias({"Correo"})
    private String correo;

    @NotBlank(message = "La contrasena es obligatoria")
    @Size(min = 8, max = 255, message = "La contrasena debe tener entre 8 y 255 caracteres")
    @JsonAlias({"contraseña"})
    private String contrasena;

    @Size(max = 20, message = "El telefono no debe superar 20 caracteres")
    private String telefono;


}
