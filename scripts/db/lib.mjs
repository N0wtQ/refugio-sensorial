// Conexión compartida a la base de datos SQLite de lugares.
// Usa node:sqlite (incluido en Node — sin dependencias nuevas, sin coste).
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const DB_PATH = fileURLToPath(new URL('../../data/refugio-sensorial.db', import.meta.url))
const SCHEMA_PATH = fileURLToPath(new URL('./schema.sql', import.meta.url))

export function openDb() {
  const db = new DatabaseSync(DB_PATH)
  db.exec(readFileSync(SCHEMA_PATH, 'utf8'))
  return db
}

// Mapa tipo_legacy → categoría principal. Se usa al importar/crear
// lugares para asignar automáticamente la categoría simplificada.
export const CATEGORIA_POR_TIPO = {
  supermercado:           'Otros',
  centro_comercial:       'Otros',
  centro_civico:          'Otros',
  biblioteca:             'Bibliotecas y estudio',
  sala_estudio:           'Bibliotecas y estudio',
  espacio_natural:        'Parques y naturaleza',
  cultura:                'Museos y cultura',
  hotel:                  'Alojamiento',
  aeropuerto:             'Transporte',
  restaurante_silencioso: 'Cafés y descanso',
  sunflower:              'Otros',
  coworking:              'Otros',
}

export function categoriaIdPorNombre(db, nombre) {
  const row = db.prepare('SELECT id FROM categorias WHERE nombre = ?').get(nombre)
  if (!row) throw new Error(`Categoría desconocida: "${nombre}" — añádela primero en schema.sql`)
  return row.id
}
