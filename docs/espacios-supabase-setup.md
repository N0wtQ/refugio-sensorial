# Configurar Supabase para "añadir espacios"

Instrucciones para activar la función de `/espacios` que deja a **cualquier
visitante añadir un punto al mapa, sin registrarse** (al estilo Labelled
Like Me). Sin este setup, `/espacios` sigue funcionando igual (mapa curado,
filtros...) pero el botón "Añadir espacio" da un aviso de que la función no
está activada todavía — no rompe nada.

## Cómo funciona (sin cuentas)

No hay login ni contraseñas. Al enviar el formulario:
1. El espacio se publica **al instante** en el mapa.
2. El navegador guarda en `localStorage` un token secreto que la base de
   datos genera para ese espacio.
3. Mientras uses el mismo navegador/dispositivo, verás tus espacios en
   "Tus espacios en este dispositivo" y podrás editarlos o borrarlos — el
   token es lo único que demuestra que tú lo creaste, no hace falta cuenta.
4. Si cambias de navegador o borras los datos del sitio, pierdes la
   capacidad de editar ese espacio (igual que perder un enlace privado).

## 1. Crear el proyecto

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Elige una organización, nombre (p. ej. `refugio-sensorial`) y contraseña de base de datos.
3. **Región: `eu-central-1` (Frankfurt)** — mantiene los datos dentro de la UE,
   más sencillo de cara al RGPD.
4. Plan **Free** es suficiente para empezar (500 MB de BD, de sobra para esta fase).

## 2. Obtener las credenciales

En el proyecto: **Settings → API**.

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

> ⚠️ La `anon key` es pública por diseño (viaja al navegador) — la seguridad
> viene de las políticas RLS y las funciones del paso 4, no de ocultar esta
> clave. **Nunca** uses ni expongas la `service_role key` en el frontend.

## 3. Variables de entorno

**Local (desarrollo):** copia `.env.example` a `.env.local` (ya está en `.gitignore`,
nunca se sube al repo) y rellena los dos valores.

**Producción (GitHub Actions):** en el repo → **Settings → Secrets and variables →
Actions → New repository secret**, crea:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

El workflow (`.github/workflows/deploy.yml`) ya está preparado para inyectarlas
en el build.

## 4. Crear la tabla, las funciones y las políticas de seguridad

En el proyecto: **SQL Editor → New query**, pega el contenido completo de
[`supabase/migrations/0002_espacios_sin_login.sql`](../supabase/migrations/0002_espacios_sin_login.sql)
y ejecútalo (▶ Run). Es autocontenido: funciona tanto si nunca ejecutaste
nada antes como si ya corriste la migración `0001` (versión antigua, con
login — este archivo la reemplaza por completo).

Esto crea:
- La tabla `espacios_comunidad`, con una columna `manage_token` **secreta**
  (nunca legible por lectura pública — solo se devuelve una vez, al crear).
- Tres funciones (`crear_espacio_comunidad`, `actualizar_espacio_comunidad`,
  `borrar_espacio_comunidad`) que son la única forma de escribir en la tabla.
  Editar/borrar exige el `manage_token` exacto; sin él, la función rechaza
  la operación.
- **RLS**: lectura pública de las columnas normales (nombre, descripción,
  ubicación...); inserción/edición/borrado directos bloqueados salvo a
  través de esas tres funciones.

No hace falta tocar nada en **Authentication** — esta función no lo usa.

## Qué NO incluye esta fase

- Subida de imágenes a Supabase Storage (de momento el campo "imagen" es
  una URL que el usuario pega, no un selector de archivo).
- Validación de que la ubicación no caiga en agua.
- Límite de envíos más allá del honeypot anti-bot del formulario (mismo
  patrón que el formulario de contacto). Si el spam llega a ser un problema
  real, un límite por IP es una mejora futura razonable.

## Pendiente para ti (fuera del código)

- **Política de privacidad**: aunque no hay cuentas, el formulario sí guarda
  lo que la gente escribe (nombre del espacio, descripción, opcionalmente su
  nombre) de forma pública. Conviene tener una nota de privacidad breve
  antes de anunciar esta función.
- **Moderación**: los espacios se publican al instante, sin revisión previa.
  Si aparece algo inapropiado, puedes borrarlo directamente desde el
  **Table Editor** de Supabase (tabla `espacios_comunidad`), sin necesitar
  el `manage_token` — tú tienes acceso completo como propietaria del proyecto.
