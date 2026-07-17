# Publigana Backend Documentation

Documentacion oficial del proyecto Publigana Backend construida con MkDocs Material.

## Requisitos

- Python 3.11 o superior
- pip actualizado

## Instalacion local

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Ejecutar en desarrollo

```bash
mkdocs serve
```

La documentacion quedara disponible en `http://127.0.0.1:8000`.

## Build de produccion

```bash
mkdocs build --strict
```

El sitio estatico se genera en la carpeta `site/`.

## Publicar en GitHub Pages

```bash
mkdocs gh-deploy --clean
```

## Versionado (preparado con mike)

La configuracion ya deja preparado el proveedor de versionado en `mkdocs.yml`.
Para habilitar flujo de versiones en CI/CD, se recomienda incorporar `mike` en el pipeline de despliegue.

## Estructura principal

- `docs/`: contenido de la documentacion
- `docs/assets/`: recursos estaticos
- `mkdocs.yml`: configuracion central del sitio
- `requirements.txt`: dependencias de documentacion

## Objetivo editorial

Esta documentacion se mantiene como referencia profesional para:

- Arquitectura del backend
- Manual del desarrollador
- Estandares de calidad y seguridad
- Material de onboarding tecnico
