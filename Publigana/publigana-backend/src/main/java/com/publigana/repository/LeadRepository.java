package com.publigana.repository;

import com.publigana.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface LeadRepository extends JpaRepository<Lead, UUID> {

    boolean existsByCorreo(String correo);
}
