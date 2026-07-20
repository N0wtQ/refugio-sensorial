// Regenera src/data/lugares.js (mismo formato exacto que hoy — el
// frontend no cambia ni una línea) y data/lugares.json (artefacto
// adicional en JSON puro) a partir de la base de datos SQLite.
//
//   node scripts/db/export-lugares.mjs

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { openDb } from './lib.mjs'

const LUGARES_JS_PATH = fileURLToPath(new URL('../../src/data/lugares.js', import.meta.url))
const LUGARES_JSON_PATH = fileURLToPath(new URL('../../data/lugares.json', import.meta.url))

function jsString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

const db = openDb()
// ORDER BY rowid conserva el orden de inserción original (el mismo
// orden en que aparecían en lugares.js antes de esta migración).
const filas = db.prepare('SELECT * FROM lugares ORDER BY rowid').all()
db.close()

// ── src/data/lugares.js — formato idéntico al actual, el frontend no cambia.
// Solo se publican lugares con coordenadas reales: un lugar sin latitud/
// longitud verificadas (todavía) no puede dibujarse en el mapa sin
// aproximar con el centro de la ciudad, algo que el proyecto prohíbe.
const conCoordenadas = filas.filter(f => f.latitud != null && f.longitud != null)
const sinCoordenadas = filas.length - conCoordenadas.length

const lineasLugares = conCoordenadas.map(f =>
  `  {id:${jsString(f.id)},lat:${f.latitud},lng:${f.longitud},nombre:${jsString(f.nombre)},` +
  `tipo:${jsString(f.tipo_legacy)},ciudad:${jsString(f.ciudad ?? '')},` +
  `horario:${jsString(f.horario ?? '')},descripcion:${jsString(f.descripcion ?? '')},` +
  `url:${jsString(f.fuente ?? '')}},`
)

const tipos = [...new Set(conCoordenadas.map(f => f.tipo_legacy))].sort()

const contenidoJs =
  `// Auto-generado por scripts/db/export-lugares.mjs desde data/refugio-sensorial.db — ${conCoordenadas.length} lugares verificados\n` +
  `export const LUGARES = [\n${lineasLugares.join('\n')}\n]\n\n` +
  `export const TIPOS = [${tipos.map(t => `"${t}"`).join(', ')}]\n`

writeFileSync(LUGARES_JS_PATH, contenidoJs, 'utf8')

// ── data/lugares.json — artefacto adicional en JSON puro, con todos los
// campos del esquema (no solo los que usa el frontend hoy).
const lugaresJson = filas.map(f => ({
  id: f.id,
  nombre: f.nombre,
  categoria_id: f.categoria_id,
  subcategoria: f.subcategoria,
  tipo_legacy: f.tipo_legacy,
  tipo: f.tipo,
  descripcion: f.descripcion,
  motivo_inclusion: f.motivo_inclusion,
  adaptaciones_sensoriales: f.adaptaciones_sensoriales,
  certificacion: f.certificacion,
  direccion: f.direccion,
  ciudad: f.ciudad,
  provincia_region: f.provincia_region,
  pais: f.pais,
  codigo_iso: f.codigo_iso,
  latitud: f.latitud,
  longitud: f.longitud,
  web_oficial: f.web_oficial,
  url_oficial: f.url_oficial,
  fuente: f.fuente,
  nivel_verificacion: f.nivel_verificacion,
  nivel_evidencia: f.nivel_evidencia,
  fecha_actualizacion: f.fecha_actualizacion,
  horario: f.horario,
}))

writeFileSync(LUGARES_JSON_PATH, JSON.stringify(lugaresJson, null, 2) + '\n', 'utf8')

console.log(`Exportados ${conCoordenadas.length} lugares con coordenadas → src/data/lugares.js`)
console.log(`Exportados ${filas.length} lugares (todos, incl. sin coordenadas) → data/lugares.json`)
if (sinCoordenadas > 0) {
  console.log(`${sinCoordenadas} lugar(es) en la base de datos sin coordenadas todavía — no aparecen en el mapa hasta completarse.`)
}
