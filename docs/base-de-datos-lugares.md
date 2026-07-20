# Base de datos de lugares — arquitectura SQLite

Migración de `src/data/lugares.js` (250 lugares hardcodeados en un archivo
JS) a una base de datos SQLite versionada en el repositorio, con scripts
que la importan y la exportan de vuelta al mismo formato que ya usa el
frontend. Sitio 100% estático, sin backend, sin servidor, sin coste — tal
como se pidió.

```
data/refugio-sensorial.db  (SQLite, fuente única de verdad)
        │
        ├─  scripts/db/export-lugares.mjs
        │       ▼
        │   src/data/lugares.js   ← el frontend sigue leyendo exactamente esto, sin cambios
        │   data/lugares.json     ← artefacto adicional, JSON con todos los campos
        │
        └─  scripts/db/export-csv.mjs
                ▼
            data/lugares.csv      ← catálogo mundial en CSV, todos los campos
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
Playwright en cada ronda de cambios: tras añadir las ubicaciones
internacionales, el mapa muestra "298 espacios visibles" (250 de España +
48 internacionales con coordenada verificada), los filtros por tipo
funcionan igual, cero errores en consola.

**Vista por defecto del mapa:** ya no se centra automáticamente en la
ubicación del visitante (se ha retirado esa función de geolocalización).
Al haber ahora lugares en varios continentes, el mapa se abre con una
vista fija del mundo completo, para que todos los espacios sean visibles
sin tener que desplazar el mapa manualmente.

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
- `tipo` — tipo concreto de lugar en lenguaje natural para el catálogo/CSV
  (p. ej. "Museo", "Aeropuerto", "Parque temático"). Distinto de
  `tipo_legacy`, que es específicamente el valor interno del mapa.
- `motivo_inclusion` — por qué cualifica el lugar: evidencia concreta
  (certificación, sala sensorial documentada oficialmente...), nunca una
  opinión ("parece tranquilo" no es un motivo válido).
- `adaptaciones_sensoriales` — lista libre de las adaptaciones descritas
  por la fuente (sala sensorial, horario tranquilo, mochilas sensoriales
  en préstamo...).
- `certificacion` — nombre del programa si lo tiene (p. ej. "IBCCES
  Certified Autism Center (CAC)", "KultureCity Sensory Inclusive"); `NULL`
  si el lugar cualifica por otra vía (p. ej. una sala sensorial oficial
  sin programa de certificación asociado).
- `codigo_iso` — código ISO 3166-1 alfa-2 del país (`ES`, `US`, `BR`...).
- `url_oficial` — la página oficial concreta que documenta la
  certificación/accesibilidad (distinta de `web_oficial`, que es la
  página principal del lugar).
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
| `lib.mjs` | Conexión compartida + aplica `schema.sql` al abrir + migra columnas nuevas si faltan |
| `import-lugares.mjs` | `lugares.js` → SQLite. Idempotente (`ON CONFLICT... DO UPDATE`), no duplica si se re-ejecuta |
| `export-lugares.mjs` | SQLite → `lugares.js` (solo con coordenadas) + `lugares.json` (todos) |
| `export-csv.mjs` | SQLite → `data/lugares.csv` (todos, columnas exactas del catálogo mundial) |
| `seed-internacional.mjs` | Siembra de las ubicaciones internacionales verificadas (ver abajo) |

`npm run db:import`, `npm run db:export` y `npm run db:csv` son atajos a
los tres scripts anteriores.

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
   `lugares.json`, y `npm run db:csv` para regenerar `data/lugares.csv`.
5. Revisa el diff de `src/data/lugares.js` — debe ser mínimo si no has
   tocado los lugares con coordenadas ya existentes.

## Cómo actualizar la base de datos SQLite

La base de datos vive en `data/refugio-sensorial.db` y está versionada en
git (como cualquier otro archivo del repo). Para modificarla:
- Con SQL directo: `sqlite3 data/refugio-sensorial.db` (o cualquier
  cliente SQLite/DBeaver/DB Browser for SQLite).
- Con un script Node como los de `scripts/db/`, reutilizando `openDb()`
  de `lib.mjs`.

Tras cualquier cambio, ejecuta `npm run db:export` y haz commit tanto del
`.db` como de los archivos regenerados.

## Cómo regenerar los JSON/lugares.js/CSV automáticamente

```
npm run db:export   # lugares.js + lugares.json
npm run db:csv       # lugares.csv
```

Esto NO se ejecuta en el CI/deploy (`deploy.yml` no lo llama) — es
deliberado: el pipeline de datos es un paso manual y consciente ("añadir
un lugar" es una decisión editorial, no algo que deba pasar solo con
cada `git push`). El build de producción sigue leyendo `lugares.js` tal
cual esté commiteado, igual que siempre.

## Las 53 ubicaciones internacionales verificadas

`seed-internacional.mjs` añade a la base de datos 53 ubicaciones físicas
verificadas fuera de España, cada una con su fuente citada. **48 de las
53 tienen coordenada real del edificio** (confirmada por una fuente,
nunca aproximada con el centro de la ciudad) y por tanto **sí aparecen ya
en el mapa**, junto a los 250 lugares de España (298 en total):

**Tercera ronda (parques inclusivos, temáticos, zoos y acuarios):**
Morgan's Wonderland y Morgan's Inspiration Island (San Antonio, primeros
parque temático y acuático "ultra-accesibles" del mundo), Sesame Place
Philadelphia, Peppa Pig Theme Park Florida, Dorney Park, Kennywood, Story
Land, Six Flags Over Texas y Six Flags Fiesta Texas (todos IBCCES CAC),
San Diego Zoo, San Diego Zoo Safari Park, National Aquarium (Baltimore) y
Shedd Aquarium (Chicago) (KultureCity Sensory Inclusive), Elmwood Park
Zoo (primer zoo del mundo con CAC) y Santa Barbara Zoo. Se investigaron y
**descartaron** por falta de evidencia verificable: Busch Gardens Tampa
Bay, SeaWorld San Diego (la certificación real es de Sesame Place San
Diego, un parque distinto en el mismo complejo), Hersheypark (la
certificación es de Hershey's Chocolate World, un recinto separado),
Dutch Wonderland y Moody Gardens.

- **Parques temáticos y de ocio (13):** Peppa Pig Theme Park Dallas-Fort
  Worth*, LEGOLAND California/Florida/New York/Korea*/Japan*, SeaWorld
  Orlando, Aquatica Orlando, Discovery Cove, Emirates Park Zoo and Resort
  (Abu Dabi), Dubai Aquarium & Underwater Zoo, Ripley's Aquarium of
  Canada — certificados IBCCES Certified Autism Center (CAC).
- **Estadios (4):** Lucas Oil Stadium, Gillette Stadium, Bank of America
  Stadium, AAMI Park (Melbourne) — certificados KultureCity Sensory
  Inclusive.
- **Aeropuertos (11):** Indianapolis, Salt Lake City, Orlando (MCO),
  Newark Liberty (Terminal A), San José Mineta (SJC), Cincinnati/Northern
  Kentucky (CVG), Dublín, Alicante-Elche Miguel Hernández, Josep
  Tarradellas Barcelona-El Prat, Tom Jobim/Galeão (Río de Janeiro),
  Tocumen (Panamá) — con salas sensoriales documentadas oficialmente o
  por prensa especializada.
- **Museos (7):** American Museum of Natural History, Houston Museum of
  Natural Science, Museum of the American Revolution, Kennedy Space
  Center Visitor Complex, Children's Museum of Pittsburgh, Denver Museum
  of Nature & Science, Museu Oscar Niemeyer (Curitiba, Brasil).
- **Acuarios (3):** The Florida Aquarium, Georgia Aquarium, Ripley's
  Aquarium of the Smokies.
- **Ferrocarril turístico (1):** Western Maryland Scenic Railroad* —
  IBCCES CAC.

`*` = todavía sin coordenada de edificio verificada (Peppa Pig, LEGOLAND
Korea, LEGOLAND Japan, Western Maryland Scenic Railroad) — quedan en la
base de datos y en el CSV/JSON, pero no se publican en el mapa hasta
completarse con una fuente real.

Cada entrada guarda, además de los campos base, `motivo_inclusion` (la
evidencia concreta), `adaptaciones_sensoriales`, `certificacion` (si
aplica) y `url_oficial` (la página exacta que documenta la certificación
o la sala sensorial, no solo la web general del lugar). Cuando la
evidencia disponible no confirmaba una certificación concreta (p. ej. The
Florida Aquarium, o San José Mineta mientras su sala sensorial está en
construcción), la ficha lo refleja con precisión en vez de asumirlo.

**Limitación técnica que sigue vigente:** el acceso directo a directorios
oficiales como `kulturecity.org` o `ibcces.org` (como listados
estructurados navegables) sigue bloqueado desde este entorno de
desarrollo (HTTP 403, verificado). Solo la búsqueda web funciona, y da
fragmentos de texto y enlaces a artículos/comunicados individuales, no
listados estructurados masivos. Por eso el catálogo mundial tiene 53
ubicaciones verificadas fuera de España, no los 1.000+ que pedía el
objetivo inicial — la calidad y la regla de "nunca inventar coordenadas
ni datos" pesa más que la cantidad, tal como se pidió explícitamente.
Una tercera parte de las direcciones que se propusieron para ampliar el
catálogo no pudieron confirmarse con una fuente real y se descartaron
(ver arriba) — es la misma regla aplicada de forma consistente, venga la
propuesta de una búsqueda propia o de una lista aportada por el usuario.

## Catálogo mundial en CSV (`data/lugares.csv`)

`npm run db:csv` exporta **toda** la base de datos (los 250 lugares de
España y las 53 ubicaciones internacionales, con o sin coordenadas) a un
único CSV en UTF-8, con las columnas exactas:

```
id, nombre, tipo, dirección, ciudad, provincia, país, código_iso,
latitud, longitud, descripción, motivo_inclusión, adaptaciones_sensoriales,
certificación, nivel_verificación, web_oficial, url_oficial, fuente,
fecha_verificación
```

Es un artefacto adicional para consulta/análisis externo — no lo lee el
frontend ni el pipeline de build, igual que `lugares.json`.

## Sistema redundante eliminado

Una sesión anterior había construido una tabla equivalente en Supabase
(`ubicaciones_verificadas`, Postgres, un servicio externo) para el mismo
objetivo. Quedó redundante en cuanto existió la base SQLite — misma
función, pero dependiendo de un servicio externo en vez de cumplir "sin
backend, sin coste" de forma literal. Se ha eliminado por completo:
`scripts/import-ubicaciones.mjs`, `data/ubicaciones-seed.json`,
`docs/ubicaciones-verificadas.md` y la migración `0003` (nunca llegó a
tener datos de producción reales, solo las mismas 8 ubicaciones de
prueba que ahora viven en SQLite). Se añadió `supabase/migrations/0004_eliminar_ubicaciones_verificadas.sql`
por si alguna vez se llegó a ejecutar `0003` en un proyecto Supabase real
— es seguro ejecutarla tanto si se aplicó como si no.

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
