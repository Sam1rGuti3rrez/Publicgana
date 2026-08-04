package com.publigana.controller;

import com.publigana.dto.auth.request.RegisterRequest;
import com.publigana.dto.auth.response.RegisterResponse;
import com.publigana.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registrar(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = authService.registrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}