// Exporta TODA la base de datos (incluidos los lugares sin coordenadas
// todavía) a un CSV en UTF-8 con las columnas exactas solicitadas para el
// catálogo mundial de lugares sensorialmente amigables. Es un artefacto
// adicional: no lo consume el frontend ni el pipeline de build.
//
//   node scripts/db/export-csv.mjs

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { openDb } from './lib.mjs'

const CSV_PATH = fileURLToPath(new URL('../../data/lugares.csv', import.meta.url))

const COLUMNAS = [
  'id', 'nombre', 'tipo', 'dirección', 'ciudad', 'provincia', 'país',
  'código_iso', 'latitud', 'longitud', 'descripción', 'motivo_inclusión',
  'adaptaciones_sensoriales', 'certificación', 'nivel_verificación',
  'web_oficial', 'url_oficial', 'fuente', 'fecha_verificación',
]

function csvField(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

const db = openDb()
const filas = db.prepare('SELECT * FROM lugares ORDER BY rowid').all()
db.close()

const lineas = filas.map(f => [
  f.id, f.nombre, f.tipo ?? f.tipo_legacy, f.direccion, f.ciudad,
  f.provincia_region, f.pais, f.codigo_iso, f.latitud, f.longitud,
  f.descripcion, f.motivo_inclusion, f.adaptaciones_sensoriales,
  f.certificacion, f.nivel_verificacion, f.web_oficial, f.url_oficial,
  f.fuente, f.fecha_actualizacion,
].map(csvField).join(','))

const contenido = '﻿' + [COLUMNAS.join(','), ...lineas].join('\n') + '\n'

writeFileSync(CSV_PATH, contenido, 'utf8')
console.log(`Exportados ${filas.length} lugares → data/lugares.csv`)
