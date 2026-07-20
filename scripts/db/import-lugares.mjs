// Importa los 250 lugares actuales de src/data/lugares.js a SQLite.
// Idempotente: se puede volver a ejecutar sin crear duplicados (usa
// INSERT OR REPLACE por id, que es estable y se conserva del origen).
//
//   node scripts/db/import-lugares.mjs
//
// No se pierde ningún dato: todos los campos de lugares.js (id, lat, lng,
// nombre, tipo, ciudad, horario, descripcion, url) se guardan tal cual,
// más una categoría principal asignada automáticamente a partir del tipo.

import { openDb, categoriaIdPorNombre, CATEGORIA_POR_TIPO } from './lib.mjs'
import { LUGARES } from '../../src/data/lugares.js'

const db = openDb()

const insertar = db.prepare(`
  INSERT INTO lugares (
    id, nombre, categoria_id, tipo_legacy, descripcion,
    ciudad, pais, latitud, longitud, fuente, horario,
    nivel_verificacion, fecha_actualizacion
  ) VALUES (
    @id, @nombre, @categoria_id, @tipo_legacy, @descripcion,
    @ciudad, 'España', @latitud, @longitud, @fuente, @horario,
    'Verificado - Documentación pública', date('now')
  )
  ON CONFLICT(id) DO UPDATE SET
    nombre = excluded.nombre,
    categoria_id = excluded.categoria_id,
    tipo_legacy = excluded.tipo_legacy,
    descripcion = excluded.descripcion,
    ciudad = excluded.ciudad,
    latitud = excluded.latitud,
    longitud = excluded.longitud,
    fuente = excluded.fuente,
    horario = excluded.horario
`)

let creados = 0
for (const l of LUGARES) {
  const categoriaNombre = CATEGORIA_POR_TIPO[l.tipo] ?? 'Otros'
  insertar.run({
    id: l.id,
    nombre: l.nombre,
    categoria_id: categoriaIdPorNombre(db, categoriaNombre),
    tipo_legacy: l.tipo,
    descripcion: l.descripcion ?? null,
    ciudad: l.ciudad ?? null,
    latitud: l.lat,
    longitud: l.lng,
    fuente: l.url ?? null,
    horario: l.horario ?? null,
  })
  creados++
}

const total = db.prepare('SELECT COUNT(*) AS n FROM lugares').get().n
console.log(`Importados/actualizados ${creados} lugares desde lugares.js. Total en la base de datos: ${total}.`)

db.close()
