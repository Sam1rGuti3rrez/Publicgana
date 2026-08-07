package com.publigana.service;

import com.publigana.dto.auth.request.RegisterRequest;
import com.publigana.dto.auth.response.RegisterResponse;
import com.publigana.entity.Empresa;
import com.publigana.entity.Rol;
import com.publigana.entity.Usuario;
import com.publigana.repository.EmpresaRepository;
import com.publigana.repository.RolRepository;
import com.publigana.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaRepository empresaRepository;


    public AuthService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            EmpresaRepository empresaRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Transactional
    public RegisterResponse registrar(RegisterRequest request) {


        String correo = request.correo()
                .trim()
                .toLowerCase(Locale.ROOT);

        String rolNorm = request.rol().trim().toLowerCase(Locale.ROOT);
        boolean esNegocio = "negocio".equals(rolNorm);
        boolean esPromotor = "promotor".equals(rolNorm);


        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException(
                    "El correo ya se encuentra registrado"
            );
        }


        String telefono = normalizarOpcional(request.telefono());


        if (telefono != null &&
                usuarioRepository.existsByTelefono(telefono)) {

            throw new IllegalArgumentException(
                    "El teléfono ya se encuentra registrado"
            );
        }



        Rol rol = rolRepository.findByNombre(rolNorm).orElseThrow(() ->
                new IllegalStateException(
                        "El rol solicitado no está configurado"
                )
        );



        if (esNegocio) {


            if (request.nombreEmpresa() == null ||
                    request.nombreEmpresa().isBlank()) {

                throw new IllegalArgumentException(
                        "El nombre de la empresa es obligatorio"
                );
            }


            if (request.nit() == null ||
                    request.nit().isBlank()) {

                throw new IllegalArgumentException(
                        "El NIT es obligatorio"
                );
            }


            if (empresaRepository.existsByNit(
                    request.nit().trim()
            )) {

                throw new IllegalArgumentException(
                        "El NIT ya se encuentra registrado"
                );
            }
        }



        Usuario usuario = Usuario.builder()

        .nombres(
                esPromotor
                ? request.nombres()
                : request.nombreEmpresa()
)
        .apellidos(
                esPromotor
                ? normalizarOpcional(request.apellidos())
                : null
)

                .correo(correo)

                .contrasena(
                        passwordEncoder.encode(
                                request.contrasena()
                        )
                )

                .telefono(telefono)

                .activo(true)

                .rol(rol)

                .build();



        usuario = usuarioRepository.save(usuario);



        if (esNegocio) {

            Empresa empresa = Empresa.builder()
                    .nombre(
                            request.nombreEmpresa()
                                    .trim()
                    )

                    .nit(
                            request.nit()
                                    .trim()
                    )

                    .correo(correo)

                    .telefono(telefono)

                    .estado(true)

                    .usuario(usuario)

                    .build();



            empresaRepository.save(empresa);

        }



        return toResponse(usuario);
    }




    private String normalizarOpcional(String valor) {

        return valor == null || valor.isBlank()
                ? null
                : valor.trim();

    }





    private RegisterResponse toResponse(Usuario usuario) {

        return new RegisterResponse(

                usuario.getId(),

                usuario.getNombres(),

                usuario.getApellidos(),

                usuario.getCorreo(),

                usuario.getTelefono(),

                usuario.getActivo(),

                usuario.getRol().getNombre(),

                usuario.getFotoUrl(),

                usuario.getBio()

        );

    }

}