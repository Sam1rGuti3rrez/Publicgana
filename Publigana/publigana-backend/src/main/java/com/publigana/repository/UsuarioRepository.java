package com.publigana.repository;

import com.publigana.entity.Rol;
import com.publigana.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // ===========================
    // Búsquedas
    // ===========================

    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByTelefono(String telefono);

    List<Usuario> findByNombresContainingIgnoreCase(String nombres);

    List<Usuario> findByApellidosContainingIgnoreCase(String apellidos);

    List<Usuario> findByRol(Rol rol);


    // ===========================
    // Activos
    // ===========================

    List<Usuario> findByActivoTrue();

    List<Usuario> findByActivoFalse();

    List<Usuario> findByRolAndActivoTrue(Rol rol);

    Optional<Usuario> findByIdAndActivoTrue(UUID id);
    // ===========================
    // Validaciones
    // ===========================

    boolean existsByCorreo(String correo);

    boolean existsByTelefono(String telefono);

}