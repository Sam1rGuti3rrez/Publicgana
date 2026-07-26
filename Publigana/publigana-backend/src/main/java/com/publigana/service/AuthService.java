package com.publigana.service;

import com.publigana.dto.auth.request.RegisterRequest;
import com.publigana.dto.auth.response.RegisterResponse;
import com.publigana.entity.Rol;
import com.publigana.entity.Usuario;
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

    public AuthService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse registrar(RegisterRequest request) {
        String correo = request.correo().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado");
        }

        Rol rol = rolRepository.findByNombre(request.rol().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalStateException("El rol solicitado no está configurado"));

        Usuario usuario = Usuario.builder()
                .nombres(request.nombres().trim())
                .apellidos(normalizarOpcional(request.apellidos()))
                .correo(correo)
                .contrasena(passwordEncoder.encode(request.contrasena()))
                .telefono(normalizarOpcional(request.telefono()))
                .activo(true)
                .rol(rol)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    private String normalizarOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
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
