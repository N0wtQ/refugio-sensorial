# Base de datos de ubicaciones verificadas

Infraestructura para una base de datos mundial de ubicaciones con medidas de
accesibilidad sensorial verificadas por fuentes oficiales (KultureCity,
IBCCES, aeropuertos, cadenas con "Quiet Hour", etc.), distinta de:

- `espacios_comunidad` (migración `0002`): abierta, cualquiera añade un
  punto sin verificación — es la capa de "Añadir espacio" en `/espacios`.
- `src/data/lugares.js`: 250 sitios de España curados a mano por el
  proyecto, estáticos en el bundle JS.

Esta tabla nueva (`ubicaciones_verificadas`) es de **solo lectura pública**;
la escritura se hace exclusivamente con la `service_role` key de Supabase,
vía `scripts/import-ubicaciones.mjs`, nunca desde el navegador.

## ⚠️ Léeme primero: qué se ha podido hacer y qué no

Se pidieron **al menos 500 ubicaciones reales verificadas en todo el
mundo**. Antes de tocar ni una línea de código comprobé si podía cumplirlo:

- El acceso directo a los directorios oficiales (`kulturecity.org`,
  `ibcces.org` y similares) está **bloqueado** desde este entorno (HTTP 403
  en cada intento — lo verifiqué en vivo, no es una suposición).
- La búsqueda web sí funciona, pero solo devuelve fragmentos breves de
  texto, no listados estructurados con dirección y coordenadas. Cada
  ubicación individual requiere una búsqueda propia y una lectura cuidadosa
  del resultado para no inventar nada.

Con ese método conseguí documentar **8 ubicaciones reales**, cada una con
su fuente oficial citada (ver `data/ubicaciones-seed.json`): tres
aeropuertos/estadios y un parque temático en EE. UU., y un zoológico y un
acuario en Emiratos Árabes Unidos, todos con certificación KultureCity
Sensory Inclusive o IBCCES Certified Autism Center. **Ninguna tiene
coordenadas** — la búsqueda no las proporcionó y no las he inventado.

Esto demuestra que el proceso funciona de principio a fin (buscar → verificar
→ deduplicar → importar), pero está a años luz de las 500-10.000 pedidas.
Llegar a esa escala con datos genuinamente verificados requiere una de
estas rutas:

1. **Tú me facilitas los datos** — si tienes acceso a una exportación
   oficial de KultureCity, IBCCES, o cualquier organización similar (CSV,
   API, PDF de socios certificados...), yo la transformo al formato de
   `ubicaciones-seed.json`, valido cada campo y la importo. Es, con
   diferencia, la vía más rápida y fiable.
2. **Investigación manual, ubicación a ubicación** — puedo seguir el mismo
   proceso que con estas 8, pero es lento (una búsqueda por sitio, muchas
   sin coordenadas) y avanzar a cientos llevaría muchas sesiones.
3. **Herramientas con más acceso a internet** — si en algún momento cuento
   con un entorno sin este bloqueo de red, o con una API de geocodificación
   permitida, el mismo pipeline (script + esquema) escala sin cambios.

## Esquema

`categorias_verificadas` — lista controlada de categorías (evita
duplicados tipo "Sala sensorial" / "Salas Sensoriales"). Ya incluye 11
categorías de partida (Aeropuerto, Parque temático, Estadio o recinto
deportivo, Zoológico o acuario, Museo, Hotel, Centro comercial,
Supermercado, Cine o teatro, Biblioteca, Otro); el script de importación
crea una categoría nueva automáticamente si no encuentra coincidencia.

`ubicaciones_verificadas` — campos: `nombre`, `categoria_id`, `direccion`,
`ciudad`, `provincia_estado`, `pais`, `codigo_postal`, `latitud`,
`longitud`, `descripcion`, `adaptaciones_sensoriales` (array),
`horarios_tranquilos`, `certificaciones` (array), `sitio_web`, `telefono`,
`imagenes` (array), y los campos de verificación **obligatorios**:
`fecha_verificacion` y `fuente_url` (+ `fuente_nombre` opcional). Sin fuente,
el script de importación descarta la fila — no hay forma de que entre un
registro sin verificación.

**Índices** para las búsquedas pedidas:
- Mapa → índice sobre `(latitud, longitud)`.
- Texto → columna `busqueda` (tsvector generado) + índice GIN.
- País / ciudad / categoría → índices individuales.
- Adaptaciones sensoriales / certificaciones → índices GIN sobre los arrays.

**Deduplicación**: índice único sobre `(nombre, ciudad, país)` en
minúsculas como guardarraíl automático, más la comprobación del script de
importación (busca por esos mismos campos antes de insertar: si existe,
actualiza; si no, crea) — tal como pediste en los pasos 1-4.

## Cómo añadir ubicaciones

1. Prepara un JSON con el mismo formato que `data/ubicaciones-seed.json`
   (un array de objetos). Campos obligatorios: `nombre`, `pais`,
   `categoria`, `fecha_verificacion`, `fuente_url`.
2. Ejecuta las migraciones `0001`, `0002` y `0003` en el SQL Editor de
   Supabase (en ese orden) si aún no lo has hecho.
3. Obtén la `service_role key` en Supabase → Settings → API (⚠️ nunca la
   subas al repositorio ni la pongas en una variable `VITE_*`).
4. Ejecuta:
   ```
   SUPABASE_URL=https://tu-proyecto.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key \
   node scripts/import-ubicaciones.mjs data/ubicaciones-seed.json
   ```
5. El script imprime un resumen: cuántas se crearon, actualizaron o
   descartaron (y por qué).

## Qué falta para que esto se vea en la web

Esta entrega es solo la infraestructura de datos (esquema + importación).
Con 8 filas no tiene sentido todavía construir una interfaz — mostraría un
mapa casi vacío bajo la promesa de "ubicaciones verificadas en todo el
mundo". En cuanto haya un volumen real, el paso siguiente natural es una
nueva capa en el mapa de `/espacios` (o una sección propia), con
paginación/filtrado en el servidor en vez de cargarlo todo en el bundle
como hace hoy `lugares.js`.
