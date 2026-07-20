// Conexión compartida a la base de datos SQLite de lugares.
// Usa node:sqlite (incluido en Node — sin dependencias nuevas, sin coste).
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const DB_PATH = fileURLToPath(new URL('../../data/refugio-sensorial.db', import.meta.url))
const SCHEMA_PATH = fileURLToPath(new URL('./schema.sql', import.meta.url))

// Columnas añadidas a `lugares` después de su creación inicial. Se
// aplican con ALTER TABLE solo si faltan — así una base de datos ya
// existente (creada con un esquema anterior) se pone al día sin perder
// filas, y una base de datos nueva (que ya nace con estas columnas en
// el CREATE TABLE de schema.sql) simplemente no tiene nada que migrar.
const COLUMNAS_NUEVAS = {
  tipo: 'TEXT',
  motivo_inclusion: 'TEXT',
  adaptaciones_sensoriales: 'TEXT',
  certificacion: 'TEXT',
  codigo_iso: 'TEXT',
  url_oficial: 'TEXT',
  // Todo lo que ya existía en la base de datos antes de este campo tenía
  // evidencia específica de autismo/sensorial (Hora silenciosa, CAC,
  // KultureCity, sala sensorial...) — Nivel 1 es el valor correcto para
  // esas filas, no una migración "de paso".
  nivel_evidencia: "TEXT DEFAULT 'Nivel 1 - Verificado'",
}

function migrarColumnasFaltantes(db) {
  const existentes = new Set(db.prepare('PRAGMA table_info(lugares)').all().map(c => c.name))
  for (const [columna, tipo] of Object.entries(COLUMNAS_NUEVAS)) {
    if (!existentes.has(columna)) {
      db.exec(`ALTER TABLE lugares ADD COLUMN ${columna} ${tipo}`)
    }
  }
}

export function openDb() {
  const db = new DatabaseSync(DB_PATH)
  const schema = readFileSync(SCHEMA_PATH, 'utf8')
  // En una base de datos existente sin las columnas nuevas, los CREATE
  // INDEX de schema.sql sobre esas columnas fallan hasta que
  // migrarColumnasFaltantes las añade — de ahí el try/catch y la segunda
  // pasada (CREATE TABLE/INDEX ... IF NOT EXISTS hace que sea inofensivo
  // repetirlo).
  try {
    db.exec(schema)
  } catch {
    // ignorado: se reintenta tras migrar columnas
  }
  migrarColumnasFaltantes(db)
  db.exec(schema)
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
