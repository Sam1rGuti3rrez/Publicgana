package com.publigana.service;

import com.publigana.dto.auth.request.RegisterRequest;
import com.publigana.dto.auth.response.RegisterResponse;
import com.publigana.entity.Rol;
import com.publigana.entity.Usuario;
import com.publigana.repository.RolRepository;
import com.publigana.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class AuthService {


    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public RegisterResponse registrar(RegisterRequest request) {


        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException(
                    "El correo ya se encuentra registrado"
            );
        }


        if (request.getTelefono() != null
                && !request.getTelefono().isBlank()
                && usuarioRepository.existsByTelefono(request.getTelefono())) {

            throw new IllegalArgumentException(
                    "El telefono ya se encuentra registrado"
            );
        }


        Usuario usuario = new Usuario();


        usuario.setNombres(request.getNombres());

        usuario.setApellidos(request.getApellidos());

        usuario.setCorreo(request.getCorreo());


        usuario.setContrasena(
                passwordEncoder.encode(
                        request.getContrasena()
                )
        );


        usuario.setTelefono(
                request.getTelefono()
        );


        usuario.setActivo(true);



        Rol rol = rolRepository.findByNombre("USER")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El rol USER no existe"
                        )
                );


        usuario.setRol(rol);



        Usuario usuarioGuardado =
                usuarioRepository.save(usuario);



        return new RegisterResponse(

                usuarioGuardado.getId(),

                usuarioGuardado.getNombres(),

                usuarioGuardado.getApellidos(),

                usuarioGuardado.getCorreo(),

                usuarioGuardado.getTelefono(),

                usuarioGuardado.getActivo(),

                usuarioGuardado.getRol().getNombre()

        );

    }
}