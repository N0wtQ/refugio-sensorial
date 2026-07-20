-- Comunidad — mapa mundial de espacios favoritos compartidos por usuarios.
-- Ejecutar en el SQL Editor de tu proyecto Supabase (ver docs/comunidad-supabase-setup.md).

-- ── Tabla principal ──────────────────────────────────────────────────────
create table if not exists public.espacios_comunidad (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null check (char_length(nombre) between 2 and 80),
  descripcion  text not null check (char_length(descripcion) between 10 and 500),
  categoria    text not null check (categoria in ('Sensorial','Relax','Aventura','Cultural','Gastronómico','Otro')),
  latitud      double precision not null check (latitud between -90 and 90),
  longitud     double precision not null check (longitud between -180 and 180),
  imagen_url   text,
  -- Nombre público opcional del autor (NO se autorrellena con el email —
  -- mostrar el email públicamente sería un problema de privacidad).
  autor_nombre text check (char_length(autor_nombre) <= 40),
  user_id      uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_espacios_comunidad_user on public.espacios_comunidad (user_id);
create index if not exists idx_espacios_comunidad_lat_lng on public.espacios_comunidad (latitud, longitud);

-- ── updated_at automático ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_updated_at on public.espacios_comunidad;
create trigger trg_touch_updated_at
  before update on public.espacios_comunidad
  for each row execute function public.touch_updated_at();

-- ── Límite de envíos: máx. 5 espacios por usuario cada 24h ──────────────
-- Enforced en la base de datos (no se puede saltar editando el frontend)
-- y sin coste añadido: es solo lógica de Postgres, incluida en el free tier.
create or replace function public.check_rate_limit_espacios()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recientes int;
begin
  select count(*) into recientes
  from public.espacios_comunidad
  where user_id = new.user_id
    and created_at > now() - interval '24 hours';

  if recientes >= 5 then
    raise exception 'Límite alcanzado: solo puedes añadir 5 espacios cada 24 horas.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_rate_limit_espacios on public.espacios_comunidad;
create trigger trg_rate_limit_espacios
  before insert on public.espacios_comunidad
  for each row execute function public.check_rate_limit_espacios();

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.espacios_comunidad enable row level security;

drop policy if exists "Lectura publica" on public.espacios_comunidad;
create policy "Lectura publica" on public.espacios_comunidad
  for select
  using (true);

drop policy if exists "Insertar solo propio" on public.espacios_comunidad;
create policy "Insertar solo propio" on public.espacios_comunidad
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Actualizar solo propio" on public.espacios_comunidad;
create policy "Actualizar solo propio" on public.espacios_comunidad
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Eliminar solo propio" on public.espacios_comunidad;
create policy "Eliminar solo propio" on public.espacios_comunidad
  for delete
  using (auth.uid() = user_id);
