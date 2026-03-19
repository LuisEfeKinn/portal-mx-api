# Portal MX API — Estado del Proyecto

> Última actualización: 2026-03-19
> Rama activa: `develop`

---

## Resumen ejecutivo

API para el **Portal de Exámenes** de la SEP. Construida sobre una plantilla base NestJS limpiada de un marketplace anterior. Tiene autenticación JWT + Google OAuth, gestión de usuarios con RBAC, convocatorias, hitos, recursos y cargue masivo asíncrono de usuarios desde Excel.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 10 |
| ORM | TypeORM |
| Base de datos | MariaDB |
| Auth | JWT (access + refresh token) + Google OAuth |
| Archivos | AWS S3 |
| Correo | SMTP con MJML / Handlebars |
| Docs API | Swagger (`/api/docs`) con basic auth |
| Linting | Biome |

---

## Arquitectura por capas

```
Controller → UseCase → Service → Repository → Entity → DB
```

---

## Módulos implementados

### 1. `auth` — Autenticación

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/auth/sign-in` | POST | No | Login con email/password |
| `/auth/signup` | POST | No | Registro de usuario (asigna rol `user`) |
| `/auth/sign-out` | POST | Sí | Invalida el token (blacklist) |
| `/auth/refresh-token` | POST | No | Renueva el access token |
| `/auth/forgot-password` | POST | No | Envía correo de restablecimiento |
| `/auth/change-password` | POST | Sí | Cambia contraseña del usuario logueado |
| `/auth/google/login` | GET | No | Inicia OAuth con Google |
| `/auth/google/callback` | GET | No | Callback de Google OAuth |

---

### 2. `user` — Usuarios y Roles

#### Usuarios

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/users` | GET | Sí | Lista paginada (`page`, `perPage`, `search`) |
| `/users/init-data` | GET | Sí | Datos del usuario logueado + menú de permisos |
| `/users` | POST | Sí | Crear usuario manualmente |
| `/users/:id` | GET | Sí | Detalle de usuario |
| `/users/:id` | PATCH | Sí | Actualizar perfil |
| `/users/:id` | DELETE | Sí | Soft delete |
| `/users/:id/password` | PATCH | Sí | Cambiar contraseña de usuario específico |

#### Roles y Permisos

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/roles` | GET | Sí | Lista paginada de roles |
| `/roles` | POST | Sí | Crear rol |
| `/roles/:id` | GET | Sí | Detalle con permisos agrupados por módulo |
| `/roles/:id` | PATCH | Sí | Actualizar nombre/descripción |
| `/roles/:id` | DELETE | Sí | Eliminar rol |
| `/roles/assign-permissions` | POST | Sí | Asignar permisos a un rol por item |

**Roles del sistema (seeded):**

| Key | Nombre | Acceso |
|---|---|---|
| `admin` | Administrador | Todo — todos los módulos y permisos |
| `user` | Usuario / Aplicante | Pendiente de definir (flujo de hitos) |
| `viewer` | Viewer | Solo ver solicitudes de reaplicación |

---

### 3. `bulk-upload` — Cargue masivo de usuarios

Procesamiento **asíncrono** (fire-and-forget). El archivo Excel se sube a S3 y el job se procesa en background con `setImmediate`. Al reiniciar el servidor, los jobs que quedaron en `processing` se marcan automáticamente como `failed`.

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/bulk-upload` | POST | Sí | Sube archivo Excel → crea job → responde con `jobId` |
| `/bulk-upload` | GET | Sí | Historial paginado de jobs (`page`, `perPage`) |
| `/bulk-upload/:jobId` | GET | Sí | Estado y detalle de un job específico |

**Columnas del Excel de usuarios:**

| Columna | Requerida |
|---|---|
| `correo` | Sí |
| `nombre` | Sí |
| `apellido` | Sí |
| `identificacion` | Sí |
| `contrasena` | Sí |
| `segundo_nombre` | No |
| `segundo_apellido` | No |

**Estados de un job:** `pending` → `processing` → `done` / `failed`

**Rendimiento para cargues masivos:**
- Lotes de 500 usuarios con transacción por lote (QueryRunner)
- Hashing paralelo de contraseñas en grupos de 50 (bcrypt rounds=8)
- Detección de duplicados en el archivo y contra la BD antes de insertar
- Si hay errores por fila, se genera reporte `.xlsx` subido a S3 (`reportUrl` en el job)

---

### 4. `announcement` — Convocatorias y Recursos

#### Convocatorias

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/announcements` | GET | Sí | Lista convocatorias activas (orden ASC por fecha de examen) |
| `/announcements/milestones` | GET | Sí | Lista todos los hitos del sistema |
| `/announcements/:id` | GET | Sí | Detalle de una convocatoria |

**Convocatorias seeded (6):**

| # | Nombre | Examen | Reaplicación |
|---|---|---|---|
| 1 | Promoción a categorías con funciones directivas o de supervisión en educación básica | Sáb 18 abr 2026 | Dom 26 abr 2026 |
| 2 | Promoción a horas adicionales en educación básica | Sáb 25 abr 2026 | Dom 3 may 2026 |
| 3 | Promoción a cargos con función directiva o de supervisión en educación media superior | Sáb 9 may 2026 | Sáb 16 may 2026 |
| 4 | Admisión en educación media superior | Dom 17 may 2026 | Dom 24 may 2026 |
| 5 | Admisión en educación básica | Sáb 16 may + Dom 17 may 2026 | Dom 24 may 2026 |
| 6 | Promoción horizontal por niveles con incentivos en educación básica | Sáb 25 jul + Dom 26 jul 2026 | Dom 2 ago 2026 |

#### Recursos

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/resources` | GET | Sí | Lista recursos (filtro por `announcementId`, opcional `milestoneId`) |
| `/resources` | POST | Sí | Crear recurso (título, url, descripción, announcementId, milestoneId) |
| `/resources/:id` | PATCH | Sí | Actualizar recurso |
| `/resources/:id` | DELETE | Sí | Soft delete |

---

### 5. `shared` — Servicios transversales

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/common/health` | GET | No | Health check |
| `/upload-file/upload` | POST | No | Sube archivo a S3 |
| `/upload-file/delete` | POST | No | Elimina archivo de S3 |

---

## Entidades en BD

| Tabla | Descripción | Soft delete |
|---|---|---|
| `users` | Usuarios del sistema | Sí |
| `roles` | Roles (admin, user, viewer) | Sí |
| `user_roles` | Relación usuario-rol | Sí |
| `permissions` | Permisos base (view, create, edit, delete) | Sí |
| `modules` | Módulos del menú lateral | Sí |
| `items` | Items dentro de cada módulo | Sí |
| `rol_item_permissions` | Permisos de cada rol sobre cada item | Sí |
| `announcements` | Convocatorias con fechas de examen y reaplicación | Sí |
| `milestones` | Hitos del proceso (6 fijos) | Sí |
| `resources` | Recursos por convocatoria + hito | Sí |
| `bulk_upload_jobs` | Jobs de cargue masivo de usuarios | No |
| `identification_types` | Tipos de documento de identidad | Sí |
| `genders` | Géneros | Sí |
| `black_list_token` | Tokens invalidados (logout) | No |

---

## Hitos del sistema (seeded)

| # | Key | Nombre |
|---|---|---|
| 1 | `preparation` | Preparación |
| 2 | `registration_simulation` | Inscripción y Simulación |
| 3 | `application` | Aplicación |
| 4 | `reapplication_request` | Solicitud de Reaplicación |
| 5 | `certificate_upload` | Cargue de Constancia |
| 6 | `certificate_result` | Certificado / Resultado |

---

## Migraciones

| Archivo | Descripción |
|---|---|
| `1773882967772-init.ts` | Creación de todas las tablas base |
| `1773889011268-add-announcement-key-and-dates.ts` | Agrega `key`, `examStartDate`, `examEndDate`, `reapplicationDate` a `announcements` |
| `1773892145592-bulk-upload-jobs.ts` | Crea tabla `bulk_upload_jobs` |

---

## Seeders disponibles

Se ejecutan con `RUN_SEEDERS=true` en `.env`.

| Seeder | Qué crea |
|---|---|
| `RolesSeeder` | Roles: admin, user, viewer |
| `MenuAndPermissionsSeeder` | 5 módulos, 5 items, 4 permisos base |
| `AdminUserSeeder` | Usuario admin desde `ADMIN_DEFAULT_EMAIL` / `ADMIN_DEFAULT_PASSWORD` |
| `MilestonesSeeder` | 6 hitos del proceso |
| `AnnouncementsSeeder` | 6 convocatorias del calendario 2026 |

---

## Menú del sistema (módulos e items seeded)

| Módulo | Item | Rol con acceso |
|---|---|---|
| Dashboard | dashboard.items.home | admin |
| Usuarios | users.items.list | admin |
| Aplicaciones | applications.items.list | admin |
| Recursos | resources.items.list | admin |
| Solicitudes de Reaplicación | reapplications.items.list | admin, viewer |

---

## Panel HTML de administración

`docs/bulk-upload-ui.html` — SPA consumiendo la API en `localhost:3000`.

**Secciones:**
- **Login** — `POST /auth/sign-in`, token en `localStorage`
- **Sidebar** — construido dinámicamente desde `GET /users/init-data`
- **Usuarios** — cargue masivo de Excel + botón "Agregar avance" (Fase 2) + historial de jobs (3/pág) + tabla de usuarios paginada
- **Convocatorias** — lista de convocatorias con fechas + panel de recursos CRUD por convocatoria con filtro por hito

---

## Variables de entorno requeridas

```env
APP_NAME=
APP_PORT=3000
APP_ENV=development
APP_CORS_ORIGIN=*
APP_CORS_ALLOWED_HEADERS=
APP_CORS_ALLOWED_METHODS=

JWT_SECRET_KEY=
JWT_EXPIRES_IN=1h
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

SWAGGER_USER=
SWAGGER_PASSWORD=

DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USER=
DB_PASSWORD=

MAIL_HOST=
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_SENDER=

AWS_BUCKET_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

ADMIN_DEFAULT_EMAIL=admin@portal.com
ADMIN_DEFAULT_PASSWORD=Admin123*

RUN_SEEDERS=false
```

---

## Comandos útiles

```bash
# Desarrollo
npm run start:dev

# Build
./node_modules/.bin/nest build

# Migraciones
npm run migration:generate --name=nombre
npm run migration:run
npm run migration:revert

# Formato / Lint
npm run format
```

---

## Estado por fases

| Fase | Estado | Descripción |
|---|---|---|
| **Fase 1** — Base | ✅ Completa | Auth JWT + Google OAuth, CRUD usuarios, RBAC, S3, Mailer, Swagger |
| **Fase 1.5** — Convocatorias y cargue | ✅ Completa | Convocatorias seeded con fechas, hitos, recursos CRUD, cargue masivo asíncrono de usuarios |
| **Fase 2** — Avance de examen | 🔲 Pendiente | `POST /bulk-progress` — Excel con resultados (email, hito, aprobado, puntaje, fecha) |
| **Fase 3** — Hitos de usuario | 🔲 Pendiente | Entidad `user_milestone_progress`, `GET /progress/me`, lógica de completado por hito |
| **Fase 4** — Reaplicaciones | 🔲 Pendiente | Formulario + documento en S3, endpoint para rol `viewer` |
| **Fase 5** — Constancias | 🔲 Pendiente | Cargue de constancia por usuario a S3 |
| **Fase 6** — Integraciones | 🔲 Pendiente | Sumadi (API vs documento), sync LMS, resultados Hito 7 |

---

## Puntos abiertos que requieren confirmación del cliente

| # | Punto |
|---|---|
| 1 | Columnas exactas del Excel de avance (email o identificacion, nombre del hito, etc.) |
| 2 | Mecanismo del estado Sumadi: ¿API de Sumadi o admin sube documento? |
| 3 | Endpoint del LMS para sync de contraseña (URL, auth, payload) |
| 4 | Hito 7 — Resultados: formato y origen del dato |
| 5 | ¿El usuario `user` se asigna a una convocatoria específica o el admin lo hace después? |
