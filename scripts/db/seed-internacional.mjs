// Primeras ubicaciones internacionales verificadas — mismas 8 ya
// documentadas y citadas con fuente oficial (ver docs/base-de-datos-lugares.md
// para el detalle de cada una). Ninguna tiene coordenadas: la búsqueda no
// las dio y no se han inventado. Se guardan como NULL — nunca se aproxima
// con el centro de la ciudad. Un lugar sin coordenadas no se exporta al
// mapa hasta completarse con datos reales (ver export-lugares.mjs).
//
//   node scripts/db/seed-internacional.mjs

import { openDb, categoriaIdPorNombre } from './lib.mjs'

const db = openDb()

const insertar = db.prepare(`
  INSERT INTO lugares (
    id, nombre, categoria_id, tipo_legacy, descripcion, direccion,
    ciudad, provincia_region, pais, latitud, longitud, web_oficial,
    fuente, nivel_verificacion, fecha_actualizacion
  ) VALUES (
    @id, @nombre, @categoria_id, @tipo_legacy, @descripcion, @direccion,
    @ciudad, @provincia_region, @pais, @latitud, @longitud, @web_oficial,
    @fuente, @nivel_verificacion, date('now')
  )
  ON CONFLICT(id) DO UPDATE SET
    descripcion = excluded.descripcion, fuente = excluded.fuente
`)

const lugares = [
  {
    id: 'INTL-001', nombre: 'Peppa Pig Theme Park Dallas-Fort Worth',
    categoria: 'Ocio y turismo', tipo_legacy: 'parque_tematico',
    descripcion: 'Parque temático infantil certificado Certified Autism Center (CAC) por IBCCES desde su apertura el 1 de marzo de 2025.',
    direccion: '8851 26th Blvd', ciudad: 'North Richland Hills', provincia_region: 'TX', pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://www.peppapigthemepark.com/dallas-ft-worth/',
    fuente: 'https://www.peppapigthemepark.com/dallas-ft-worth/press-releases/peppa-pig-theme-park-dallas-fort-worth-announces-its-status-as-a-certified-autism-center/',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-002', nombre: 'Indianapolis International Airport (IND)',
    categoria: 'Transporte', tipo_legacy: 'aeropuerto',
    descripcion: 'Aeropuerto certificado KultureCity Sensory Inclusive, con dos salas sensoriales tras el control de seguridad, una en cada terminal.',
    direccion: null, ciudad: 'Indianapolis', provincia_region: 'IN', pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://www.ind.com',
    fuente: 'https://www.ind.com/about/media/media-releases/indy-airport-is-now-a-certified-sensory-inclusive-venue',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-003', nombre: 'Salt Lake City International Airport (SLC)',
    categoria: 'Transporte', tipo_legacy: 'aeropuerto',
    descripcion: 'Primera de tres salas sensoriales previstas, inaugurada en marzo de 2025 en el Concourse A-west, diseñada por KultureCity.',
    direccion: null, ciudad: 'Salt Lake City', provincia_region: 'UT', pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://slcairport.com',
    fuente: 'https://slcairport.com/blog/2025/04/accessibility-at-slc-supporting-passengers-with-sensory-needs/',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-004', nombre: 'Lucas Oil Stadium',
    categoria: 'Ocio y turismo', tipo_legacy: 'estadio',
    descripcion: 'Estadio de los Indianapolis Colts (NFL), certificado como recinto Sensory Inclusive por KultureCity.',
    direccion: null, ciudad: 'Indianapolis', provincia_region: 'IN', pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://www.lucasoilstadium.com',
    fuente: 'https://www.lucasoilstadium.com/lucas-oil-stadium-is-certified-sensory-inclusive/',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-005', nombre: 'Gillette Stadium',
    categoria: 'Ocio y turismo', tipo_legacy: 'estadio',
    descripcion: 'Estadio de los New England Patriots (NFL), con sala sensorial y certificación Sensory Inclusive de KultureCity.',
    direccion: null, ciudad: null, provincia_region: null, pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://www.gillettestadium.com',
    fuente: 'https://www.gillettestadium.com/gillette-stadium-announces-addition-of-sensory-room-and-certification-as-sensory-inclusive-stadium/',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-006', nombre: 'Bank of America Stadium',
    categoria: 'Ocio y turismo', tipo_legacy: 'estadio',
    descripcion: 'Estadio de los Carolina Panthers (NFL), certificado como recinto Sensory Inclusive por KultureCity.',
    direccion: null, ciudad: 'Charlotte', provincia_region: 'NC', pais: 'Estados Unidos',
    latitud: null, longitud: null,
    web_oficial: 'https://www.panthers.com',
    fuente: 'https://www.panthers.com/news/bank-of-america-stadium-certified-as-a-kulturecity-sensory-inclusive-venue',
    nivel_verificacion: 'Verificado - Fuente oficial',
  },
  {
    id: 'INTL-007', nombre: 'Emirates Park Zoo and Resort',
    categoria: 'Parques y naturaleza', tipo_legacy: 'zoologico_acuario',
    descripcion: 'Zoológico y resort certificado como Certified Autism Center (CAC) por IBCCES.',
    direccion: '12th Street, Al Bahyah', ciudad: 'Abu Dabi', provincia_region: null, pais: 'Emiratos Árabes Unidos',
    latitud: null, longitud: null,
    web_oficial: null,
    fuente: 'https://autismtravel.com/travel-directory/',
    nivel_verificacion: 'Verificado - Documentación pública',
  },
  {
    id: 'INTL-008', nombre: 'Dubai Aquarium & Underwater Zoo',
    categoria: 'Parques y naturaleza', tipo_legacy: 'zoologico_acuario',
    descripcion: 'Acuario certificado como Certified Autism Center (CAC) por IBCCES.',
    direccion: 'Level 2, The Dubai Mall, Downtown Dubai', ciudad: 'Dubái', provincia_region: null, pais: 'Emiratos Árabes Unidos',
    latitud: null, longitud: null,
    web_oficial: null,
    fuente: 'https://autismtravel.com/travel-directory/',
    nivel_verificacion: 'Verificado - Documentación pública',
  },
]

let n = 0
for (const { categoria, ...l } of lugares) {
  insertar.run({ ...l, categoria_id: categoriaIdPorNombre(db, categoria) })
  n++
}
console.log(`Insertadas/actualizadas ${n} ubicaciones internacionales verificadas.`)
db.close()
