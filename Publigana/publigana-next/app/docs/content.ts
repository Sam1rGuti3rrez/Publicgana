export type DocTable = {
  headers: string[];
  rows: string[][];
};

export type DocBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; table: DocTable }
  | { kind: "code"; language: string; code: string }
  | { kind: "callout"; title: string; text: string; tone?: "note" | "warning" };

export type DocSection = {
  id: string;
  title: string;
  blocks: DocBlock[];
};

export type DocPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  sections: DocSection[];
};

export const docsPages: DocPage[] = [
  {
    slug: "introduccion",
    title: "Documentación técnica",
    eyebrow: "PubliGana / Manual del proyecto",
    description:
      "Una guía práctica para entender la plataforma, preparar el entorno y trabajar con sus módulos web, móvil y de datos.",
    keywords: ["inicio", "overview", "proyecto", "stack", "visión", "resumen"],
    sections: [
      {
        id: "que-es-publigana",
        title: "¿Qué es PubliGana?",
        blocks: [
          {
            kind: "paragraph",
            text: "PubliGana reúne una aplicación web con API propia, un cliente móvil Expo y un esquema relacional PostgreSQL. La web incluye una landing, formularios de interés, autenticación y un dashboard; la app móvil organiza flujos de promotor y empresa.",
          },
          {
            kind: "callout",
            title: "Estado del producto",
            text: "La documentación distingue endpoints funcionales de pantallas demostrativas. Campañas, métricas y paneles móviles incluyen contenido estático y no deben tratarse como operaciones persistidas hasta conectar sus servicios.",
          },
        ],
      },
      {
        id: "tecnologias",
        title: "Tecnologías",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Área", "Tecnologías verificadas"],
              rows: [
                ["Web", "Next.js 16.4.0, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4"],
                ["Datos web", "Prisma ORM / Client 7.10.0, PrismaPg 7.9.1, PostgreSQL"],
                ["Móvil", "Expo 57.0.24, Expo Router 57.0.22, React Native 0.86.3, React 19.2.3"],
                ["Tooling", "Node.js 24.21.0 y npm 11.19.0 en el entorno inspeccionado"],
              ],
            },
          },
          {
            kind: "paragraph",
            text: "Las versiones son las instaladas en el entorno de inspección. Los manifiestos y lockfiles de cada aplicación determinan la instalación reproducible.",
          },
        ],
      },
      {
        id: "mapa-documentacion",
        title: "Explorar la guía",
        blocks: [
          {
            kind: "list",
            items: [
              "Instalación: dependencias, variables de entorno y comandos locales.",
              "Arquitectura: límites entre Next.js, Expo y PostgreSQL.",
              "Frontend y backend: rutas, componentes y comportamiento implementado.",
              "Datos y módulos: modelos Prisma y madurez real de cada dominio.",
              "Referencia: scripts, variables y resolución de problemas frecuentes.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "instalacion",
    title: "Instalación y configuración",
    eyebrow: "01 / Puesta en marcha",
    description:
      "Instala cada aplicación desde su carpeta y configura PostgreSQL sin guardar secretos en Git.",
    keywords: ["setup", "npm", "DATABASE_URL", "JWT_SECRET", "migración", "build"],
    sections: [
      {
        id: "requisitos",
        title: "Requisitos",
        blocks: [
          {
            kind: "list",
            items: [
              "Node.js y npm. Se verificaron Node 24.21.0 y npm 11.19.0; no hay versión mínima declarada en package.json.",
              "PostgreSQL accesible para operaciones de Prisma. Versión, host y credenciales dependen del entorno y deben confirmarse con quien administra la base.",
              "Para compilar o ejecutar móvil nativo, instala y configura las herramientas correspondientes a Expo, Android o iOS.",
            ],
          },
        ],
      },
      {
        id: "instalar-dependencias",
        title: "Instalar dependencias",
        blocks: [
          {
            kind: "paragraph",
            text: "La raíz Git no tiene un package.json. Ejecuta npm ci por separado en los dos proyectos; cada uno mantiene su propio lockfile.",
          },
          {
            kind: "code",
            language: "bash",
            code: "cd Publigana/publigana-next\nnpm ci\n\ncd ../publigana-mobile\nnpm ci",
          },
        ],
      },
      {
        id: "variables-entorno",
        title: "Variables de entorno",
        blocks: [
          {
            kind: "paragraph",
            text: "Crea publigana-next/.env localmente. Sustituye cada marcador usando los datos del administrador; el ejemplo no es una URL real. El .gitignore de la web excluye .env*.",
          },
          {
            kind: "code",
            language: "dotenv",
            code: "DATABASE_URL=\"postgresql://USUARIO:CONTRASENA@localhost:5432/publigana?schema=public\"\nJWT_SECRET=\"SECRETO_ALEATORIO_LARGO\"",
          },
          {
            kind: "callout",
            title: "Mantén los secretos fuera del cliente",
            text: "DATABASE_URL y JWT_SECRET son variables del servidor. No uses prefijos EXPO_PUBLIC_ ni las insertes en componentes cliente. La URL base móvil, por otro lado, está codificada actualmente en src/services/api.ts y todavía no está externalizada por entorno.",
            tone: "warning",
          },
        ],
      },
      {
        id: "postgres-prisma",
        title: "PostgreSQL y Prisma",
        blocks: [
          {
            kind: "paragraph",
            text: "prisma.config.ts carga dotenv/config y exige DATABASE_URL para los comandos CLI. El cliente genera código en app/generated/prisma y usa el adaptador @prisma/adapter-pg. Comprueba qué base y qué procedimiento de migración corresponden a tu entorno antes de alterar datos.",
          },
          {
            kind: "code",
            language: "bash",
            code: "npx prisma generate\nnpx prisma migrate dev\n\n# En despliegues con migraciones aprobadas\nnpx prisma migrate deploy",
          },
          {
            kind: "callout",
            title: "Dos fuentes de SQL",
            text: "Hay una línea base y una migración Prisma, además de scripts SQL independientes en publigana-database. Su sincronización no está comprobada; no mezcles los flujos sin validar respaldo y estado de la base.",
            tone: "warning",
          },
        ],
      },
      {
        id: "ejecucion-build",
        title: "Desarrollo y producción",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Comando", "Resultado"],
              rows: [
                ["npm run dev", "Inicia Next.js en desarrollo."],
                ["npm run lint", "Ejecuta ESLint en la web."],
                ["npx tsc --noEmit", "Comprueba TypeScript; no es un script npm."],
                ["npm run build", "Compila producción; requiere JWT_SECRET con la validación actual."],
                ["npm run start", "Sirve el build de producción."],
                ["cd ../publigana-mobile && npm start", "Inicia Expo desde la carpeta móvil."],
              ],
            },
          },
          {
            kind: "paragraph",
            text: "No se encontraron scripts test, iOS, build ni typecheck en el manifiesto móvil. Configura una URL de API alcanzable desde el dispositivo antes de probar la autenticación.",
          },
        ],
      },
      {
        id: "problemas-frecuentes",
        title: "Problemas frecuentes",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Síntoma", "Revisión"],
              rows: [
                ["Prisma no resuelve DATABASE_URL", "Revisa .env en publigana-next y que Prisma CLI se ejecute desde esa carpeta."],
                ["El build no encuentra JWT_SECRET", "Configura el secreto de servidor en el entorno antes de ejecutar npm run build."],
                ["Health devuelve disconnected", "Revisa conectividad, permisos y existencia de la tabla rol; evita imprimir la URL en logs."],
                ["El móvil no conecta", "La URL es una constante local; usa una dirección alcanzable desde emulador/dispositivo."],
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: "arquitectura",
    title: "Arquitectura",
    eyebrow: "02 / Sistema",
    description:
      "Una vista de los límites entre la web, los Route Handlers, el cliente móvil y PostgreSQL.",
    keywords: ["carpetas", "flujo", "modular", "server", "client", "adapter"],
    sections: [
      {
        id: "raiz-repositorio",
        title: "Estructura del repositorio",
        blocks: [
          {
            kind: "code",
            language: "text",
            code: "Publicgana/\n├── docs/\n└── Publigana/\n    ├── publigana-next/\n    │   ├── app/\n    │   │   ├── api/\n    │   │   ├── components/\n    │   │   ├── dashboard/\n    │   │   ├── docs/\n    │   │   └── lib/\n    │   └── prisma/\n    ├── publigana-mobile/\n    │   └── src/\n    │       ├── app/\n    │       ├── components/\n    │       ├── context/\n    │       └── services/\n    └── publigana-database/",
          },
          {
            kind: "paragraph",
            text: "No hay package.json en la raíz Git. Web y móvil se instalan, ejecutan y validan desde sus respectivas carpetas.",
          },
        ],
      },
      {
        id: "flujo-servidor",
        title: "Flujo de datos web",
        blocks: [
          {
            kind: "list",
            items: [
              "Los Server Components y Client Components viven bajo app/; el formulario de contacto, por ejemplo, llama al endpoint de leads.",
              "Los Route Handlers implementan operaciones HTTP bajo app/api.",
              "Los handlers obtienen el cliente mediante getPrisma() cuando necesitan consultar datos.",
              "PrismaPg conecta Prisma Client con PostgreSQL usando DATABASE_URL; no se configura el adaptador dentro del navegador.",
              "El cliente móvil consume la API HTTP y no conecta directamente a PostgreSQL.",
            ],
          },
          {
            kind: "code",
            language: "text",
            code: "Navegador ──> Next.js App Router ──> Route Handler\n                                      │\n                                      └─> getPrisma() ─> PrismaPg ─> PostgreSQL\n\nExpo / React Native ── HTTP JSON ──> Route Handler",
          },
        ],
      },
      {
        id: "modulos-web",
        title: "Módulos web",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Directorio", "Responsabilidad observada"],
              rows: [
                ["app/", "Páginas, layouts y rutas del App Router."],
                ["app/api/", "Route Handlers de autenticación, usuarios, health, leads y prueba de rol."],
                ["app/components/landing/", "Secciones reutilizables de la landing pública."],
                ["app/lib/", "Inicialización de Prisma, JWT y helpers de autorización."],
                ["app/generated/prisma/", "Prisma Client generado; no editar manualmente."],
                ["prisma/", "Esquema, migraciones y seed."],
              ],
            },
          },
        ],
      },
      {
        id: "limites-confirmados",
        title: "Límites confirmados y pendientes",
        blocks: [
          {
            kind: "paragraph",
            text: "La conexión móvil a campañas, pagos, correo y redes sociales no está confirmada. Los nombres de modelos o de pantallas representan estructuras, no necesariamente procesos de negocio ya disponibles.",
          },
          {
            kind: "callout",
            title: "Pendiente",
            text: "Determinar la fuente de verdad entre migraciones Prisma y los scripts SQL de publigana-database; revisar también el host PostgreSQL y las direcciones de API por entorno.",
          },
        ],
      },
    ],
  },
  {
    slug: "frontend",
    title: "Frontend web",
    eyebrow: "03 / Experiencia web",
    description:
      "Rutas de página, componentes reutilizables, estilos, estado local y comunicación con los Route Handlers.",
    keywords: ["App Router", "React", "Tailwind", "formularios", "client component", "layout"],
    sections: [
      {
        id: "rutas-y-layouts",
        title: "App Router y páginas",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Ruta", "Implementación"],
              rows: [
                ["/", "Landing ensamblada desde app/page.tsx y componentes de landing."],
                ["/dashboard", "Dashboard cliente que solicita /api/usuarios/me y comprueba ADMIN en UI."],
                ["/demo", "Página que muestra public/simulador/app-demo.html dentro de un iframe."],
                ["/docs", "Guía técnica integrada en la aplicación."],
              ],
            },
          },
          {
            kind: "paragraph",
            text: "app/layout.tsx es el layout raíz, define español, metadata y fuentes. La documentación reutiliza ese layout y añade su propio shell de navegación sin duplicar el documento HTML.",
          },
        ],
      },
      {
        id: "componentes-y-estilos",
        title: "Componentes y estilos",
        blocks: [
          {
            kind: "list",
            items: [
              "La landing agrupa secciones en app/components/landing.",
              "Tailwind CSS 4 se carga con @import \"tailwindcss\" y @tailwindcss/postcss.",
              "El tema global define Manrope como sans y Fraunces para display; la landing usa violeta profundo, marfil y acentos dorados.",
              "react-icons ya está instalado y se reutiliza para acciones de navegación y búsqueda.",
              "La sección /docs encapsula sus estilos en CSS Modules para no alterar la landing ni el dashboard.",
            ],
          },
        ],
      },
      {
        id: "formularios-y-estado",
        title: "Formularios y estado",
        blocks: [
          {
            kind: "paragraph",
            text: "El formulario de interés es un Client Component con estado React local; envía POST /api/leads, muestra el resultado y limpia los campos al éxito. La validación se realiza tanto en cliente HTML como en el handler.",
          },
          {
            kind: "callout",
            title: "Dashboard",
            text: "El dashboard obtiene el token desde localStorage y consulta /api/usuarios/me. El control de rol que muestra o bloquea contenido en esa pantalla no sustituye autorización de servidor; el endpoint de usuarios actual no comprueba rol.",
            tone: "warning",
          },
        ],
      },
      {
        id: "accesibilidad-responsive",
        title: "Diseño adaptable y accesibilidad",
        blocks: [
          {
            kind: "list",
            items: [
              "El nav existente ya implementa menú móvil y retorno de foco al cerrar con Escape.",
              "En /docs, el sidebar pasa a drawer móvil, la búsqueda admite teclado y los enlaces tienen estados focus-visible.",
              "Los artículos usan encabezados jerárquicos, anchors identificables, tablas semánticas y regiones etiquetadas.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "backend",
    title: "Backend y API",
    eyebrow: "04 / Route Handlers",
    description:
      "Contratos observados en las rutas existentes, límites de validación y reglas de autenticación.",
    keywords: ["API", "endpoint", "JWT", "bcrypt", "roles", "CORS", "validación"],
    sections: [
      {
        id: "rutas-existentes",
        title: "Rutas implementadas",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Método y ruta", "Uso observado", "Acceso"],
              rows: [
                ["POST /api/auth/register", "Registra promotor o negocio; crea empresa para negocio.", "Público"],
                ["POST /api/auth/login", "Comprueba bcrypt, actualiza último acceso y emite JWT.", "Público"],
                ["GET /api/usuarios/me", "Devuelve perfil del usuario activo.", "Bearer JWT"],
                ["GET /api/usuarios", "Lista datos seleccionados de usuarios.", "Sin auth en el handler"],
                ["GET /api/health", "Prueba una consulta a Rol.", "Público"],
                ["POST /api/leads", "Valida y crea un lead.", "Público"],
                ["GET /api/test/admin", "Comprueba el rol ADMIN.", "Bearer JWT + ADMIN"],
              ],
            },
          },
        ],
      },
      {
        id: "validacion-errores",
        title: "Validación y errores",
        blocks: [
          {
            kind: "list",
            items: [
              "Registro acepta rol promotor o negocio, exige correo, contraseña y teléfono; exige nombres/apellidos o nombreEmpresa/NIT según rol y una contraseña de al menos 8 caracteres.",
              "Leads exige nombre, correo con formato básico, ciudad y tipoUsuario igual a usuario o negocio; correo duplicado devuelve 400.",
              "Login diferencia ausencia de credenciales (400) de credenciales no válidas (401). Errores internos normalmente devuelven 500.",
              "No se encontró un validador de esquema común. JSON inválido u otros errores inesperados pueden terminar en 500.",
            ],
          },
        ],
      },
      {
        id: "autenticacion-autorizacion",
        title: "Autenticación y permisos",
        blocks: [
          {
            kind: "paragraph",
            text: "JWT_SECRET se usa para firmar y verificar tokens. Access tokens expiran en una hora y refresh tokens en siete días; no se encontró un endpoint de renovación. requireRole compara el rol vigente leído de la base y solo se usa explícitamente en /api/test/admin.",
          },
          {
            kind: "callout",
            title: "Revisión antes de producción",
            text: "GET /api/usuarios no exige autenticación en el handler y retorna correos y teléfonos. Revisa este acceso, los logs de login y las diferencias de casing de roles antes de exponer el servicio.",
            tone: "warning",
          },
        ],
      },
      {
        id: "operaciones-negocio",
        title: "Operaciones de negocio confirmadas",
        blocks: [
          {
            kind: "list",
            items: [
              "Registro crea usuario y, si corresponde, empresa dentro de una transacción Prisma.",
              "Login verifica el hash con bcrypt y persiste ultimoAcceso.",
              "Leads realiza una consulta por correo antes de crear el registro.",
              "No se encontraron Route Handlers CRUD para campañas, premios, sorteos, publicaciones o participaciones.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "base-de-datos",
    title: "Base de datos y Prisma",
    eyebrow: "05 / Persistencia",
    description:
      "PostgreSQL, adaptador PrismaPg, modelos, cardinalidades y migraciones disponibles en el repositorio.",
    keywords: ["Prisma", "PostgreSQL", "getPrisma", "modelo", "migraciones", "CRUD", "SQL"],
    sections: [
      {
        id: "configuracion-prisma",
        title: "Configuración del cliente",
        blocks: [
          {
            kind: "paragraph",
            text: "El schema define provider postgresql y genera Prisma Client en app/generated/prisma. app/lib/prisma.ts exporta getPrisma(), valida DATABASE_URL al invocarse, crea PrismaPg y reutiliza una instancia global en desarrollo.",
          },
          {
            kind: "code",
            language: "typescript",
            code: "import { getPrisma } from \"@/app/lib/prisma\";\n\nexport async function findUserByEmail(correo: string) {\n  const prisma = getPrisma();\n\n  return prisma.usuario.findUnique({\n    where: { correo },\n    include: { rol: true },\n  });\n}",
          },
          {
            kind: "callout",
            title: "Solo servidor",
            text: "No importes getPrisma desde Client Components. El adaptador pg y DATABASE_URL pertenecen al servidor y no deben empaquetarse en navegador.",
            tone: "warning",
          },
        ],
      },
      {
        id: "inventario-modelos",
        title: "Inventario de modelos",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Modelo", "Claves/campos relevantes", "Relaciones declaradas"],
              rows: [
                ["Rol", "idRol; nombre único", "Usuarios"],
                ["Usuario", "id UUID; correo único; activo; rolId", "Rol, empresa, campañas, participación, ganadores, notificaciones, auditorías"],
                ["CategoriaEmpresa", "idCategoria BigInt; nombre único", "Empresas"],
                ["Empresa", "idEmpresa BigInt; NIT único", "Categoría empresa opcional, usuario opcional, publicaciones"],
                ["Categoria", "id UUID; nombre único", "Campañas"],
                ["RedSocial", "id UUID; nombre único", "Campanias mediante CampaniaRedSocial"],
                ["Campania", "id UUID; fechas; activa", "Creador Usuario, Categoria, redes, participaciones, premios, Sorteo opcional"],
                ["CampaniaRedSocial", "Clave compuesta campaniaId/redSocialId", "Campania y RedSocial"],
                ["Premio", "id UUID; cantidadDisponible", "Campania, ganadores"],
                ["Participacion", "id UUID; codigoParticipacion único", "Usuario, Campania, evidencias"],
                ["EvidenciaParticipacion", "id UUID; urlArchivo", "Participacion"],
                ["Sorteo", "id UUID; campaniaId único", "Campania, ganadores"],
                ["Ganador", "id UUID; fechaSeleccion", "Sorteo, Usuario y Premio"],
                ["Notificacion", "id UUID; leida", "Usuario"],
                ["Auditoria", "id UUID; entidadId", "Usuario responsable opcional"],
                ["publicacion", "id UUID; empresa_id", "Empresa"],
                ["flyway_schema_history", "installed_rank; success", "Sin relaciones Prisma"],
                ["leads", "id UUID; correo único", "Sin relaciones Prisma"],
              ],
            },
          },
        ],
      },
      {
        id: "relaciones-integridad",
        title: "Relaciones e integridad",
        blocks: [
          {
            kind: "list",
            items: [
              "CampaniaRedSocial modela una relación muchos-a-muchos con clave primaria compuesta.",
              "Sorteo.campaniaId es único: el esquema limita a un sorteo por campaña.",
              "Empresa puede tener referencias opcionales a Usuario y CategoriaEmpresa; Auditoria.usuarioResponsableId también es opcional.",
              "No hay enums Prisma: roles, estados y tipos se representan como String.",
              "La línea base SQL declara foreign keys ON DELETE NO ACTION y ON UPDATE NO ACTION.",
            ],
          },
        ],
      },
      {
        id: "migraciones-consultas",
        title: "Migraciones y consultas",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Migración", "Cambios observados"],
              rows: [
                ["0_baseline", "Crea esquema public, tablas, claves, índices y relaciones iniciales."],
                ["20260920030123_init", "Añade nit, leads, flyway_schema_history y cambia columnas/índices."],
              ],
            },
          },
          {
            kind: "code",
            language: "typescript",
            code: "const lead = await prisma.leads.create({\n  data: {\n    id: crypto.randomUUID(),\n    nombre,\n    correo,\n    ciudad,\n    tipo_usuario: tipoUsuario,\n  },\n});",
          },
          {
            kind: "callout",
            title: "Módulos no equivalen a CRUD",
            text: "Los modelos de campañas, publicaciones, sorteos y otros dominios están en el esquema, pero no se encontraron endpoints CRUD que los operen. Los archivos SQL paralelos tampoco se han verificado como sincronizados con Prisma.",
            tone: "warning",
          },
        ],
      },
    ],
  },
  {
    slug: "modulos",
    title: "Módulos funcionales",
    eyebrow: "06 / Estado por dominio",
    description:
      "Qué entidades y flujos existen hoy, y cuáles son solo estructura de datos o pantallas de demostración.",
    keywords: ["usuario", "rol", "campaña", "empresa", "red social", "premio", "sorteo", "lead"],
    sections: [
      {
        id: "estado-modulos",
        title: "Matriz de madurez",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Dominio", "Evidencia", "Estado observado"],
              rows: [
                ["Usuarios y roles", "Usuario/Rol en Prisma; registro, login, /usuarios/me y guard ADMIN de prueba.", "Autenticación parcial; autorización por rol solo explícita en endpoint de prueba."],
                ["Empresas", "Modelo Empresa; registro de negocio crea Empresa en una transacción.", "Alta básica implementada; CRUD no encontrado."],
                ["Categorías", "Categoria y CategoriaEmpresa en Prisma.", "Modelo; endpoints no encontrados."],
                ["Campañas", "Campania y CampaniaRedSocial; pantallas móviles con datos locales.", "Esquema y UI demo; endpoints de dominio no encontrados."],
                ["Participaciones/evidencias", "Participacion y EvidenciaParticipacion.", "Modelo; endpoints no encontrados."],
                ["Premios, sorteos y ganadores", "Premio, Sorteo y Ganador.", "Modelos; flujo de sorteo no encontrado."],
                ["Notificaciones y auditoría", "Notificacion y Auditoria.", "Modelos; servicios/endpoints no encontrados."],
                ["Publicaciones", "publicacion y relación con Empresa.", "Modelo; endpoints de publicación no encontrados."],
                ["Leads", "Formulario landing y POST /api/leads.", "Creación y unicidad de correo implementadas."],
              ],
            },
          },
        ],
      },
      {
        id: "roles-reales",
        title: "Roles que aparecen en el código",
        blocks: [
          {
            kind: "list",
            items: [
              "La tabla Rol almacena nombre como String único; no existe enum de roles.",
              "El seed crea ADMIN, promotor y negocio; el registro acepta promotor y negocio sin distinguir mayúsculas al consultar.",
              "El dashboard y endpoint de prueba reconocen ADMIN. La app móvil espera PROMOTOR/NEGOCIO mayúsculos en sus tipos y navegación.",
              "La política de permisos de cada módulo no está implementada completamente; no infieras permisos por las pestañas o pantallas.",
            ],
          },
          {
            kind: "callout",
            title: "Pendiente de contrato",
            text: "Unificar casing y valores de rol entre seed, registro, login y móvil. El parámetro de bienvenida rol=empresa tampoco coincide con negocio, que es lo que acepta el API.",
            tone: "warning",
          },
        ],
      },
      {
        id: "modulos-moviles",
        title: "Qué usa el cliente móvil",
        blocks: [
          {
            kind: "paragraph",
            text: "AuthService conecta registro, login y consulta del usuario. Los servicios de campañas, empresa, promotor y usuario son archivos vacíos. Los dashboards observados usan constantes locales; el formulario de campaña muestra una alerta en vez de persistir los datos.",
          },
        ],
      },
    ],
  },
  {
    slug: "referencia",
    title: "Referencia técnica",
    eyebrow: "07 / Consulta rápida",
    description:
      "Scripts reales, variables de servidor, funciones centrales y guía de diagnóstico.",
    keywords: ["comandos", "scripts", "getPrisma", "DATABASE_URL", "JWT_SECRET", "troubleshooting"],
    sections: [
      {
        id: "scripts-web",
        title: "Scripts npm web",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Comando", "Descripción"],
              rows: [
                ["npm run dev", "Next.js desarrollo."],
                ["npm run build", "Build optimizado; requiere JWT_SECRET según la validación actual."],
                ["npm run start", "Servidor de producción."],
                ["npm run lint", "ESLint."],
                ["npx tsc --noEmit", "TypeScript; comando directo."],
                ["npx prisma generate", "Generación de cliente; el config de Prisma exige DATABASE_URL."],
                ["npx prisma migrate dev", "Desarrollo de migraciones; requiere revisar el target."],
                ["npx prisma migrate deploy", "Aplicar migraciones existentes en despliegue."],
              ],
            },
          },
        ],
      },
      {
        id: "variables-servidor",
        title: "Variables de entorno",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Nombre", "Consumidor", "Exposición"],
              rows: [
                ["DATABASE_URL", "Prisma config y PrismaPg", "Solo servidor; no versionar."],
                ["JWT_SECRET", "app/lib/jwt.ts", "Solo servidor; secreto aleatorio y privado."],
                ["URL API móvil", "Constante en src/services/api.ts", "No está externalizada como variable."],
              ],
            },
          },
        ],
      },
      {
        id: "funciones-importantes",
        title: "Funciones centrales",
        blocks: [
          {
            kind: "table",
            table: {
              headers: ["Función", "Responsabilidad"],
              rows: [
                ["getPrisma()", "Valida DATABASE_URL y entrega el cliente PrismaPg compartido."],
                ["verifyToken(token)", "Verifica JWT y devuelve userId/rol validados."],
                ["getAuthenticatedUser(request)", "Valida Bearer token y busca usuario activo."],
                ["requireRole(request, role)", "Agrega comparación contra el rol actual de base."],
              ],
            },
          },
        ],
      },
      {
        id: "diagnostico",
        title: "Diagnóstico rápido",
        blocks: [
          {
            kind: "list",
            items: [
              "DATABASE_URL ausente: revisa .env local o secretos del entorno; nunca la imprimas en logs.",
              "JWT_SECRET ausente: la importación de app/lib/jwt.ts falla claramente.",
              "Prisma no puede cargar el config: ejecuta CLI desde publigana-next con DATABASE_URL disponible.",
              "401: revisa formato Bearer, firma, expiración, claims y estado activo del usuario.",
              "403 en /api/test/admin: identidad válida pero el rol actual no coincide con ADMIN.",
              "Móvil sin respuesta: comprueba que el host de API sea alcanzable desde el dispositivo y que CORS corresponda a la ruta/cliente.",
            ],
          },
        ],
      },
    ],
  },
];

export const docsPageGroups = [
  { title: "Primeros pasos", slugs: ["introduccion", "instalacion"] },
  { title: "Aplicación", slugs: ["arquitectura", "frontend", "backend"] },
  { title: "Datos y referencia", slugs: ["base-de-datos", "modulos", "referencia"] },
];

export function getDocsPage(slug: string): DocPage | undefined {
  return docsPages.find((page) => page.slug === slug);
}

export function getDocsHref(page: DocPage): string {
  return page.slug === "introduccion" ? "/docs" : `/docs/${page.slug}`;
}