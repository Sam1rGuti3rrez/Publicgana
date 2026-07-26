package com.publigana.controller;

import com.publigana.dto.empresa.request.EmpresaCreateRequest;
import com.publigana.dto.empresa.request.EmpresaUpdateRequest;
import com.publigana.dto.empresa.response.EmpresaResponse;
import com.publigana.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    public ResponseEntity<EmpresaResponse> crear(@Valid @RequestBody EmpresaCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<EmpresaResponse>> listar() {
        return ResponseEntity.ok(empresaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaUpdateRequest request
    ) {
        return ResponseEntity.ok(empresaService.actualizar(id, request));
    }
}
