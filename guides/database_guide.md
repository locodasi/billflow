# DATABASE.md — Base de datos (Supabase)

Esta guía explica cómo conectar tu propia instancia de Supabase a este proyecto
y cómo mantenerla sincronizada con los cambios de schema que se vayan agregando.

> **Regla de oro:** cualquier cambio de estructura (tablas, columnas, funciones,
> triggers, RLS policies) se hace escribiendo SQL en el SQL Editor de Supabase,
> nunca con clicks en el Table Editor. Si no queda como SQL explícito, no se puede
> versionar ni aplicar en otro entorno.

---

## 1. Requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) instalado.
- [Docker Desktop](https://docs.docker.com/desktop/) instalado y **corriendo**
  (con WSL2 si estás en Windows). El CLI lo usa internamente para algunos comandos
  de migraciones — no afecta cómo corre la app (Next.js sigue corriendo normal,
  sin contenedores).
- Una cuenta de Supabase.

Verificar que Docker esté activo antes de cualquier comando:

```powershell
docker ps
```

---

## 2. Conectar tu propio proyecto Supabase desde cero

### 2.1. Crear el proyecto

Desde el [dashboard de Supabase](https://supabase.com/dashboard) → **New Project**.
Anotar el *project ref* y la contraseña de la base que generes.

### 2.2. Linkear el proyecto local con el remoto

```powershell
supabase login
supabase link --project-ref <tu-project-id>
```

### 2.3. Aplicar toda la estructura existente

```powershell
supabase db push
```

Esto reconstruye en tu proyecto todas las tablas, índices, funciones, triggers,
RLS policies y buckets de storage que ya están definidos en `supabase/migrations/`.

### 2.4. Verificar

```powershell
supabase migration list
```

Y a ojo en el Studio de tu proyecto: Table Editor (tablas), Database → Policies
(RLS), Storage (buckets).

### 2.5. Variables de entorno

Copiar `.env.example` a `.env.local` y completar con las keys de tu proyecto
(Project Settings → API en el dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 3. Cómo agregar un cambio de schema propio

### 3.1. Cambios de estructura (tablas, columnas, funciones, triggers, RLS policies)

1. Escribir y probar el cambio en tu proyecto, vía SQL Editor:
   ```sql
   ALTER TABLE invoices ADD COLUMN due_date date;
   ```
2. Generar la migración automáticamente:
   ```powershell
   supabase db diff -f add_due_date_to_invoices --schema public
   ```
3. Revisar el archivo generado en `supabase/migrations/`.
4. Commitear a Git.
5. Aplicar a donde corresponda con:
   ```powershell
   supabase link --project-ref <project-id-destino>
   supabase db push
   ```

### 3.2. Si tu cambio incluye un bucket nuevo de Storage

A diferencia de una tabla o policy, **crear un bucket no lo detecta el diff
automáticamente** (es una fila de datos, no estructura). Hacelo así:

1. Crear el bucket en tu SQL Editor:
   ```sql
   insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   values ('nuevo-bucket', 'nuevo-bucket', false, null, null)
   on conflict (id) do nothing;
   ```
2. Crear sus policies (esto sí lo agarra el diff):
   ```sql
   CREATE POLICY "..." ON storage.objects ...;
   ```
3. Generar la migración:
   ```powershell
   supabase migration new nuevo_bucket
   supabase db diff -f nuevo_bucket --schema public
   ```
4. Agregar el `insert` del paso 1 **a mano** en el archivo generado, antes de
   las policies (el diff solo trajo estas últimas).
5. Commitear y `supabase db push` cuando corresponda.

---

## 4. Comandos de referencia rápida

| Acción | Comando |
|---|---|
| Login | `supabase login` |
| Linkear proyecto | `supabase link --project-ref <ref>` |
| Ver estado de migraciones | `supabase migration list` |
| Generar migración por diff | `supabase db diff -f <nombre> --schema public` |
| Aplicar migraciones pendientes | `supabase db push` |

---

## 5. Checklist antes de pushear

- [ ] El cambio se probó y funciona como se espera.
- [ ] El archivo de migración generado fue revisado a mano.
- [ ] Si incluye un bucket nuevo, el `INSERT` está agregado manualmente.
- [ ] El archivo está commiteado en Git antes de aplicarlo.
- [ ] Se verificó el `--project-ref` correcto antes de pushear (fácil
      equivocarse de entorno si tenés más de uno linkeado).

## 6. Agregar tu usuario admin

Por ultimo agregue manualmente en la DB a su usuario, luego en profiles, cambie el role a admin y complete cualquier otro dato que sea diferente a sus necesidades en esa fila