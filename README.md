# Billflow

Billflow es una aplicacion de gestion de facturas y pagos con autenticacion por roles, proyectos por cliente, carga de PDF y conversion de moneda a USD.

## Que resuelve

- Gestiona clientes y sus proyectos.
- Permite subir facturas y recibos en PDF.
- Calcula montos convertidos a USD para normalizar reportes.
- Relaciona pagos con facturas pendientes.
- Envia notificaciones por email (alta de cliente, factura subida, pago subido).

## Funcionalidades principales

### Autenticacion

- Login y manejo de sesion con Supabase.
- Recuperacion y alta de password por link de recovery.
- Roles `admin` y `client`.
- Middleware/proxy de proteccion de rutas.

### Clientes y proyectos

- Alta de cliente con creacion de usuario en Supabase Auth.
- Envio de email para definir password inicial.
- CRUD de proyectos por cliente.
- Estructura de carpetas por proyecto en bucket `documents`.

### Facturas

- Carga de PDF en Supabase Storage.
- Parseo basico de numero, monto y moneda desde PDF.
- Guardado de tipo de cambio y monto en USD.
- Vista con filtros y estados derivados (`unpaid`, `pending`, `paid`).
- Descarga masiva de PDFs impagos en ZIP.

### Pagos

- Carga de recibos PDF y parseo basico.
- Estado de pago (`pending`, `approved`, `rejected`).
- Aplicacion de montos a facturas pendientes via tabla puente `payment_invoices`.
- Notificacion por email al registrar un pago.

### Metricas

- Existe el modulo y la ruta, pero actualmente esta en estado inicial (placeholder).

## Stack tecnico

- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (Auth, Postgres, Storage)
- Zustand (estado global)
- styled-components + estilos globales
- React Email + Nodemailer
- unpdf + JSZip

## Requisitos

- Node.js 18+
- pnpm
- Supabase CLI
- Docker Desktop (requerido por varios flujos de migraciones de Supabase)
- Cuenta de Supabase
- Cuenta de Gmail con App Password (si queres enviar emails reales)

## Instalacion y ejecucion local

1. Instalar dependencias:

```bash
pnpm install
```

2. Generar el mapa de iconos:

```bash
pnpm icons
```

3. Crear archivo de entorno:

```bash
cp .env.example .env.local
```

4. Completar variables en `.env.local` (ver seccion Variables de entorno).

5. Linkear y aplicar migraciones de Supabase:

```bash
supabase login
supabase link --project-ref <tu-project-ref>
supabase db push
```

6. Levantar la app:

```bash
pnpm dev
```

7. Abrir `http://localhost:3000`.

## Variables de entorno

### Publicas

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Privadas

```env
SUPABASE_SECRET_KEY=...
GMAIL_USER=tu-cuenta@gmail.com
GMAIL_APP_PASSWORD=tu-app-password
PERSONAL_EMAIL=tu-email@dominio.com
```

### Nota importante

En `.env.example` figura `NEXT_PUBLIC_SUPABASE_ANON_KEY`, pero el codigo actual valida y usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Para que la app arranque sin error, defini `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Scripts

- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: build de produccion.
- `pnpm start`: servidor de produccion.
- `pnpm lint`: lint del proyecto.
- `pnpm icons`: genera `src/components/icons/icons.ts` desde `public/icons/*.svg`.
- `pnpm email:dev`: preview local de plantillas de email.

## Base de datos y migraciones

Las migraciones estan en `supabase/migrations/`.

- Snapshot inicial de schema en `public`.
- Trigger sobre `auth.users` en migracion separada.
- Definicion de bucket `documents` y policies de storage en migracion separada.

Para cambios de schema:

1. Hacer cambios por SQL (no por clicks en Table Editor).
2. Generar migracion:

```bash
supabase db diff -f <nombre_migracion> --schema public
```

3. Revisar SQL generado.
4. Commit.
5. Aplicar con `supabase db push`.

Mas detalle en:

- `guides/database_guide.md`
- `internal_guides/database_internal.md`

## Modelo de datos (alto nivel)

Tablas principales:

- `profiles`
- `clients`
- `projects`
- `invoices`
- `payments`
- `payment_invoices`

Vistas:

- `invoice_summary`
- `client_stats`
- `project_stats`

## Estructura general

- `src/app`: rutas y layouts de Next.js.
- `src/actions`: server actions globales.
- `src/lib`: integraciones (Supabase, notificaciones, env, utilidades).
- `src/stores`: estado global con Zustand.
- `src/components`: componentes UI reutilizables.
- `supabase`: config y migraciones.

## Troubleshooting rapido

- Error `Missing environment variable`: revisar `.env.local` y nombre exacto de variables.
- No llegan emails: validar `GMAIL_USER` y `GMAIL_APP_PASSWORD` (App Password real).
- `supabase db push` falla: verificar Docker en ejecucion y proyecto linkeado correcto.
- Login redirige en loop: revisar sesion de Supabase y variables `NEXT_PUBLIC_SUPABASE_*`.

## Estado del proyecto

- Facturacion y pagos: funcional.
- Invitacion y seteo de password: funcional.
- Metricas: en construccion.
