-- Espacios añadidos por cualquier visitante, sin cuentas ni login — al estilo
-- Labelled Like Me. Reemplaza el esquema de 0001 (que asumía auth.users).
-- Autocontenido: se puede ejecutar tanto si 0001 ya corrió como si no.
-- Ejecutar en el SQL Editor de tu proyecto Supabase (ver docs/comunidad-supabase-setup.md).

drop table if exists public.espacios_comunidad cascade;

-- ── Tabla ─────────────────────────────────────────────────────────────────
create table public.espacios_comunidad (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null check (char_length(nombre) between 2 and 80),
  descripcion  text not null check (char_length(descripcion) between 10 and 500),
  categoria    text not null check (categoria in ('Sensorial','Relax','Aventura','Cultural','Gastronómico','Otro')),
  latitud      double precision not null check (latitud between -90 and 90),
  longitud     double precision not null check (longitud between -180 and 180),
  imagen_url   text,
  autor_nombre text check (char_length(autor_nombre) <= 40),
  -- Token secreto de gestión: quien crea un espacio lo guarda en su navegador
  -- (localStorage) y lo usa para editar/borrar más tarde. Nunca se expone en
  -- lecturas públicas (ver GRANT de columnas más abajo) — solo se devuelve
  -- una vez, en la respuesta de crear_espacio_comunidad().
  manage_token uuid not null default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_espacios_comunidad_lat_lng on public.espacios_comunidad (latitud, longitud);

-- ── updated_at automático ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_touch_updated_at
  before update on public.espacios_comunidad
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.espacios_comunidad enable row level security;

create policy "Lectura publica" on public.espacios_comunidad
  for select using (true);

-- Nadie inserta/edita/borra directamente sobre la tabla — todo pasa por las
-- funciones de abajo, que son las únicas que conocen la lógica del token.
revoke insert, update, delete on public.espacios_comunidad from anon, authenticated;

-- Y ni siquiera con SELECT directo se puede leer manage_token: solo se
-- conceden explícitamente las columnas públicas.
revoke select on public.espacios_comunidad from anon, authenticated;
grant select (id, nombre, descripcion, categoria, latitud, longitud, imagen_url, autor_nombre, created_at, updated_at)
  on public.espacios_comunidad to anon, authenticated;

-- ── Crear espacio — devuelve id + manage_token (solo esta vez) ─────────
-- Anti-spam: el formulario del frontend incluye un honeypot (mismo patrón
-- que ContactForm.jsx) — barrera gratuita y sin falsos positivos. Un límite
-- por IP es una mejora futura razonable si el spam llega a ser un problema
-- real (requeriría guardar la IP del request, que hoy no se persiste).
create or replace function public.crear_espacio_comunidad(
  p_nombre text,
  p_descripcion text,
  p_categoria text,
  p_latitud double precision,
  p_longitud double precision,
  p_imagen_url text default null,
  p_autor_nombre text default null
)
returns table (id uuid, manage_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_token uuid;
begin
  insert into public.espacios_comunidad
    (nombre, descripcion, categoria, latitud, longitud, imagen_url, autor_nombre)
  values
    (p_nombre, p_descripcion, p_categoria, p_latitud, p_longitud, p_imagen_url, p_autor_nombre)
  returning espacios_comunidad.id, espacios_comunidad.manage_token into v_id, v_token;

  return query select v_id, v_token;
end;
$$;

grant execute on function public.crear_espacio_comunidad(text, text, text, double precision, double precision, text, text) to anon, authenticated;

-- ── Editar espacio — requiere el manage_token exacto ─────────────────────
create or replace function public.actualizar_espacio_comunidad(
  p_id uuid,
  p_token uuid,
  p_nombre text,
  p_descripcion text,
  p_categoria text,
  p_latitud double precision,
  p_longitud double precision,
  p_imagen_url text default null,
  p_autor_nombre text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.espacios_comunidad set
    nombre = p_nombre,
    descripcion = p_descripcion,
    categoria = p_categoria,
    latitud = p_latitud,
    longitud = p_longitud,
    imagen_url = p_imagen_url,
    autor_nombre = p_autor_nombre
  where id = p_id and manage_token = p_token;

  if not found then
    raise exception 'No autorizado o espacio no encontrado.' using errcode = 'P0001';
  end if;
end;
$$;

grant execute on function public.actualizar_espacio_comunidad(uuid, uuid, text, text, text, double precision, double precision, text, text) to anon, authenticated;

-- ── Borrar espacio — requiere el manage_token exacto ─────────────────────
create or replace function public.borrar_espacio_comunidad(p_id uuid, p_token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.espacios_comunidad where id = p_id and manage_token = p_token;
  if not found then
    raise exception 'No autorizado o espacio no encontrado.' using errcode = 'P0001';
  end if;
end;
$$;

grant execute on function public.borrar_espacio_comunidad(uuid, uuid) to anon, authenticated;
