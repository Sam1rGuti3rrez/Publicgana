package com.publigana.controller;

import com.publigana.dto.lead.request.LeadRequest;
import com.publigana.dto.lead.response.LeadResponse;

import com.publigana.service.LeadService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {


    private final LeadService leadService;


    @PostMapping
    public ResponseEntity<LeadResponse> registrar(
            @Valid @RequestBody LeadRequest request
    ){


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(leadService.registrar(request));

    }
}
