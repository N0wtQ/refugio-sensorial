-- Esquema de la base de datos de lugares (SQLite).
-- Fuente única de verdad para src/data/lugares.js — ver docs/base-de-datos-lugares.md.
--
-- Deliberadamente mínimo (dos tablas): una relación (categorías) solo
-- porque evita nombres de categoría duplicados/inconsistentes a medida
-- que la base crece; todo lo demás vive en una sola tabla plana.

CREATE TABLE IF NOT EXISTS categorias (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

-- Categorías principales: pocas y claras, pensadas para minimizar la
-- carga cognitiva en una futura interfaz (no se muestran aún en el
-- frontend actual — ver "Qué NO cambia" en la documentación).
INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES
  ('Museos y cultura',      'Museos, centros culturales, monumentos'),
  ('Parques y naturaleza',  'Parques, jardines, espacios naturales'),
  ('Bibliotecas y estudio', 'Bibliotecas y salas de estudio'),
  ('Cafés y descanso',      'Cafeterías, restaurantes tranquilos'),
  ('Ocio y turismo',        'Actividades de ocio, turismo, entretenimiento'),
  ('Transporte',            'Aeropuertos, estaciones y otros puntos de transporte'),
  ('Alojamiento',           'Hoteles y alojamientos'),
  ('Salud',                 'Centros de salud y bienestar'),
  ('Otros',                 'No encaja en las categorías anteriores');

CREATE TABLE IF NOT EXISTS lugares (
  id                   TEXT PRIMARY KEY,   -- se conserva el id original de lugares.js (p. ej. 'REAL-001')
  nombre               TEXT NOT NULL,
  categoria_id         INTEGER NOT NULL REFERENCES categorias(id),

  -- Subcategoría interna (p. ej. "acuario", "zoológico") — NUNCA se
  -- muestra como filtro principal en la interfaz, solo es metadato.
  subcategoria         TEXT,

  -- Valor de "tipo" que usa HOY el frontend (SilentMap.jsx / TYPE_CONFIG:
  -- supermercado, biblioteca, centro_comercial...). Se mantiene para que
  -- el exportador pueda regenerar lugares.js sin tocar el frontend.
  -- Cuando exista una segunda fase de UI que use `categoria_id`
  -- directamente, esta columna se podrá retirar.
  tipo_legacy          TEXT NOT NULL,

  -- Tipo concreto de lugar (Museo, Aeropuerto, Zoológico...) — más
  -- granular que categoria_id, para catálogo/CSV. Distinto de
  -- tipo_legacy (que es específicamente el valor que usa hoy el mapa).
  tipo                 TEXT,

  descripcion          TEXT,
  motivo_inclusion     TEXT,             -- por qué cualifica (evidencia concreta, no opinión)
  adaptaciones_sensoriales TEXT,         -- lista libre: "Sala sensorial, horario tranquilo..."
  certificacion        TEXT,             -- p. ej. "KultureCity Sensory Inclusive", "IBCCES CAC"

  direccion            TEXT,
  ciudad               TEXT,
  provincia_region     TEXT,
  pais                 TEXT NOT NULL DEFAULT 'España',
  codigo_iso           TEXT,             -- ISO 3166-1 alfa-2, p. ej. 'ES', 'US'
  -- NULL cuando no se conoce la coordenada exacta del edificio y no se
  -- quiere aproximar con el centro de la ciudad (norma explícita del
  -- proyecto). Un lugar sin coordenadas no se exporta al mapa hasta
  -- completarse — ver export-lugares.mjs.
  latitud              REAL,
  longitud             REAL,

  web_oficial          TEXT,             -- página principal del lugar
  url_oficial          TEXT,             -- página oficial concreta sobre su accesibilidad/certificación
  fuente               TEXT,             -- URL de la fuente que verifica el dato (puede ser un tercero fiable)

  nivel_verificacion   TEXT NOT NULL DEFAULT 'Verificado - Documentación pública'
    CHECK (nivel_verificacion IN (
      'Verificado - Fuente oficial',
      'Verificado - Prensa o medio reconocido',
      'Verificado - Documentación pública'
    )),

  -- Nivel de evidencia sobre autismo/sensorial (distinto de
  -- nivel_verificacion, que mide la fiabilidad de la FUENTE). Nivel 1:
  -- hay evidencia pública de una medida específica para autismo/necesidades
  -- sensoriales (sala sensorial, CAC, KultureCity, Sunflower, horario de
  -- baja estimulación, mochilas sensoriales, mapas sensoriales...). Nivel
  -- 2: no hay medida específica verificada, pero el lugar es real y por
  -- sus características (jardín botánico, parque amplio, biblioteca
  -- grande, museo poco concurrido...) puede resultar adecuado — nunca se
  -- describe como "autism-friendly" ni con adaptaciones inventadas.
  nivel_evidencia      TEXT NOT NULL DEFAULT 'Nivel 1 - Verificado'
    CHECK (nivel_evidencia IN (
      'Nivel 1 - Verificado',
      'Nivel 2 - Entorno potencialmente adecuado'
    )),

  fecha_actualizacion  TEXT NOT NULL DEFAULT (date('now')),

  -- Campo legacy que hoy muestra el popup del mapa (p. ej. "14:30–16:30").
  horario              TEXT
);

-- Migración idempotente para bases de datos creadas antes de que
-- existieran estas columnas (ALTER TABLE ADD COLUMN no admite
-- IF NOT EXISTS en SQLite; lib.mjs comprueba con PRAGMA table_info
-- antes de ejecutar esto, así que fallar aquí en una BD nueva es
-- inofensivo — la tabla ya se creó con todas las columnas arriba).

CREATE INDEX IF NOT EXISTS idx_lugares_categoria    ON lugares(categoria_id);
CREATE INDEX IF NOT EXISTS idx_lugares_pais          ON lugares(pais);
CREATE INDEX IF NOT EXISTS idx_lugares_ciudad        ON lugares(ciudad);
CREATE INDEX IF NOT EXISTS idx_lugares_tipo_legacy   ON lugares(tipo_legacy);
CREATE INDEX IF NOT EXISTS idx_lugares_verificacion  ON lugares(nivel_verificacion);
CREATE INDEX IF NOT EXISTS idx_lugares_evidencia      ON lugares(nivel_evidencia);
