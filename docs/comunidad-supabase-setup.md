# Configurar Supabase para "Comunidad"

Instrucciones para dejar funcionando la sección `/comunidad` (mapa mundial de
espacios favoritos). Sin este setup, la página muestra un aviso de "próximamente"
sin romper el resto del sitio.

## 1. Crear el proyecto

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Elige una organización, nombre (p. ej. `refugio-sensorial`) y contraseña de base de datos.
3. **Región: `eu-central-1` (Frankfurt)** — mantiene los datos de usuarios españoles/europeos
   dentro de la UE, más sencillo de cara al RGPD.
4. Plan **Free** es suficiente para empezar (500 MB de BD, 50k usuarios activos/mes,
   1 GB de Storage — de sobra para esta fase).

## 2. Obtener las credenciales

En el proyecto: **Settings → API**.

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

> ⚠️ La `anon key` es pública por diseño (viaja al navegador) — está protegida por las
> políticas de Row Level Security del paso 4, no por estar oculta. **Nunca** uses ni
> expongas la `service_role key` en el frontend.

## 3. Variables de entorno

**Local (desarrollo):** copia `.env.example` a `.env.local` (ya está en `.gitignore`,
nunca se sube al repo) y rellena los dos valores.

**Producción (GitHub Actions):** en el repo → **Settings → Secrets and variables →
Actions → New repository secret**, crea:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

El workflow (`.github/workflows/deploy.yml`) ya está preparado para inyectarlas en el
build. Si no las configuras, el build sigue funcionando — la sección Comunidad
simplemente queda inactiva.

## 4. Crear la tabla y las políticas de seguridad

En el proyecto: **SQL Editor → New query**, pega el contenido completo de
[`supabase/migrations/0001_espacios_comunidad.sql`](../supabase/migrations/0001_espacios_comunidad.sql)
y ejecútalo (▶ Run).

Esto crea:
- La tabla `espacios_comunidad`.
- **RLS**: cualquiera puede leer todos los espacios; solo el autor puede crear,
  editar o borrar los suyos (comprobado por `auth.uid()`, no falsificable desde el cliente).
- **Límite de envíos**: máx. 5 espacios por usuario cada 24h, aplicado en la base de
  datos (gratis, sin servicios externos).

## 5. Activar autenticación por email

**Authentication → Providers → Email** ya viene activado por defecto. No hay que
tocar nada salvo, opcionalmente, desactivar la confirmación por email en
**Authentication → Settings** si quieres que el registro sea instantáneo (por
defecto pide confirmar el correo antes de poder iniciar sesión).

**Authentication → URL Configuration**, añade:
- **Site URL:** `https://www.refugio-sensorial.com`
- **Redirect URLs:** `https://www.refugio-sensorial.com/comunidad`, y
  `http://localhost:5173/comunidad` para desarrollo local.

## 6. (Opcional) Activar "Continuar con Google"

El botón ya está en el código; para que funcione:

1. Sigue la [guía oficial de Supabase para Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
   — crea un cliente OAuth en Google Cloud Console (requiere una cuenta de Google Cloud,
   gratuita).
2. Pega el Client ID y Client Secret en **Authentication → Providers → Google** de Supabase.

Si no lo configuras, el botón de Google simplemente dará un error de Supabase al
pulsarlo — el login con email/contraseña funciona igual sin este paso.

## Qué NO incluye esta fase

Esta primera iteración es solo la **fundación**: autenticación + mapa en modo
lectura + estructura de datos lista. Aún faltan (fase 2):

- Formulario para crear/editar espacios (con subida de imagen a Supabase Storage).
- Panel "Mis espacios" para gestionar/borrar los propios.
- Validación de que la ubicación no caiga en agua.

## Pendiente para ti (fuera del código)

- **Política de privacidad**: al registrar usuarios y guardar su email y las
  ubicaciones que compartan, el RGPD exige informarles qué datos se recogen y
  para qué. El sitio no tiene aún una página de privacidad — conviene añadir una
  antes de anunciar esta sección públicamente.
