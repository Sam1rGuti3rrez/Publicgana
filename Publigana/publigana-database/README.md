# Artefactos SQL históricos

Este directorio contiene scripts SQL y respaldos históricos de PostgreSQL. No se ha demostrado que sus archivos reproduzcan exactamente el esquema actual de Prisma ni el estado actual de Neon.

No ejecutes estos scripts sobre una base existente o compartida sin revisar el contenido, identificar el destino, obtener un respaldo y probar el procedimiento en una copia aislada. No uses un respaldo como fuente vigente hasta que su fecha, integridad y relación con el esquema actual hayan sido confirmadas.

Para modelos, configuración Prisma y el estado conocido de la reconciliación Flyway/Prisma, consulta [Base de datos y Prisma](../../docs/DATABASE.md). Esta documentación no ejecuta SQL ni certifica un servidor.
