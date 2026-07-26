package com.publigana.service;

import com.publigana.dto.empresa.request.EmpresaCreateRequest;
import com.publigana.dto.empresa.request.EmpresaUpdateRequest;
import com.publigana.dto.empresa.response.EmpresaResponse;
import com.publigana.entity.CategoriaEmpresa;
import com.publigana.entity.Empresa;
import com.publigana.entity.Usuario;
import com.publigana.exception.RecursoNoEncontradoException;
import com.publigana.repository.CategoriaEmpresaRepository;
import com.publigana.repository.EmpresaRepository;
import com.publigana.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaEmpresaRepository categoriaEmpresaRepository;

    public EmpresaService(
            EmpresaRepository empresaRepository,
            UsuarioRepository usuarioRepository,
            CategoriaEmpresaRepository categoriaEmpresaRepository
    ) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaEmpresaRepository = categoriaEmpresaRepository;
    }

    @Transactional
    public EmpresaResponse crear(EmpresaCreateRequest request) {
        Empresa empresa = Empresa.builder()
                .nombre(request.nombre().trim())
                .descripcion(normalizarOpcional(request.descripcion()))
                .direccion(normalizarOpcional(request.direccion()))
                .telefono(normalizarOpcional(request.telefono()))
                .correo(normalizarOpcional(request.correo()))
                .logo(normalizarOpcional(request.logo()))
                .sitioWeb(normalizarOpcional(request.sitioWeb()))
                .estado(true)
                .usuario(obtenerUsuario(request.usuarioId()))
                .categoria(obtenerCategoria(request.categoriaId()))
                .build();

        return aResponse(empresaRepository.save(empresa));
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listar() {
        return empresaRepository.findAll().stream()
                .map(this::aResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpresaResponse obtenerPorId(Long id) {
        return aResponse(obtenerEmpresa(id));
    }

    @Transactional
    public EmpresaResponse actualizar(Long id, EmpresaUpdateRequest request) {
        Empresa empresa = obtenerEmpresa(id);
        empresa.setNombre(request.nombre().trim());
        empresa.setDescripcion(normalizarOpcional(request.descripcion()));
        empresa.setDireccion(normalizarOpcional(request.direccion()));
        empresa.setTelefono(normalizarOpcional(request.telefono()));
        empresa.setCorreo(normalizarOpcional(request.correo()));
        empresa.setLogo(normalizarOpcional(request.logo()));
        empresa.setSitioWeb(normalizarOpcional(request.sitioWeb()));
        empresa.setEstado(request.estado());
        empresa.setUsuario(obtenerUsuario(request.usuarioId()));
        empresa.setCategoria(obtenerCategoria(request.categoriaId()));

        return aResponse(empresaRepository.save(empresa));
    }

    private Empresa obtenerEmpresa(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empresa no encontrada: " + id));
    }

    private Usuario obtenerUsuario(UUID usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + usuarioId));
    }

    private CategoriaEmpresa obtenerCategoria(Long categoriaId) {
        if (categoriaId == null) {
            return null;
        }
        return categoriaEmpresaRepository.findById(categoriaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría de empresa no encontrada: " + categoriaId));
    }

    private String normalizarOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private EmpresaResponse aResponse(Empresa empresa) {
        CategoriaEmpresa categoria = empresa.getCategoria();
        return new EmpresaResponse(
                empresa.getId(),
                empresa.getNombre(),
                empresa.getDescripcion(),
                empresa.getDireccion(),
                empresa.getTelefono(),
                empresa.getCorreo(),
                empresa.getLogo(),
                empresa.getSitioWeb(),
                empresa.getEstado(),
                empresa.getFechaRegistro(),
                empresa.getUsuario().getId(),
                categoria == null ? null : categoria.getId(),
                categoria == null ? null : categoria.getNombre()
        );
    }
}
