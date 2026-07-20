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

  descripcion          TEXT,
  direccion            TEXT,
  ciudad               TEXT,
  provincia_region     TEXT,
  pais                 TEXT NOT NULL DEFAULT 'España',
  -- NULL cuando no se conoce la coordenada exacta del edificio y no se
  -- quiere aproximar con el centro de la ciudad (norma explícita del
  -- proyecto). Un lugar sin coordenadas no se exporta al mapa hasta
  -- completarse — ver export-lugares.mjs.
  latitud              REAL,
  longitud             REAL,

  web_oficial          TEXT,
  fuente               TEXT,             -- URL de la fuente que verifica el dato

  nivel_verificacion   TEXT NOT NULL DEFAULT 'Verificado - Documentación pública'
    CHECK (nivel_verificacion IN (
      'Verificado - Fuente oficial',
      'Verificado - Prensa o medio reconocido',
      'Verificado - Documentación pública'
    )),
  fecha_actualizacion  TEXT NOT NULL DEFAULT (date('now')),

  -- Campo legacy que hoy muestra el popup del mapa (p. ej. "14:30–16:30").
  horario              TEXT
);

CREATE INDEX IF NOT EXISTS idx_lugares_categoria    ON lugares(categoria_id);
CREATE INDEX IF NOT EXISTS idx_lugares_pais          ON lugares(pais);
CREATE INDEX IF NOT EXISTS idx_lugares_ciudad        ON lugares(ciudad);
CREATE INDEX IF NOT EXISTS idx_lugares_tipo_legacy   ON lugares(tipo_legacy);
CREATE INDEX IF NOT EXISTS idx_lugares_verificacion  ON lugares(nivel_verificacion);
