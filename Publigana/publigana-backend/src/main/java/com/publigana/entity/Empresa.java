package com.publigana.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "empresa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private String id;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String direccion;

    private String telefono;

    private String correo;

    private String logo;

    @Column(name = "sitio_web")
    private String sitioWeb;

    private Boolean estado;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private CategoriaEmpresa categoria;

    @OneToMany(mappedBy = "empresa")
    private List<Publicacion> publicaciones;
}
