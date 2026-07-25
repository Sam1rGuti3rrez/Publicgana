package com.publigana.service;

import com.publigana.dto.lead.request.LeadRequest;
import com.publigana.dto.lead.response.LeadResponse;

import com.publigana.entity.Lead;

import com.publigana.repository.LeadRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeadService {


    private final LeadRepository leadRepository;

    @Transactional
    public LeadResponse registrar(LeadRequest request) {

        if(leadRepository.existsByCorreo(request.correo())){
            throw new IllegalArgumentException("El correo ya existe"

            );
        }

        Lead lead = Lead.builder()
                .nombre(request.nombre())
                .correo(request.correo())
                .ciudad(request.ciudad())
                .tipoUsuario(request.tipoUsuario())

                .build();

        Lead guardado =  leadRepository.save(lead);

        return new LeadResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getCorreo(),
                guardado.getCiudad(),
                guardado.getTipoUsuario()

        );
    }
}
