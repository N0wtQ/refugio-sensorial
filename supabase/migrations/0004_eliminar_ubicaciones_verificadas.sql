-- Elimina el sistema de ubicaciones verificadas en Supabase (0003), que
-- quedó redundante en cuanto se construyó la base de datos SQLite
-- (data/refugio-sensorial.db, ver docs/base-de-datos-lugares.md) — misma
-- función, pero SQLite cumple "sin backend, sin coste" de forma literal,
-- sin depender de un servicio externo.
--
-- Nunca llegó a tener datos de producción reales (solo las mismas 8
-- ubicaciones de prueba que ahora viven en SQLite). Seguro ejecutar esto
-- tanto si 0003 se llegó a aplicar en tu proyecto Supabase como si no.
--
-- Ejecutar en el SQL Editor de Supabase SOLO si en algún momento
-- ejecutaste 0003. Si nunca lo hiciste, no hace falta hacer nada.

drop table if exists public.ubicaciones_verificadas cascade;
drop table if exists public.categorias_verificadas cascade;
