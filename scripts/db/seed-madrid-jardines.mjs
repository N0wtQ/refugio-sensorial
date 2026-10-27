// Jardines tranquilos de Madrid aportados por el usuario (octubre 2026).
// Ninguno tiene una medida específica para autismo documentada, así que
// entran como Nivel 2, con la nota obligatoria en la descripción.
//
// Coordenadas:
//  - Jardines de San Francisco el Grande: 40.410018, -3.714366
//    (Gran Vía de San Francisco 29; enlace de mapa en wanderlog.com,
//    coherente con la dirección oficial de esmadrid.com).
//  - Rosaleda de El Retiro: N 40º 24.680' W 003º 40.832' = 40.411333, -3.680533.
//
// Descartado a propósito: Jardín Concejal Alejandro Muñoz Revenga (Chamberí).
// Tiene parque infantil y pista de minibasket/fútbol desde 2019 (eldiario.es)
// y conciertos de verano del distrito: no encaja como entorno tranquilo.
//
//   node scripts/db/seed-madrid-jardines.mjs && npm run db:export && npm run db:csv

import { openDb, categoriaIdPorNombre } from './lib.mjs'

const db = openDb()
const NOTA_NIVEL2 = 'Este lugar no dispone de medidas específicas para el autismo verificadas, pero puede resultar adecuado por su entorno tranquilo.'

const insertar = db.prepare(`
  INSERT INTO lugares (
    id, nombre, categoria_id, tipo_legacy, tipo, descripcion, motivo_inclusion,
    direccion, ciudad, provincia_region, pais, codigo_iso,
    latitud, longitud, web_oficial, fuente,
    nivel_verificacion, nivel_evidencia, fecha_actualizacion, horario
  ) VALUES (
    @id, @nombre, @categoria_id, 'espacio_natural', @tipo, @descripcion, @motivo,
    @direccion, 'Madrid', 'Comunidad de Madrid', 'España', 'ES',
    @latitud, @longitud, @web, @fuente,
    'Verificado - Fuente oficial', 'Nivel 2 - Entorno potencialmente adecuado',
    date('now'), @horario
  )
  ON CONFLICT(id) DO UPDATE SET
    nombre = excluded.nombre, descripcion = excluded.descripcion, motivo_inclusion = excluded.motivo_inclusion,
    direccion = excluded.direccion, latitud = excluded.latitud, longitud = excluded.longitud,
    fuente = excluded.fuente, horario = excluded.horario, fecha_actualizacion = excluded.fecha_actualizacion
`)

const filas = [
  {
    id: 'LVL2-279',
    nombre: 'Jardines de San Francisco el Grande',
    tipo: 'Jardín',
    direccion: 'Gran Vía de San Francisco, 25-29, 28005 Madrid (La Latina)',
    latitud: 40.410018, longitud: -3.714366,
    web: 'https://www.esmadrid.com/informacion-turistica/jardines-san-francisco-grande',
    fuente: 'https://www.esmadrid.com/informacion-turistica/jardines-san-francisco-grande',
    horario: 'Abierto todo el año',
    descripcion: 'Jardín de unos 4.200 m² junto a la Real Basílica de San Francisco el Grande, con 21 variedades de rosales (floración en mayo y junio) y un mirador hacia el oeste. Es pequeño y con bancos, así que se puede entrar, sentarse y salir rápido. Más tranquilo entre semana por la mañana; evita el domingo (Rastro) y el atardecer en el mirador.',
    motivo: 'Jardín pequeño y con bancos, fuera de las rutas turísticas principales de La Latina (aportado por el usuario).',
  },
  {
    id: 'LVL2-280',
    nombre: 'Rosaleda de El Retiro',
    tipo: 'Jardín (rosaleda)',
    direccion: 'Parque del Retiro, zona sur, junto a la Fuente del Ángel Caído. Madrid',
    latitud: 40.411333, longitud: -3.680533,
    web: 'https://www.esmadrid.com/node/69403',
    fuente: 'https://www.esmadrid.com/node/69403',
    horario: 'Horario del Parque del Retiro',
    descripcion: 'Rosaleda diseñada en 1915 por el jardinero municipal Cecilio Rodríguez, con más de 4.000 rosales, fuentes y pérgolas. Entrada gratuita. Al tener varios caminos, permite alejarse de cualquier grupo sin salir del recinto. Más tranquila los laborables antes de las 11:00; en mayo y junio, con la floración, hay más visitantes.',
    motivo: 'Recinto ajardinado con varios caminos dentro del Retiro, menos concurrido que el estanque o el Palacio de Cristal (aportado por el usuario).',
  },
]

for (const f of filas) {
  insertar.run({ ...f, categoria_id: categoriaIdPorNombre(db, 'Parques y naturaleza'), descripcion: `${f.descripcion} ${NOTA_NIVEL2}` })
}
console.log(`Insertados/actualizados ${filas.length} jardines de Madrid (Nivel 2).`)
db.close()
