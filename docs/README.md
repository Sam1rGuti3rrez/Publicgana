# Documentación técnica de PubliGana

## Propósito y alcance

Esta documentación describe el estado comprobado del repositorio PubliGana, que contiene una aplicación web Next.js, una aplicación móvil Expo/React Native y artefactos SQL relacionados con PostgreSQL. Separa el comportamiento implementado de los aspectos que requieren confirmación o trabajo adicional.

La raíz Git está en el directorio que contiene `Publigana/`. Las rutas de código citadas en estos documentos son relativas a ese directorio.

## Índice

- [Arquitectura](ARCHITECTURE.md): componentes, persistencia, comunicación y relaciones verificadas.
- [Puesta en marcha](SETUP.md): versiones, entorno, instalación, ejecución y comandos.
- [Base de datos](DATABASE.md): modelos Prisma, claves, relaciones e historial de migraciones.
- [API](API.md): rutas existentes, contratos observados, respuestas y autenticación.
- [Seguridad](SECURITY.md): secretos, tokens, autorización, riesgos observados y recomendaciones.
- [Aplicación móvil](MOBILE.md): Expo Router, pantallas, estado de autenticación y comunicación con el backend.
- [Decisiones técnicas](DECISIONS.md): registro de decisiones y plantilla ADR; no se atribuyen propuestas como acuerdos.
- [Changelog](../CHANGELOG.md): cambios técnicos con evidencia en el historial disponible, sin versiones de release inventadas.

## Convenciones

- **Implementado** describe comportamiento visible en el código.
- **Comprobado** identifica versiones, comandos o rutas contrastados directamente.
- **Pendiente de verificar** marca información que el repositorio no permite concluir.
- Los ejemplos de configuración usan marcadores y no contienen credenciales reales.
- La documentación no sustituye la revisión de esquema, permisos o configuración antes de un despliegue.
