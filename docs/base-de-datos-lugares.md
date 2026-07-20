# Base de datos de lugares — arquitectura SQLite

Migración de `src/data/lugares.js` (250 lugares hardcodeados en un archivo
JS) a una base de datos SQLite versionada en el repositorio, con scripts
que la importan y la exportan de vuelta al mismo formato que ya usa el
frontend. Sitio 100% estático, sin backend, sin servidor, sin coste — tal
como se pidió.

```
data/refugio-sensorial.db  (SQLite, fuente única de verdad)
        │
        │  scripts/db/export-lugares.mjs
        ▼
src/data/lugares.js   ← el frontend sigue leyendo exactamente esto, sin cambios
data/lugares.json     ← artefacto adicional, JSON con todos los campos
```

## Qué se ha hecho y por qué

**Antes de tocar nada** se analizó: `src/data/lugares.js` (array `LUGARES`
+ `TIPOS`), cómo lo consume `SilentMap.jsx` (import directo de JS, no
fetch de JSON — importante, ver más abajo), el filtrado por `tipo`, la
búsqueda por nombre/ciudad/descripción, y los 9 campos exactos que usa
cada lugar (`id, lat, lng, nombre, tipo, ciudad, horario, descripcion, url`).

**Una aclaración sobre "JSON":** hoy el frontend no lee un JSON en tiempo
de ejecución — `lugares.js` es un módulo JS que se importa y empaqueta en
el build (`import { LUGARES } from '../data/lugares'`). Cambiar eso a un
`fetch()` de un `.json` real SÍ sería tocar el frontend (habría que añadir
estado de carga, gestión de errores de red, etc.), justo lo que se pidió
evitar ("no quiero modificar el frontend"). Por eso el exportador
regenera `lugares.js` con el mismo formato exacto — el "JSON" del
pipeline es `data/lugares.json`, un artefacto adicional para otros usos
futuros (no lo consume el mapa). Si en algún momento se prefiere que el
mapa cargue JSON de verdad vía fetch, es un cambio de frontend explícito
que merece su propia conversación — no se ha hecho aquí porque contradice
"no modifiques el frontend" tal como está escrito hoy.

**Verificación de que no se rompe nada:** el pipeline import → export
sobre los 250 lugares actuales produce un `lugares.js` idéntico salvo dos
líneas cosméticas (el comentario de cabecera, y `-5` en vez de `-5.0` —
el mismo número exacto en punto flotante). Comprobado además con
Playwright: el mapa sigue mostrando "250 espacios visibles", los filtros
por tipo funcionan igual, cero errores en consola.

## Arquitectura

### Por qué SQLite vía `node:sqlite` (no una librería nueva)

Node 22.5+ incluye un módulo SQLite nativo (`node:sqlite`). Tanto tu
entorno local como el CI (Node 24) lo soportan. Se usa ese en vez de
añadir `better-sqlite3` u otra dependencia — **cero paquetes nuevos**,
coherente con "evita sobreingeniería". Está marcado como experimental en
Node, pero solo se usa en scripts de build/mantenimiento, nunca en el
navegador — sin riesgo para la web pública.

### Esquema (`scripts/db/schema.sql`) — dos tablas, nada más

**`categorias`** — 9 categorías principales, pocas y claras (Museos y
cultura, Parques y naturaleza, Bibliotecas y estudio, Cafés y descanso,
Ocio y turismo, Transporte, Alojamiento, Salud, Otros). Es una relación
real (no adorno): evita que con miles de lugares aparezcan variantes como
"Museo" / "Museos" / "museo" como categorías distintas.

**`lugares`** — todos los campos pedidos (nombre, categoría, descripción,
dirección, ciudad, provincia/región, país, latitud, longitud, web
oficial, fuente, nivel de verificación, fecha de actualización), más:
- `subcategoria` — metadato interno libre (p. ej. "acuario"), **nunca se
  muestra como categoría principal** en la interfaz.
- `tipo_legacy` — el valor de `tipo` que usa HOY `SilentMap.jsx`
  (`supermercado`, `centro_comercial`...). Existe solo para que el
  exportador pueda regenerar `lugares.js` sin tocar el frontend. Cuando
  haya una segunda fase de rediseño de la interfaz que use `categoria_id`
  directamente, esta columna se podrá retirar.
- `nivel_verificacion` — uno de tres valores fijos ("Verificado - Fuente
  oficial" / "... Prensa o medio reconocido" / "... Documentación
  pública"), con `CHECK` en la base de datos.
- `latitud`/`longitud` son **nullable** a propósito: si no se conoce la
  coordenada exacta del edificio, se guarda `NULL`, nunca el centro de la
  ciudad. Un lugar sin coordenadas se queda en la base de datos pero
  **el exportador no lo publica en el mapa** hasta completarse.

Índices sobre categoría, país, ciudad, `tipo_legacy` y nivel de
verificación — las búsquedas que se pidieron optimizar.

No hay más tablas. No se ha modelado nada especulativo (usuarios,
reseñas, fotos como entidad aparte...) porque no aporta valor en esta
primera versión — se pidió explícitamente evitarlo.

### Scripts (`scripts/db/`)

| Script | Qué hace |
|---|---|
| `lib.mjs` | Conexión compartida + aplica `schema.sql` al abrir |
| `import-lugares.mjs` | `lugares.js` → SQLite. Idempotente (`ON CONFLICT... DO UPDATE`), no duplica si se re-ejecuta |
| `export-lugares.mjs` | SQLite → `lugares.js` (solo con coordenadas) + `lugares.json` (todos) |
| `seed-internacional.mjs` | Siembra puntual de las primeras 8 ubicaciones internacionales verificadas (ver abajo) |

`npm run db:import` y `npm run db:export` son atajos a los dos primeros.

## Cómo añadir un lugar nuevo

1. Verifica el dato con una fuente real (oficial, prensa reconocida o
   documentación pública) — sin fuente, no se añade.
2. Comprueba que no exista ya: busca por nombre, dirección y coordenadas
   en `data/refugio-sensorial.db` (`sqlite3 data/refugio-sensorial.db
   "SELECT id, nombre FROM lugares WHERE nombre LIKE '%...%'"`).
3. Insértalo con SQL directo o con un script de siembra como
   `seed-internacional.mjs` (cópialo como plantilla). Campos obligatorios:
   `nombre`, `categoria_id`, `tipo_legacy`, `pais`, `nivel_verificacion`,
   `fuente`. Sin coordenadas reales del edificio, deja `latitud`/`longitud`
   en `NULL` — no se publicará en el mapa hasta tenerlas, pero queda
   guardado y listo para completarse.
4. Ejecuta `npm run db:export` para regenerar `lugares.js` y
   `lugares.json`.
5. Revisa el diff de `src/data/lugares.js` — debe ser mínimo si no has
   tocado los 250 lugares existentes.

## Cómo actualizar la base de datos SQLite

La base de datos vive en `data/refugio-sensorial.db` y está versionada en
git (como cualquier otro archivo del repo). Para modificarla:
- Con SQL directo: `sqlite3 data/refugio-sensorial.db` (o cualquier
  cliente SQLite/DBeaver/DB Browser for SQLite).
- Con un script Node como los de `scripts/db/`, reutilizando `openDb()`
  de `lib.mjs`.

Tras cualquier cambio, ejecuta `npm run db:export` y haz commit tanto del
`.db` como de los archivos regenerados.

## Cómo regenerar los JSON/lugares.js automáticamente

```
npm run db:export
```

Esto NO se ejecuta en el CI/deploy (`deploy.yml` no lo llama) — es
deliberado: el pipeline de datos es un paso manual y consciente ("añadir
un lugar" es una decisión editorial, no algo que deba pasar solo con
cada `git push`). El build de producción sigue leyendo `lugares.js` tal
cual esté commiteado, igual que siempre.

## Las 8 primeras ubicaciones internacionales

`seed-internacional.mjs` añade a la base de datos (no al mapa todavía,
por falta de coordenadas verificadas) las 8 ubicaciones que ya se habían
documentado y citado con fuente oficial: tres aeropuertos/estadios y un
parque temático certificados KultureCity/IBCCES en EE. UU., y un
zoológico y un acuario certificados IBCCES en Emiratos Árabes Unidos.

**Limitación técnica que sigue vigente:** el acceso directo a directorios
oficiales como `kulturecity.org` o `ibcces.org` sigue bloqueado desde este
entorno de desarrollo (HTTP 403, verificado). Solo la búsqueda web
funciona, y da fragmentos de texto, no listados estructurados con
dirección y coordenadas exactas del edificio. Por eso hay 8 ubicaciones,
no cientos — la calidad y la regla de "nunca inventar coordenadas" pesa
más que la cantidad, tal como se pidió.

## ⚠️ Ya existe un sistema paralelo — hay que decidir qué hacer con él

En una sesión anterior se construyó `supabase/migrations/0003_ubicaciones_verificadas.sql`
(ver `docs/ubicaciones-verificadas.md`): una tabla en Supabase (Postgres,
un servicio externo) pensada para el mismo objetivo — ubicaciones
verificadas globalmente. Con esta nueva arquitectura SQLite, **ese
sistema de Supabase queda redundante**: hace lo mismo, pero depende de un
servicio externo, mientras que SQLite cumple "sin backend, sin coste" de
forma literal.

No he tocado ni borrado nada de Supabase — sigue ahí, sin usarse desde el
frontend. Recomendación: si te convence esta arquitectura SQLite,
`ubicaciones_verificadas` en Supabase se puede abandonar sin más (nunca
llegó a tener datos de producción reales más allá de las mismas 8 de
prueba). Dímelo y lo limpio en la próxima sesión.

*(Esto es distinto de `espacios_comunidad`, la tabla de Supabase que sí
está en uso — el "Añadir espacio" con clic directo en el mapa que
cualquier visitante puede usar sin cuenta. Esa sigue funcionando igual,
no se toca.)*

## Recomendaciones para una segunda fase

- **Diff legible del `.db`**: si la base de datos crece mucho, los diffs
  binarios en git dejan de ser revisables. Se podría añadir un volcado
  SQL de texto plano (`data/refugio-sensorial.sql`) generado junto al
  `.db`, para revisar cambios línea a línea en las pull requests. No se
  ha construido ahora para no añadir complejidad sin necesidad real.
- **Retirar `tipo_legacy`**: cuando se rediseñe la interfaz del mapa para
  usar directamente las 9 categorías principales (en vez de los 12 tipos
  actuales), se puede eliminar esta columna de compatibilidad.
- **Geocodificación**: para completar coordenadas de lugares ya
  verificados pero sin latitud/longitud (como las 8 internacionales),
  haría falta una API de geocodificación real (Nominatim/OpenStreetMap,
  Google) — ahora mismo bloqueada desde este entorno igual que el resto
  de fetch externo.
- **Fuente de datos externa**: la vía más rápida para escalar de verdad
  (cientos o miles de ubicaciones) sigue siendo la misma que ya se
  comentó: una exportación oficial de KultureCity, IBCCES o similar que
  tú puedas facilitar, para importarla con un script equivalente a
  `seed-internacional.mjs`.
