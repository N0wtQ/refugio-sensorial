-- Base de datos de ubicaciones VERIFICADAS por fuentes oficiales (KultureCity,
-- IBCCES, aeropuertos, cadenas con "Quiet Hour", etc.) — distinta de:
--   · espacios_comunidad (0002): abierta, cualquiera añade sin verificación.
--   · src/data/lugares.js: 250 sitios curados a mano, solo España, estático
--     en el bundle JS (no escala más allá de unos pocos cientos de filas).
--
-- Esta tabla es de solo lectura pública — la escritura (alta/edición) se
-- hace exclusivamente con la service_role key, vía scripts/import-ubicaciones.mjs,
-- nunca desde el frontend ni con la anon key. Pensada para escalar de
-- cientos a >10.000 filas sin cambiar de arquitectura.
--
-- Ejecutar en el SQL Editor de Supabase, después de 0001 y 0002.

-- ── Categorías controladas ────────────────────────────────────────────────
-- Tabla de referencia en vez de texto libre: evita duplicados como
-- "Sala sensorial" / "Salas Sensoriales" / "Sensory Room" para el mismo
-- concepto. Se crean nuevas categorías insertando aquí primero.
create table if not exists public.categorias_verificadas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  descripcion text,
  created_at  timestamptz not null default now()
);

insert into public.categorias_verificadas (nombre, descripcion) values
  ('Aeropuerto',            'Terminales y salas de aeropuerto con espacios sensoriales'),
  ('Parque temático',       'Parques de atracciones y temáticos'),
  ('Estadio o recinto deportivo', 'Estadios, pabellones y recintos con salas sensoriales'),
  ('Zoológico o acuario',   'Zoológicos, acuarios y parques de fauna'),
  ('Museo',                 'Museos y centros culturales'),
  ('Hotel',                 'Alojamiento con certificación de accesibilidad sensorial'),
  ('Centro comercial',      'Centros comerciales con horario o sala tranquila'),
  ('Supermercado',          'Supermercados con Quiet Hour u horario tranquilo'),
  ('Cine o teatro',         'Salas de cine y teatros con sesiones o adaptaciones sensoriales'),
  ('Biblioteca',            'Bibliotecas con espacios de baja estimulación'),
  ('Otro',                  'No encaja en las categorías anteriores')
on conflict (nombre) do nothing;

-- ── Tabla principal ──────────────────────────────────────────────────────
create table if not exists public.ubicaciones_verificadas (
  id                     uuid primary key default gen_random_uuid(),

  nombre                 text not null check (char_length(nombre) between 2 and 200),
  categoria_id           uuid not null references public.categorias_verificadas(id),

  direccion              text,
  ciudad                 text,
  provincia_estado       text,
  pais                   text not null,
  codigo_postal          text,
  latitud                double precision check (latitud between -90 and 90),
  longitud               double precision check (longitud between -180 and 180),

  descripcion            text,
  adaptaciones_sensoriales text[] not null default '{}',
  horarios_tranquilos    text,
  certificaciones        text[] not null default '{}',

  sitio_web              text,
  telefono               text,
  imagenes               text[] not null default '{}',

  -- Verificación — obligatoria, nunca null. Nada entra sin fuente.
  fecha_verificacion     date not null,
  fuente_url             text not null,
  fuente_nombre          text,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Guardarraíl de deduplicación básico (nombre+ciudad+país). La comprobación
-- fina por dirección/coordenadas la hace scripts/import-ubicaciones.mjs
-- antes de insertar — un índice único no puede juzgar "es el mismo sitio
-- con el nombre escrito distinto", eso requiere revisión humana o del script.
create unique index if not exists idx_ubicaciones_dedup
  on public.ubicaciones_verificadas (lower(nombre), lower(coalesce(ciudad, '')), lower(pais));

-- ── Índices para las búsquedas pedidas: mapa, texto, país, ciudad, ──────
-- categoría, adaptaciones sensoriales, certificaciones.
create index if not exists idx_ubicaciones_mapa       on public.ubicaciones_verificadas (latitud, longitud);
create index if not exists idx_ubicaciones_pais        on public.ubicaciones_verificadas (pais);
create index if not exists idx_ubicaciones_ciudad      on public.ubicaciones_verificadas (ciudad);
create index if not exists idx_ubicaciones_categoria   on public.ubicaciones_verificadas (categoria_id);
create index if not exists idx_ubicaciones_adaptaciones on public.ubicaciones_verificadas using gin (adaptaciones_sensoriales);
create index if not exists idx_ubicaciones_certificaciones on public.ubicaciones_verificadas using gin (certificaciones);

-- Búsqueda de texto libre (nombre + descripción + ciudad)
alter table public.ubicaciones_verificadas
  add column if not exists busqueda tsvector
  generated always as (
    to_tsvector('simple',
      coalesce(nombre, '') || ' ' || coalesce(descripcion, '') || ' ' ||
      coalesce(ciudad, '') || ' ' || coalesce(pais, '')
    )
  ) stored;

create index if not exists idx_ubicaciones_busqueda on public.ubicaciones_verificadas using gin (busqueda);

-- ── updated_at automático (reutiliza la función ya creada en 0001/0002) ──
drop trigger if exists trg_touch_updated_at on public.ubicaciones_verificadas;
create trigger trg_touch_updated_at
  before update on public.ubicaciones_verificadas
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────
-- Lectura pública sí; escritura NO — ni para anon ni para authenticated.
-- Solo la service_role key (usada por el script de importación, nunca en
-- el frontend) puede insertar/editar/borrar.
alter table public.categorias_verificadas enable row level security;
alter table public.ubicaciones_verificadas enable row level security;

drop policy if exists "Lectura publica categorias" on public.categorias_verificadas;
create policy "Lectura publica categorias" on public.categorias_verificadas
  for select using (true);

drop policy if exists "Lectura publica ubicaciones" on public.ubicaciones_verificadas;
create policy "Lectura publica ubicaciones" on public.ubicaciones_verificadas
  for select using (true);
