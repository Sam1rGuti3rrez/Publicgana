# Base de datos y Prisma

## Configuración

El esquema declara PostgreSQL. Prisma ORM 7 genera el cliente en `app/generated/prisma`; la aplicación usa el adaptador `PrismaPg` de `@prisma/adapter-pg` y el driver `pg`. `prisma.config.ts` apunta a `prisma/schema.prisma`, configura el seed y obtiene `DATABASE_URL`.

No se verificó durante esta actualización qué instancia/bifurcación de Neon utiliza producción, ni su estado actual. No expongas ni copies URLs de conexión. La estructura descrita a continuación corresponde al esquema del repositorio salvo que se indique expresamente que se trata de una observación previa de una base.

## Modelos declarados

El esquema Prisma declara estos modelos:

| Modelo | Función y relaciones principales |
| --- | --- |
| `Rol` | Catálogo textual de roles; relación uno-a-muchos con `Usuario`. |
| `Usuario` | Cuenta, perfil, hash de contraseña, estado, rol y ubicación declarada; se relaciona con empresas, campañas, participaciones, ganadores, notificaciones y auditorías. |
| `CategoriaEmpresa` | Categoría de empresa. |
| `Empresa` | Datos del negocio, NIT único y relaciones opcionales con categoría y usuario; contiene publicaciones. |
| `Categoria` | Categorías para campañas. |
| `RedSocial` | Catálogo de redes relacionado con campañas. |
| `CampaniaRedSocial` | Tabla puente con clave compuesta para campaña y red social. |
| `Campania` | Datos de campaña; pertenece a categoría y usuario creador y se relaciona con premios, participaciones, redes y, opcionalmente, un sorteo. |
| `Premio` | Premio de campaña con cantidad y valor referencial. |
| `Participacion` | Participación de usuario en campaña; tiene código único y evidencias. |
| `EvidenciaParticipacion` | Evidencia vinculada a una participación. |
| `Sorteo` | Sorteo asociado a una campaña; `campaniaId` es único. |
| `Ganador` | Ganador relacionado con sorteo, usuario y premio. |
| `Notificacion` | Notificación vinculada a usuario. |
| `Auditoria` | Registro de acciones; el usuario responsable es opcional y `entidadId` no tiene relación Prisma declarada. |
| `publicacion` | Publicación de empresa, ligada a `Empresa`. |
| `flyway_schema_history` | Modelo del ledger legado Flyway, sin relaciones Prisma declaradas. |
| `leads` | Contactos/interés; correo único y ubicación geográfica opcional en esquema. |

Las columnas de rol, estado y tipo son principalmente `String`; no se declaran enums Prisma para ellas. Las acciones válidas dependen de las validaciones de aplicación.

### Ubicación geográfica

`Usuario` y `leads` declaran `countryCode` (`country_code`, `VARCHAR(2)`), `municipalityCode` (`municipality_code`, `VARCHAR(5)`) y `locality` (`VARCHAR(150)`, opcional). Los checks incluidos en las migraciones:

- aceptan `NULL` en los campos geográficos para tolerar filas existentes;
- cuando no es nulo, exigen `country_code = 'CO'`;
- cuando no es nulo, el código municipal debe tener cinco dígitos y requerir país CO.

El servidor, además, exige confirmación explícita de residencia para los nuevos registros de usuario y leads, y comprueba código municipal y departamento contra el catálogo local. Los checks de base de datos no prueban residencia ni sustituyen esa validación de servidor.

## Relaciones, índices y restricciones

Entre las claves únicas declaradas están `Rol.nombre`, `Usuario.correo`, `CategoriaEmpresa.nombre`, `Empresa.nit`, `Categoria.nombre`, `RedSocial.nombre`, `Participacion.codigoParticipacion`, `Sorteo.campaniaId`, `leads.correo` y la clave compuesta de `CampaniaRedSocial`. Las relaciones y nombres explícitos de FK están definidos en `@relation`; la política declarada usa `NoAction` en varias relaciones.

La definición Prisma no certifica que todos esos objetos existan actualmente en una base concreta. Verifique tablas, tipos, nullabilidad, índices, restricciones y FKs del destino antes de aplicar cambios.

## Dos historiales distintos y estado conocido

**Flyway legado:** una inspección previa de solo lectura informó un ledger `flyway_schema_history` con una entrada exitosa `BASELINE` en versión 1 y seis migraciones exitosas V2–V7 (siete entradas en total). Los checksums de scripts V2–V7 recuperados del historial Git coincidían con los valores de ese ledger. Los scripts originales no forman parte del directorio activo actual. Esto no demuestra equivalencia semántica con ninguna migración Prisma.

**Prisma:** la carpeta activa contiene:

| Migración | Efecto principal |
| --- | --- |
| `0_baseline` | Crea el esquema/tablas, índices y relaciones de base. No debe ejecutarse sobre tablas ya existentes. |
| `20260920030123_init` | Añade `empresa.nit`, historial Flyway y `leads`, altera `usuario`, índices. Incluye riesgos si se ejecuta donde esos objetos o datos ya existen. |
| `20261013000000_user_colombian_residency` | Añade `country_code` y su check a `usuario`. |
| `20261013000001_lead_colombian_residency` | Añade `country_code` y su check a `leads`. |
| `20261013000002_colombian_municipalities` | Añade códigos municipales y checks a `usuario` y `leads`. |
| `20261013000003_optional_location_detail` | Añade `locality` opcional a `usuario` y `leads`. |

**Estado observado anteriormente en Neon, no revalidado en esta tarea:** no se encontró `_prisma_migrations`; el ledger Flyway tenía siete ejecuciones exitosas. La estructura inspeccionada entonces carecía de las tres columnas geográficas en `usuario`/`leads`; también se informó `empresa.nit` como `VARCHAR(50) NULL`, frente a `VARCHAR(30) NOT NULL` en la migración Prisma inicial. Más adelante se reportó que las columnas geográficas y los cuatro checks fueron agregados directamente en Neon y que el registro de leads volvió a funcionar. No se volvió a consultar el destino ni Vercel para confirmar que esa base sea la actualmente usada por producción.

La migración `0_baseline` y `20260920030123_init` no deben marcarse como aplicadas ni ejecutarse por la mera existencia de tablas. El baseline/init no representan sin más el esquema real y el ledger Flyway no es un historial Prisma. La reconciliación del historial, la equivalencia exacta de índices/FKs y el esquema de producción siguen pendientes.

### Precauciones antes de cambiar el esquema

1. Confirmar con administración qué rama/endpoint Neon corresponde al entorno objetivo y si coincide con la configuración de Vercel, sin mostrar secretos.
2. Respaldar y ensayar en una rama de prueba restaurada; comparar esquema completo y conteos/integridad antes y después.
3. Revisar SQL, checksums, datos existentes, nulabilidad, índices y FKs; no ejecutar el baseline sobre tablas existentes.
4. Definir un historial Prisma consistente y reproducible para bases nuevas, incluyendo datos de roles requeridos y estrategia segura de bootstrap.
5. Usar `prisma migrate resolve` solo tras evidencia objetiva de que cada efecto completo de esa migración ya existe y tras aprobar el procedimiento. No se ejecutó ningún comando de migración durante esta actualización.

`empresa.nit`, índices y FKs son discrepancias independientes: no alterarlos como requisito para resolver el funcionamiento de leads sin demostrar la necesidad.

## SQL paralelo y seed

`Publigana/publigana-database` contiene archivos SQL y un respaldo. Su README histórico tenía una referencia de nombre de archivo que no coincide con el directorio. No se ha demostrado que esos artefactos sean el esquema fuente actual ni que reproduzcan todas las migraciones Prisma.

Existe `prisma/seed.ts` y `prisma.config.ts` lo referencia como seed. El seed hace upsert de una cuenta ADMIN con credencial fija en el código: **no lo ejecutes en una base compartida o de producción**. Se requiere reemplazar/gestionar ese bootstrap de forma segura en una tarea aparte antes de recomendarlo para nuevos entornos.
