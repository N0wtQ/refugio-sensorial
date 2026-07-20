// Ubicaciones de Asia, Oriente Medio y África aportadas por el usuario.
// Ninguna de ellas tiene evidencia verificada de forma independiente de
// una medida específica para autismo (sala sensorial, CAC, KultureCity,
// Sunflower, horario de baja estimulación...) — las descripciones
// originales solo mencionaban "accesibilidad" en términos genéricos, sin
// certificación ni programa concreto citado. Por eso TODAS entran como
// Nivel 2 ("Entorno potencialmente adecuado"), no Nivel 1.
//
// La existencia física de cada lugar y sus coordenadas sí se han
// verificado (búsqueda + geocodificación, entrada de edificio o punto
// central del recinto, ≥6 decimales cuando se ha encontrado con
// confianza). Cuando no se encontró una coordenada de edificio fiable —
// solo la de la ciudad — se deja NULL, nunca se aproxima.
//
//   node scripts/db/seed-nivel2-asia-africa.mjs

import { openDb, categoriaIdPorNombre } from './lib.mjs'

const db = openDb()

const NOTA_NIVEL2 = 'Este lugar no dispone de medidas específicas para el autismo verificadas, pero puede resultar adecuado por su entorno tranquilo.'

const insertar = db.prepare(`
  INSERT INTO lugares (
    id, nombre, categoria_id, tipo_legacy, tipo, descripcion,
    direccion, ciudad, provincia_region, pais, codigo_iso,
    latitud, longitud, web_oficial, fuente,
    nivel_verificacion, nivel_evidencia, fecha_actualizacion
  ) VALUES (
    @id, @nombre, @categoria_id, @tipo_legacy, @tipo, @descripcion,
    @direccion, @ciudad, @provincia_region, @pais, @codigo_iso,
    @latitud, @longitud, @web_oficial, @fuente,
    'Verificado - Documentación pública', 'Nivel 2 - Entorno potencialmente adecuado',
    date('now')
  )
  ON CONFLICT(id) DO UPDATE SET
    descripcion = excluded.descripcion,
    latitud = excluded.latitud,
    longitud = excluded.longitud,
    web_oficial = excluded.web_oficial
`)

// [id, nombre, país, código_iso, web, categoria, tipo, tipo_legacy, lat, lng, descripción_original]
const filas = [
  ['LVL2-001', "Dubai Aquarium & Underwater Zoo", 'Emiratos Árabes Unidos', 'AE', 'https://thedubaiaquarium.com', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 25.199514, 55.277397, 'Acuario con programas de accesibilidad para visitantes con discapacidad.'],
  ['LVL2-002', 'Green Planet Dubai', 'Emiratos Árabes Unidos', 'AE', 'https://www.thegreenplanetdubai.com', 'Parques y naturaleza', 'Bioparque', 'espacio_natural', 25.206147, 55.260576, 'Bioparque cubierto con instalaciones accesibles.'],
  ['LVL2-003', 'Dubai Parks and Resorts', 'Emiratos Árabes Unidos', 'AE', 'https://www.dubaiparksandresorts.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 24.917456, 55.007458, 'Complejo de parques temáticos con servicios de accesibilidad.'],
  ['LVL2-004', 'Louvre Abu Dhabi', 'Emiratos Árabes Unidos', 'AE', 'https://www.louvreabudhabi.ae', 'Museos y cultura', 'Museo', 'cultura', 24.533832, 54.398330, 'Museo con programas de accesibilidad e inclusión.'],
  ['LVL2-005', 'Yas Waterworld Abu Dhabi', 'Emiratos Árabes Unidos', 'AE', 'https://www.yaswaterworld.com', 'Ocio y turismo', 'Parque acuático', 'parque_tematico', 24.487863, 54.599472, 'Parque acuático con servicios para visitantes con discapacidad.'],
  ['LVL2-006', 'Ferrari World Abu Dhabi', 'Emiratos Árabes Unidos', 'AE', 'https://www.ferrariworldabudhabi.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 24.483763, 54.607007, 'Parque temático con medidas de accesibilidad.'],
  ['LVL2-007', 'Warner Bros. World Abu Dhabi', 'Emiratos Árabes Unidos', 'AE', 'https://www.wbworldabudhabi.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 24.493000, 54.601276, 'Parque temático accesible con servicios para personas con necesidades especiales.'],
  ['LVL2-008', 'Singapore Zoo', 'Singapur', 'SG', 'https://www.mandai.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 1.403529, 103.794279, 'Zoológico con accesibilidad universal y recursos para visitantes con discapacidad.'],
  ['LVL2-009', 'Night Safari Singapore', 'Singapur', 'SG', 'https://www.mandai.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 1.402260, 103.787890, 'Parque de fauna nocturna con instalaciones accesibles.'],
  ['LVL2-010', 'Bird Paradise', 'Singapur', 'SG', 'https://www.mandai.com', 'Parques y naturaleza', 'Aviario', 'zoologico_acuario', 1.405480, 103.781460, 'Aviario con rutas accesibles y apoyo a visitantes.'],
  ['LVL2-011', 'S.E.A. Aquarium', 'Singapur', 'SG', 'https://www.singaporeoceanarium.com/en.html', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 1.255940, 103.818690, 'Acuario con accesibilidad y espacios adaptados.'],
  ['LVL2-012', 'Gardens by the Bay', 'Singapur', 'SG', 'https://www.gardensbythebay.com.sg', 'Parques y naturaleza', 'Jardín', 'espacio_natural', 1.282375, 103.864273, 'Jardines con recorridos accesibles y zonas tranquilas.'],
  ['LVL2-013', 'ArtScience Museum', 'Singapur', 'SG', 'https://www.marinabaysands.com/museum', 'Museos y cultura', 'Museo', 'cultura', 1.286110, 103.859170, 'Museo interactivo con medidas de accesibilidad.'],
  ['LVL2-014', 'Hong Kong Disneyland', 'Hong Kong', 'HK', 'https://www.hongkongdisneyland.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 22.312771, 114.041931, 'Parque temático con guía para visitantes autistas y necesidades sensoriales.'],
  ['LVL2-015', 'Ocean Park Hong Kong', 'Hong Kong', 'HK', 'https://www.oceanpark.com.hk', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 22.240800, 114.172200, 'Parque temático con programas de accesibilidad.'],
  ['LVL2-016', 'National Museum of Singapore', 'Singapur', 'SG', 'https://www.nationalmuseum.nhb.gov.sg/', 'Museos y cultura', 'Museo', 'cultura', 1.296638, 103.848665, 'Museo con servicios de accesibilidad para todos los visitantes.'],
  ['LVL2-017', 'Hamad International Airport', 'Catar', 'QA', 'https://dohahamadairport.com/', 'Transporte', 'Aeropuerto', 'aeropuerto', 25.260595, 51.613767, 'Aeropuerto con salas de asistencia y servicios de accesibilidad.'],
  ['LVL2-018', 'Hamad International Airport – Orchard (Quiet Room)', 'Catar', 'QA', 'https://dohahamadairport.com/', 'Transporte', 'Aeropuerto', 'aeropuerto', 25.260595, 51.613767, 'Zona tranquila destinada a reducir la sobrecarga sensorial.'],
  ['LVL2-019', 'The National Museum of Qatar', 'Catar', 'QA', 'https://nmoq.org.qa', 'Museos y cultura', 'Museo', 'cultura', 25.288043, 51.549399, 'Museo con recursos de accesibilidad e inclusión.'],
  ['LVL2-020', 'Museum of Islamic Art', 'Catar', 'QA', 'https://mia.org.qa', 'Museos y cultura', 'Museo', 'cultura', 25.295280, 51.539170, 'Museo con instalaciones accesibles y ambiente tranquilo.'],
  ['LVL2-021', 'Tokyo Disneyland', 'Japón', 'JP', 'https://www.tokyodisneyresort.jp', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 35.626300, 139.875000, 'Parque temático con servicios de accesibilidad para visitantes con discapacidad.'],
  ['LVL2-022', 'Tokyo DisneySea', 'Japón', 'JP', 'https://www.tokyodisneyresort.jp', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 35.622700, 139.886200, 'Parque temático con guías de accesibilidad y asistencia.'],
  ['LVL2-023', 'Universal Studios Japan', 'Japón', 'JP', 'https://www.usj.co.jp', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 34.665394, 135.432526, 'Parque temático con recursos de accesibilidad y apoyo a visitantes.'],
  ['LVL2-024', 'Ueno Zoo', 'Japón', 'JP', 'https://www.tokyo-zoo.net', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 35.717200, 139.769500, 'Zoológico con instalaciones accesibles.'],
  ['LVL2-025', 'Osaka Aquarium Kaiyukan', 'Japón', 'JP', 'https://www.kaiyukan.com', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 34.652700, 135.424000, 'Acuario con accesibilidad universal.'],
  ['LVL2-026', 'National Museum of Nature and Science', 'Japón', 'JP', 'https://www.kahaku.go.jp', 'Museos y cultura', 'Museo', 'cultura', 35.715500, 139.774000, 'Museo con servicios para visitantes con discapacidad.'],
  ['LVL2-027', 'National Museum of Korea', 'Corea del Sur', 'KR', 'https://www.museum.go.kr', 'Museos y cultura', 'Museo', 'cultura', 37.524044, 126.979857, 'Museo con programas de accesibilidad.'],
  ['LVL2-028', 'Lotte World Adventure', 'Corea del Sur', 'KR', 'https://adventure.lotteworld.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 37.511080, 127.098190, 'Parque temático con instalaciones accesibles.'],
  ['LVL2-029', 'COEX Aquarium', 'Corea del Sur', 'KR', 'https://www.visitsealife.com/coex-seoul/en/', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 37.512441, 127.058869, 'Acuario con rutas accesibles.'],
  ['LVL2-030', 'Everland Resort', 'Corea del Sur', 'KR', 'https://www.everland.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 37.292575, 127.203427, 'Parque temático con servicios de accesibilidad.'],
  ['LVL2-031', 'National Museum of China', 'China', 'CN', 'https://www.chnmuseum.cn', 'Museos y cultura', 'Museo', 'cultura', 39.905159, 116.400894, 'Museo nacional con accesibilidad para visitantes.'],
  ['LVL2-032', 'Shanghai Disneyland', 'China', 'CN', 'https://www.shanghaidisneyresort.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 31.144000, 121.657000, 'Parque temático con asistencia para personas con discapacidad.'],
  ['LVL2-033', 'Chimelong Safari Park', 'China', 'CN', 'https://www.chimelong.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', null, null, 'Parque zoológico con instalaciones accesibles.'],
  ['LVL2-034', 'Beijing Zoo', 'China', 'CN', 'https://www.bjzoo.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 39.936500, 116.333300, 'Zoológico con rutas adaptadas.'],
  ['LVL2-035', 'Taipei Zoo', 'Taiwán', 'TW', 'https://english.zoo.gov.taipei', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 24.998346, 121.581030, 'Zoológico con accesibilidad universal.'],
  ['LVL2-036', 'National Palace Museum', 'Taiwán', 'TW', 'https://www.npm.gov.tw', 'Museos y cultura', 'Museo', 'cultura', 25.102355, 121.548490, 'Museo con servicios accesibles.'],
  ['LVL2-037', 'Sunway Lagoon', 'Malasia', 'MY', 'https://sunwaylagoon.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 3.071990, 101.605150, 'Parque temático con recursos de accesibilidad.'],
  ['LVL2-038', 'Aquaria KLCC', 'Malasia', 'MY', 'https://aquariaklcc.com', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 3.146642, 101.695845, 'Acuario con instalaciones adaptadas.'],
  ['LVL2-039', 'Museum of Islamic Art Malaysia', 'Malasia', 'MY', 'https://iamm.org.my', 'Museos y cultura', 'Museo', 'cultura', 3.141800, 101.689700, 'Museo con accesibilidad para visitantes.'],
  ['LVL2-040', 'National Museum of Singapore', 'Singapur', 'SG', 'https://www.nationalmuseum.nhb.gov.sg//nationalmuseum', 'Museos y cultura', 'Museo', 'cultura', 1.296638, 103.848665, 'Museo con programas de inclusión y accesibilidad.'],
  ['LVL2-041', 'National Museum of Thailand', 'Tailandia', 'TH', 'https://www.virtualmuseum.finearts.go.th', 'Museos y cultura', 'Museo', 'cultura', 13.757800, 100.492300, 'Museo nacional con instalaciones accesibles.'],
  ['LVL2-042', 'SEA LIFE Bangkok Ocean World', 'Tailandia', 'TH', 'https://www.visitsealife.com/bangkok', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 13.746389, 100.535004, 'Acuario con servicios de accesibilidad.'],
  ['LVL2-043', 'Safari World Bangkok', 'Tailandia', 'TH', 'https://www.safariworldbangkok.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 13.865380, 100.703150, 'Parque zoológico con instalaciones adaptadas.'],
  ['LVL2-044', 'Chiang Mai Zoo', 'Tailandia', 'TH', 'https://chiangmai.zoothailand.org/en/index.php', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 18.809000, 98.947000, 'Zoológico con rutas accesibles.'],
  ['LVL2-045', 'Suan Luang Rama IX Park', 'Tailandia', 'TH', 'https://www.suanluangrama9.or.th', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', 13.687436, 100.662017, 'Gran parque urbano con zonas tranquilas.'],
  ['LVL2-046', 'National Museum of the Philippines', 'Filipinas', 'PH', 'https://www.nationalmuseum.gov.ph', 'Museos y cultura', 'Museo', 'cultura', 14.587070, 120.980950, 'Museo con programas de accesibilidad.'],
  ['LVL2-047', 'Manila Ocean Park', 'Filipinas', 'PH', 'https://www.manilaoceanpark.com', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 14.579156, 120.972549, 'Acuario y parque marino accesible.'],
  ['LVL2-048', 'Ninoy Aquino Parks and Wildlife Center', 'Filipinas', 'PH', 'https://bmb.gov.ph', 'Parques y naturaleza', 'Parque natural', 'espacio_natural', 14.652087, 121.045273, 'Parque natural con amplios espacios verdes.'],
  ['LVL2-049', 'National Museum of Indonesia', 'Indonesia', 'ID', 'https://www.museumnasional.or.id', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo nacional con accesibilidad.'],
  ['LVL2-050', 'Taman Safari Indonesia Bogor', 'Indonesia', 'ID', 'https://tamansafari.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', null, null, 'Parque zoológico con instalaciones adaptadas.'],
  ['LVL2-051', 'Bali Safari & Marine Park', 'Indonesia', 'ID', 'https://www.balisafarimarinepark.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', -8.580900, 115.344590, 'Safari con servicios de accesibilidad.'],
  ['LVL2-052', 'National Museum of Sri Lanka', 'Sri Lanka', 'LK', 'https://www.museum.gov.lk', 'Museos y cultura', 'Museo', 'cultura', 6.906000, 79.923200, 'Museo nacional accesible.'],
  ['LVL2-053', 'Dehiwala National Zoo', 'Sri Lanka', 'LK', 'https://nationalzoo.gov.lk', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 6.854100, 79.870400, 'Zoológico con recorridos adaptados.'],
  ['LVL2-054', 'National Museum of India', 'India', 'IN', 'https://nationalmuseumindia.gov.in', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con servicios para visitantes con discapacidad.'],
  ['LVL2-055', 'National Rail Museum', 'India', 'IN', 'https://www.nrmindia.org', 'Museos y cultura', 'Museo', 'cultura', 28.585499, 77.180089, 'Museo ferroviario con accesibilidad.'],
  ['LVL2-056', 'Nehru Planetarium Bengaluru', 'India', 'IN', 'https://taralaya.karnataka.gov.in/en', 'Museos y cultura', 'Planetario', 'cultura', 12.984570, 77.590100, 'Planetario con instalaciones accesibles.'],
  ['LVL2-057', 'Mysuru Zoo', 'India', 'IN', 'https://www.mysuruzoo.info', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 12.302257, 76.663975, 'Zoológico reconocido por su accesibilidad.'],
  ['LVL2-058', 'National Museum of Kenya', 'Kenia', 'KE', 'https://museums.or.ke', 'Museos y cultura', 'Museo', 'cultura', -1.274000, 36.814980, 'Museo con programas de inclusión.'],
  ['LVL2-059', 'Nairobi National Park', 'Kenia', 'KE', 'https://kws.go.ke', 'Parques y naturaleza', 'Parque nacional', 'espacio_natural', -1.362863, 36.834583, 'Parque nacional con centros de visitantes accesibles.'],
  ['LVL2-060', 'Two Oceans Aquarium', 'Sudáfrica', 'ZA', 'https://www.aquarium.co.za', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', -33.907936, 18.417621, 'Acuario con recursos de accesibilidad para visitantes.'],
  ['LVL2-061', 'Iziko South African Museum', 'Sudáfrica', 'ZA', 'https://www.iziko.org.za', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con instalaciones accesibles.'],
  ['LVL2-062', 'Kirstenbosch National Botanical Garden', 'Sudáfrica', 'ZA', 'https://www.sanbi.org', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', -33.987484, 18.432590, 'Jardín botánico con senderos accesibles y zonas tranquilas.'],
  ['LVL2-063', 'uShaka Marine World', 'Sudáfrica', 'ZA', 'https://ushakamarine.com', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', -29.867254, 31.045854, 'Acuario y parque marino con servicios de accesibilidad.'],
  ['LVL2-064', 'Johannesburg Zoo', 'Sudáfrica', 'ZA', 'https://www.jhbcityparksandzoo.com/', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', -26.167778, 28.037857, 'Zoológico con rutas adaptadas para visitantes.'],
  ['LVL2-065', 'National Museum Bloemfontein', 'Sudáfrica', 'ZA', 'https://nationalmuseum.co.za', 'Museos y cultura', 'Museo', 'cultura', -29.106377, 26.209064, 'Museo con recursos de accesibilidad.'],
  ['LVL2-066', 'Bibliotheca Alexandrina', 'Egipto', 'EG', 'https://www.bibalex.org', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 31.208900, 29.909200, 'Biblioteca moderna con amplios espacios de lectura y accesibilidad.'],
  ['LVL2-067', 'Grand Egyptian Museum', 'Egipto', 'EG', 'https://gem.eg/', 'Museos y cultura', 'Museo', 'cultura', 29.995000, 31.119300, 'Gran museo con instalaciones accesibles.'],
  ['LVL2-068', 'Cairo International Airport', 'Egipto', 'EG', 'https://www.cairo-airport.com', 'Transporte', 'Aeropuerto', 'aeropuerto', 30.121901, 31.405600, 'Aeropuerto con servicios de asistencia y accesibilidad.'],
  ['LVL2-069', 'Giza Zoo', 'Egipto', 'EG', 'https://gizazoo-eg.com', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', null, null, 'Zoológico histórico con recorridos accesibles.'],
  ['LVL2-070', 'National Museum of Egyptian Civilization', 'Egipto', 'EG', 'https://nmec.gov.eg', 'Museos y cultura', 'Museo', 'cultura', 30.007500, 31.248300, 'Museo con programas de accesibilidad para visitantes.'],
  ['LVL2-071', 'Mohammed VI Museum of Modern and Contemporary Art', 'Marruecos', 'MA', 'https://fnm.ma/musees-ouverts/musee-mohammed-vi-dart-moderne-et-contemporain/', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con instalaciones accesibles.'],
  ['LVL2-072', "Jardin d'Essais Botaniques", 'Argelia', 'DZ', 'https://hammagarden.com/', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', null, null, 'Jardín botánico con amplios espacios tranquilos.'],
  ['LVL2-073', 'National Museum of Ethiopia', 'Etiopía', 'ET', 'https://ethiopianheritage.gov.et', 'Museos y cultura', 'Museo', 'cultura', 9.038333, 38.761944, 'Museo nacional con servicios para visitantes.'],
  ['LVL2-074', 'Kigali Genocide Memorial', 'Ruanda', 'RW', 'https://kgm.rw', 'Museos y cultura', 'Memorial y museo', 'cultura', null, null, 'Memorial y museo con accesibilidad.'],
  ['LVL2-075', 'Kigali Public Library', 'Ruanda', 'RW', 'https://www.kplonline.org/', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', null, null, 'Biblioteca pública con espacios silenciosos.'],
  ['LVL2-076', 'Royal Museum', 'Uganda', 'UG', 'https://royalmuseum.ug', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo cultural con instalaciones accesibles.'],
  ['LVL2-077', 'Entebbe Botanical Garden', 'Uganda', 'UG', 'https://uwec.ug', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', 0.086900, 32.469200, 'Jardín botánico con recorridos tranquilos.'],
  ['LVL2-078', 'National Museum of Tanzania', 'Tanzania', 'TZ', 'https://www.nmt.go.tz', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con recursos de accesibilidad.'],
  ['LVL2-079', 'Nairobi Railway Museum', 'Kenia', 'KE', 'https://museums.or.ke', 'Museos y cultura', 'Museo', 'cultura', -1.293700, 36.822200, 'Museo ferroviario con instalaciones adaptadas.'],
  ['LVL2-080', 'Giraffe Centre', 'Kenia', 'KE', 'https://www.giraffecentre.org', 'Parques y naturaleza', 'Centro de conservación', 'espacio_natural', null, null, 'Centro de conservación con recorridos accesibles.'],
  ['LVL2-101', 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'India', 'IN', 'https://csmvs.in', 'Museos y cultura', 'Museo', 'cultura', 18.927391, 72.832054, 'Museo con instalaciones accesibles para visitantes.'],
  ['LVL2-102', 'Salar Jung Museum', 'India', 'IN', 'https://www.salarjungmuseum.in', 'Museos y cultura', 'Museo', 'cultura', 17.371350, 78.480560, 'Museo nacional con servicios de accesibilidad.'],
  ['LVL2-103', 'Science City Kolkata', 'India', 'IN', 'https://sciencecitykolkata.org.in', 'Museos y cultura', 'Museo de ciencia', 'cultura', 22.540040, 88.396010, 'Museo interactivo de ciencia con instalaciones adaptadas.'],
  ['LVL2-104', 'Nehru Science Centre Mumbai', 'India', 'IN', 'https://nehrusciencecentre.gov.in', 'Museos y cultura', 'Centro de ciencia', 'cultura', 18.990791, 72.818874, 'Centro de ciencia con accesibilidad.'],
  ['LVL2-105', 'Gujarat Science City', 'India', 'IN', 'https://sciencecity.gujarat.gov.in', 'Museos y cultura', 'Complejo científico', 'cultura', null, null, 'Complejo científico con espacios accesibles.'],
  ['LVL2-106', 'National Museum of Singapore', 'Singapur', 'SG', 'https://www.nationalmuseum.nhb.gov.sg/', 'Museos y cultura', 'Museo', 'cultura', 1.296638, 103.848665, 'Museo con recursos de inclusión y accesibilidad.'],
  ['LVL2-107', 'Singapore Botanic Gardens', 'Singapur', 'SG', 'https://www.nparks.gov.sg', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', 1.314980, 103.816522, 'Jardín botánico Patrimonio de la Humanidad con rutas accesibles.'],
  ['LVL2-108', 'Jewel Changi Airport', 'Singapur', 'SG', 'https://www.jewelchangiairport.com', 'Transporte', 'Aeropuerto', 'aeropuerto', 1.360220, 103.989680, 'Complejo del aeropuerto con zonas tranquilas y accesibilidad.'],
  ['LVL2-109', 'Changi Experience Studio', 'Singapur', 'SG', 'https://www.jewelchangiairport.com', 'Museos y cultura', 'Museo interactivo', 'cultura', 1.360220, 103.989680, 'Museo interactivo accesible.'],
  ['LVL2-110', 'National Museum of Qatar', 'Catar', 'QA', 'https://nmoq.org.qa', 'Museos y cultura', 'Museo', 'cultura', 25.288043, 51.549399, 'Museo con instalaciones adaptadas.'],
  ['LVL2-111', 'Katara Cultural Village', 'Catar', 'QA', 'https://www.katara.net', 'Museos y cultura', 'Centro cultural', 'centro_civico', null, null, 'Centro cultural con espacios accesibles y tranquilos.'],
  ['LVL2-112', 'Aspire Park', 'Catar', 'QA', 'https://www.aspirezone.qa', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', 25.258675, 51.434634, 'Gran parque urbano con zonas verdes y baja estimulación.'],
  ['LVL2-113', 'Sheikh Abdullah Al Salem Cultural Centre', 'Kuwait', 'KW', 'https://www.ascckw.com', 'Museos y cultura', 'Complejo de museos', 'cultura', 29.343920, 48.041280, 'Complejo de museos con accesibilidad.'],
  ['LVL2-114', 'Kuwait Scientific Center', 'Kuwait', 'KW', 'https://www.tsck.org.kw', 'Museos y cultura', 'Acuario y centro científico', 'zoologico_acuario', 29.349670, 48.089320, 'Acuario y centro científico accesible.'],
  ['LVL2-115', 'Oman Botanic Garden', 'Omán', 'OM', 'https://www.omanbotanicgarden.om', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', null, null, 'Jardín botánico con recorridos accesibles.'],
  ['LVL2-116', 'Oman Across Ages Museum', 'Omán', 'OM', 'https://oaam.om/en', 'Museos y cultura', 'Museo', 'cultura', 22.776190, 57.554456, 'Museo moderno con instalaciones accesibles.'],
  ['LVL2-117', 'Royal Botanic Gardens Peradeniya', 'Sri Lanka', 'LK', 'https://www.botanicgardens.gov.lk', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', 7.268100, 80.596500, 'Jardín botánico con senderos accesibles.'],
  ['LVL2-118', 'Durban Botanic Gardens', 'Sudáfrica', 'ZA', 'https://durbanbotanicgardens.org.za', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', -29.841300, 31.004000, 'Jardín botánico con espacios tranquilos.'],
  ['LVL2-119', 'Freedom Park', 'Sudáfrica', 'ZA', 'https://www.freedompark.co.za', 'Museos y cultura', 'Parque y museo', 'cultura', -25.767000, 28.188800, 'Parque y museo con accesibilidad para visitantes.'],
  ['LVL2-120', 'Cape Town International Airport', 'Sudáfrica', 'ZA', 'https://www.airports.co.za', 'Transporte', 'Aeropuerto', 'aeropuerto', -33.974000, 18.604300, 'Aeropuerto con servicios de asistencia y accesibilidad.'],
]

let n = 0
for (const [id, nombre, pais, codigo_iso, web_oficial, categoria, tipo, tipo_legacy, latitud, longitud, descripcionOriginal] of filas) {
  insertar.run({
    id, nombre, pais, codigo_iso, web_oficial, tipo, tipo_legacy,
    categoria_id: categoriaIdPorNombre(db, categoria),
    latitud, longitud,
    descripcion: `${descripcionOriginal} ${NOTA_NIVEL2}`,
    fuente: web_oficial,
    direccion: null, ciudad: null, provincia_region: null,
  })
  n++
}
console.log(`Insertadas/actualizadas ${n} ubicaciones Nivel 2 (Asia, Oriente Medio y África).`)
db.close()
