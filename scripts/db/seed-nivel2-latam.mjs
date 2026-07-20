// Ubicaciones de Latinoamérica aportadas por el usuario. Igual que en
// seed-nivel2-asia-africa.mjs: ninguna tiene evidencia verificada de forma
// independiente de una medida específica para autismo — las descripciones
// originales eran genéricas ("con programas de accesibilidad e
// inclusión"), sin certificación ni programa concreto citado. Por eso
// TODAS entran como Nivel 2, con la nota obligatoria en la descripción.
//
// Cobertura de esta siembra: Bogotá, Medellín, Cali, Ciudad de México y
// otras ciudades mexicanas, Santiago de Chile, Buenos Aires, Lima, São
// Paulo y Río de Janeiro (~80 ubicaciones). El resto de la lista aportada
// por el usuario (Centroamérica, Caribe, Ecuador, Bolivia, Paraguay,
// Uruguay, Venezuela, y algunas ciudades adicionales de Colombia/Perú/
// Argentina/Brasil) queda pendiente para una siguiente siembra — no se ha
// descartado, solo no se ha geocodificado todavía.
//
//   node scripts/db/seed-nivel2-latam.mjs

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

// [id, nombre, ciudad, provincia_region, país, código_iso, web, categoria, tipo, tipo_legacy, lat, lng, descripción_original]
const filas = [
  // ── Bogotá
  ['LVL2-201', 'Planetario de Bogotá', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://planetariodebogota.gov.co', 'Museos y cultura', 'Planetario', 'cultura', 4.612200, -74.068900, 'Planetario con programas de accesibilidad e inclusión.'],
  ['LVL2-202', 'Jardín Botánico de Bogotá', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.jbb.gov.co', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', 4.609800, -74.082000, 'Jardín botánico con amplios espacios tranquilos y recorridos accesibles.'],
  ['LVL2-203', 'Museo del Oro', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.banrepcultural.org/museo-del-oro', 'Museos y cultura', 'Museo', 'cultura', 4.601900, -74.072000, 'Museo con recursos de accesibilidad para visitantes.'],
  ['LVL2-204', 'Biblioteca Virgilio Barco', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.biblored.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 4.656030, -74.088450, 'Biblioteca pública con espacios silenciosos y accesibilidad.'],
  ['LVL2-205', 'Biblioteca Luis Ángel Arango', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.banrepcultural.org/biblioteca-luis-angel-arango', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 4.596770, -74.072845, 'Biblioteca con zonas de lectura tranquilas y accesibilidad.'],
  ['LVL2-206', 'Museo de Arte Moderno de Bogotá (MAMBO)', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.mambogota.com', 'Museos y cultura', 'Museo', 'cultura', 4.610280, -74.069440, 'Museo de arte con programas de accesibilidad para visitantes.'],
  ['LVL2-207', 'Museo Nacional de Colombia', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://www.museonacional.gov.co', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con programas de accesibilidad e inclusión.'],
  ['LVL2-208', 'Maloka', 'Bogotá', 'Cundinamarca', 'Colombia', 'CO', 'https://maloka.org', 'Museos y cultura', 'Museo interactivo', 'cultura', 4.655400, -74.109500, 'Museo interactivo de ciencia con programas educativos inclusivos.'],
  ['LVL2-209', 'Museo Casa de la Memoria', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://museocasadelamemoria.gov.co', 'Museos y cultura', 'Museo', 'cultura', 6.245900, -75.556500, 'Museo con espacios accesibles y actividades inclusivas.'],

  // ── Medellín
  ['LVL2-210', 'Jardín Botánico Joaquín Antonio Uribe', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.botanicomedellin.org', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', 6.251200, -75.575900, 'Jardín botánico con recorridos accesibles y ambiente tranquilo.'],
  ['LVL2-211', 'Parque Explora', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.parqueexplora.org', 'Museos y cultura', 'Museo interactivo y acuario', 'cultura', 6.269810, -75.565831, 'Museo interactivo y acuario con programas de accesibilidad para todos los visitantes.'],
  ['LVL2-212', 'Biblioteca Pública Piloto', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.bibliotecapiloto.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 6.255440, -75.577510, 'Biblioteca pública con espacios de lectura tranquilos y accesibles.'],
  ['LVL2-213', 'Museo de Arte Moderno de Medellín (MAMM)', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.elmamm.org', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con actividades inclusivas y accesibilidad.'],
  ['LVL2-214', 'Biblioteca España', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.medellin.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 6.294660, -75.544190, 'Biblioteca pública con espacios de estudio silenciosos.'],
  ['LVL2-215', 'Parque Biblioteca Belén', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.bibliotecasmedellin.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 6.224039, -75.598204, 'Biblioteca pública con salas de lectura tranquilas.'],
  ['LVL2-216', 'Parque Biblioteca San Javier', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.bibliotecasmedellin.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 6.255280, -75.601110, 'Biblioteca con espacios silenciosos y accesibles.'],
  ['LVL2-217', 'Parque Biblioteca León de Greiff (La Ladera)', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://www.bibliotecasmedellin.gov.co', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 6.251381, -75.553955, 'Biblioteca pública con ambiente de baja estimulación.'],
  ['LVL2-218', 'Parque Arví', 'Medellín', 'Antioquia', 'Colombia', 'CO', 'https://parquearvi.org', 'Parques y naturaleza', 'Parque natural', 'espacio_natural', 6.278170, -75.497560, 'Parque natural con senderos accesibles y zonas de baja estimulación.'],

  // ── Cali y otras ciudades de Colombia
  ['LVL2-219', 'Museo La Tertulia', 'Cali', 'Valle del Cauca', 'Colombia', 'CO', 'https://museolatertulia.com', 'Museos y cultura', 'Museo', 'cultura', 3.450080, -76.545330, 'Museo de arte con programas de accesibilidad.'],
  ['LVL2-220', 'Parque Jaime Duque', 'Tocancipá', 'Cundinamarca', 'Colombia', 'CO', 'https://parquejaimeduque.com', 'Ocio y turismo', 'Parque temático', 'parque_tematico', 4.949110, -73.963430, 'Parque temático con instalaciones accesibles para todos los visitantes.'],

  // ── Ciudad de México
  ['LVL2-221', 'Museo Nacional de Antropología', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://mna.inah.gob.mx', 'Museos y cultura', 'Museo', 'cultura', 19.426109, -99.186629, 'Museo con servicios de accesibilidad para visitantes con discapacidad.'],
  ['LVL2-222', 'Papalote Museo del Niño', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.papalote.org.mx', 'Museos y cultura', 'Museo interactivo', 'cultura', null, null, 'Museo interactivo con programas de inclusión y accesibilidad para visitantes con discapacidad.'],
  ['LVL2-223', 'Universum, Museo de las Ciencias', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.universum.unam.mx', 'Museos y cultura', 'Museo de ciencia', 'cultura', null, null, 'Museo de ciencia con iniciativas de accesibilidad e inclusión.'],
  ['LVL2-224', 'Zoológico de Chapultepec', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://data.sedema.cdmx.gob.mx/zoo_chapultepec/', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 19.423209, -99.189526, 'Zoológico con instalaciones accesibles y programas educativos inclusivos.'],
  ['LVL2-225', 'Acuario Inbursa', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.acuarioinbursa.com.mx', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', 19.439989, -99.205082, 'Acuario con accesibilidad para personas con discapacidad.'],
  ['LVL2-226', 'KidZania Cuicuilco', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://mexico.kidzania.com', 'Museos y cultura', 'Centro educativo', 'cultura', null, null, 'Centro educativo con iniciativas de inclusión y accesibilidad.'],
  ['LVL2-227', 'KidZania Santa Fe', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://santafe.kidzania.com', 'Museos y cultura', 'Centro educativo', 'cultura', 19.361060, -99.280200, 'Espacio interactivo con programas para visitantes con necesidades especiales.'],
  ['LVL2-228', 'Museo Interactivo de Economía (MIDE)', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.mide.org.mx', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo con programas de accesibilidad e inclusión.'],
  ['LVL2-229', 'Museo Memoria y Tolerancia', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.myt.org.mx', 'Museos y cultura', 'Museo', 'cultura', null, null, 'Museo accesible con recursos para visitantes con distintas necesidades.'],
  ['LVL2-230', 'Bosque de Chapultepec', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://chapultepec.cdmx.gob.mx', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', 19.413055, -99.197777, 'Gran parque urbano con numerosas zonas tranquilas.'],
  ['LVL2-231', 'Museo Nacional de Arte (MUNAL)', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.munal.gob.mx', 'Museos y cultura', 'Museo', 'cultura', 19.435164, -99.137000, 'Museo con accesibilidad universal.'],
  ['LVL2-232', 'Museo Tamayo Arte Contemporáneo', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.museotamayo.org', 'Museos y cultura', 'Museo', 'cultura', 19.425720, -99.181750, 'Museo con actividades inclusivas y accesibilidad.'],
  ['LVL2-233', 'Museo Franz Mayer', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.franzmayer.org.mx', 'Museos y cultura', 'Museo', 'cultura', 19.437900, -99.144200, 'Museo con servicios de accesibilidad.'],
  ['LVL2-234', 'Museo Soumaya Plaza Carso', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://www.museosoumaya.org', 'Museos y cultura', 'Museo', 'cultura', 19.440661, -99.204619, 'Museo gratuito con instalaciones accesibles.'],
  ['LVL2-235', 'Parque La Mexicana', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://parquelamexicana.mx', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', 19.354400, -99.259100, 'Parque moderno con amplios espacios abiertos y áreas de descanso.'],
  ['LVL2-236', 'Parque Bicentenario', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://parquebicentenario.mx', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', null, null, 'Gran parque urbano con zonas tranquilas y accesibilidad.'],
  ['LVL2-237', 'Biblioteca Vasconcelos', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://bibliotecavasconcelos.gob.mx', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 19.446520, -99.150854, 'Gran biblioteca con ambientes silenciosos y accesibles.'],
  ['LVL2-238', 'Biblioteca de México "José Vasconcelos"', 'Ciudad de México', 'CDMX', 'México', 'MX', 'https://bibliotecademexico.gob.mx', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', 19.429450, -99.150250, 'Biblioteca pública con espacios de lectura de baja estimulación.'],

  // ── Otras ciudades de México
  ['LVL2-239', 'Parque Fundidora', 'Monterrey', 'Nuevo León', 'México', 'MX', 'https://www.parquefundidora.org', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', 25.677120, -100.287840, 'Gran parque urbano con amplias zonas tranquilas.'],
  ['LVL2-240', 'Museo del Desierto', 'Saltillo', 'Coahuila', 'México', 'MX', 'https://museodeldesierto.org', 'Museos y cultura', 'Museo de historia natural', 'cultura', 25.413470, -100.964070, 'Museo de historia natural con instalaciones accesibles.'],
  ['LVL2-241', 'Zoológico Guadalajara', 'Guadalajara', 'Jalisco', 'México', 'MX', 'https://zooguadalajara.com.mx', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', 20.728830, -103.306972, 'Zoológico con programas de inclusión y accesibilidad.'],
  ['LVL2-242', 'Africam Safari', 'Puebla', 'Puebla', 'México', 'MX', 'https://africamsafari.com', 'Parques y naturaleza', 'Parque de fauna', 'zoologico_acuario', 18.936430, -98.132290, 'Parque de fauna con servicios de accesibilidad para visitantes.'],

  // ── Santiago de Chile
  ['LVL2-243', 'Museo Interactivo Mirador (MIM)', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.mim.cl', 'Museos y cultura', 'Museo de ciencia', 'cultura', null, null, 'Museo de ciencia con actividades inclusivas y programas de accesibilidad.'],
  ['LVL2-244', 'Museo Artequin', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.artequin.cl', 'Museos y cultura', 'Museo infantil', 'cultura', -33.444625, -70.684114, 'Museo infantil con actividades inclusivas y accesibles.'],
  ['LVL2-245', 'Zoológico Nacional de Chile', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://parquemet.cl', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', -33.429720, -70.634170, 'Zoológico con rutas accesibles y programas educativos.'],
  ['LVL2-246', 'Museo Nacional de Historia Natural', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.mnhn.gob.cl', 'Museos y cultura', 'Museo', 'cultura', -33.442170, -70.681840, 'Museo con programas de accesibilidad universal.'],
  ['LVL2-247', 'Parque Metropolitano de Santiago', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://patrimonio.munistgo.cl/parque-quinta-normal/', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -33.477669, -70.642364, 'Parque urbano con múltiples zonas de descanso y accesibilidad.'],
  ['LVL2-248', 'Biblioteca de Santiago', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.bibliotecasantiago.gob.cl', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', null, null, 'Biblioteca pública con salas de lectura silenciosas y accesibles.'],
  ['LVL2-249', 'Biblioteca Nacional de Chile', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.bibliotecanacional.gob.cl', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', -33.442062, -70.645737, 'Biblioteca histórica con espacios de estudio tranquilos.'],
  ['LVL2-250', 'Museo Nacional de Bellas Artes de Chile', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.mnba.gob.cl', 'Museos y cultura', 'Museo', 'cultura', -33.434500, -70.639500, 'Museo con programas de accesibilidad universal.'],
  ['LVL2-251', 'Centro Cultural La Moneda', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.cclm.cl', 'Museos y cultura', 'Centro cultural', 'centro_civico', -33.443900, -70.653600, 'Centro cultural con recursos de inclusión para visitantes.'],
  ['LVL2-252', 'Museo de Arte Contemporáneo de Chile (MAC)', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://mac.uchile.cl', 'Museos y cultura', 'Museo', 'cultura', -33.435300, -70.644200, 'Museo con actividades inclusivas y accesibilidad.'],
  ['LVL2-253', 'Museo Histórico Nacional', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://www.mhn.gob.cl', 'Museos y cultura', 'Museo', 'cultura', -33.437000, -70.650610, 'Museo con accesibilidad para visitantes.'],
  ['LVL2-254', 'Museo de la Memoria y los Derechos Humanos', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://mmdh.cl', 'Museos y cultura', 'Museo', 'cultura', -33.439840, -70.679380, 'Museo con programas de inclusión y accesibilidad.'],
  ['LVL2-255', 'Biblioteca Regional Gabriela Mistral', 'La Serena', 'Coquimbo', 'Chile', 'CL', 'https://www.bibliotecagabrielamistral.gob.cl', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', null, null, 'Biblioteca pública con salas silenciosas.'],
  ['LVL2-256', 'Parque Quinta Normal', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://patrimonio.munistgo.cl/parque-quinta-normal/', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -33.440716, -70.682594, 'Parque urbano con amplias zonas verdes.'],
  ['LVL2-257', 'Parque Forestal', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://parqueforestalchile.cl', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -33.435657, -70.641269, 'Parque céntrico con ambiente tranquilo y senderos peatonales.'],
  ['LVL2-258', 'Parque Bicentenario (Vitacura)', 'Santiago', 'Región Metropolitana', 'Chile', 'CL', 'https://vitacura.cl/parque-bicentenario/parquebicentenario/', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -33.399900, -70.602200, 'Parque urbano con senderos accesibles y zonas de descanso.'],

  // ── Buenos Aires
  ['LVL2-259', 'Museo del Niño Abasto', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://www.museoabasto.org.ar', 'Museos y cultura', 'Museo interactivo', 'cultura', -34.603867, -58.411083, 'Museo interactivo con actividades inclusivas para familias y niños.'],
  ['LVL2-260', 'Tecnópolis', 'Villa Martelli', 'Buenos Aires', 'Argentina', 'AR', 'https://tecnopolis.gob.ar', 'Museos y cultura', 'Parque de ciencia y tecnología', 'cultura', -34.560295, -58.509750, 'Parque de ciencia y tecnología con medidas de accesibilidad para visitantes.'],
  ['LVL2-261', 'Museo Nacional de Bellas Artes', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://www.bellasartes.gob.ar', 'Museos y cultura', 'Museo', 'cultura', -34.583988, -58.393112, 'Museo con programas de accesibilidad para visitantes.'],
  ['LVL2-262', 'Museo de Arte Latinoamericano de Buenos Aires (MALBA)', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://www.malba.org.ar', 'Museos y cultura', 'Museo', 'cultura', -34.577156, -58.403549, 'Museo con iniciativas de inclusión y accesibilidad.'],
  ['LVL2-263', 'Centro Cultural Kirchner', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://www.palaciolibertad.gob.ar', 'Museos y cultura', 'Centro cultural', 'centro_civico', -34.603634, -58.369835, 'Centro cultural con medidas de accesibilidad.'],
  ['LVL2-264', 'Ecoparque de Buenos Aires', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://ecoparque.buenosaires.gob.ar', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -34.581400, -58.420220, 'Parque con senderos accesibles y ambiente de baja estimulación.'],
  ['LVL2-265', 'Biblioteca Nacional Mariano Moreno', 'Buenos Aires', 'CABA', 'Argentina', 'AR', 'https://www.bn.gob.ar', 'Bibliotecas y estudio', 'Biblioteca', 'biblioteca', -34.584392, -58.397966, 'Biblioteca nacional con salas de lectura silenciosas y accesibles.'],
  ['LVL2-266', 'Bioparque Temaikèn', 'Escobar', 'Buenos Aires', 'Argentina', 'AR', 'https://www.temaiken.org.ar', 'Parques y naturaleza', 'Bioparque', 'zoologico_acuario', -34.366891, -58.807330, 'Bioparque con servicios de accesibilidad para personas con discapacidad.'],

  // ── Lima
  ['LVL2-267', 'Museo Nacional de Arqueología, Antropología e Historia del Perú', 'Lima', 'Lima', 'Perú', 'PE', 'https://mnaahp.cultura.pe', 'Museos y cultura', 'Museo', 'cultura', -12.077250, -77.061860, 'Museo con servicios de accesibilidad para visitantes.'],
  ['LVL2-268', 'Parque de las Leyendas', 'Lima', 'Lima', 'Perú', 'PE', 'https://leyendas.gob.pe', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', null, null, 'Parque zoológico y arqueológico con instalaciones accesibles.'],

  // ── São Paulo
  ['LVL2-269', 'Museu de Arte de São Paulo (MASP)', 'São Paulo', 'São Paulo', 'Brasil', 'BR', 'https://masp.org.br', 'Museos y cultura', 'Museo', 'cultura', -23.556700, -46.653500, 'Museo con programas de accesibilidad para todos los públicos.'],
  ['LVL2-270', 'Pinacoteca de São Paulo', 'São Paulo', 'São Paulo', 'Brasil', 'BR', 'https://pinacoteca.org.br', 'Museos y cultura', 'Museo', 'cultura', -23.534200, -46.633600, 'Museo con recursos de accesibilidad e inclusión.'],
  ['LVL2-271', 'Parque Ibirapuera', 'São Paulo', 'São Paulo', 'Brasil', 'BR', 'https://urbiaparques.com.br/parques/ibirapuera', 'Parques y naturaleza', 'Parque urbano', 'espacio_natural', -23.588333, -46.658890, 'Gran parque urbano con numerosas zonas de calma.'],
  ['LVL2-272', 'Instituto Inhotim', 'Brumadinho', 'Minas Gerais', 'Brasil', 'BR', 'https://www.inhotim.org.br', 'Museos y cultura', 'Museo y jardín botánico', 'espacio_natural', -20.122893, -44.221551, 'Museo y jardín botánico con amplios espacios tranquilos y accesibles.'],
  ['LVL2-273', 'Museu Catavento', 'São Paulo', 'São Paulo', 'Brasil', 'BR', 'https://www.museucatavento.org.br', 'Museos y cultura', 'Museo interactivo', 'cultura', -23.544012, -46.627679, 'Museo interactivo con actividades adaptadas y accesibilidad.'],
  ['LVL2-274', 'Museu do Futebol', 'São Paulo', 'São Paulo', 'Brasil', 'BR', 'https://museudofutebol.org.br', 'Museos y cultura', 'Museo', 'cultura', -23.547597, -46.664780, 'Museo con recursos de accesibilidad para todos los visitantes.'],

  // ── Río de Janeiro
  ['LVL2-275', 'Museu do Amanhã', 'Rio de Janeiro', 'Rio de Janeiro', 'Brasil', 'BR', 'https://museudoamanha.org.br', 'Museos y cultura', 'Museo de ciencia', 'cultura', -22.893710, -43.179296, 'Museo de ciencia con recursos de accesibilidad e inclusión.'],
  ['LVL2-276', 'AquaRio', 'Rio de Janeiro', 'Rio de Janeiro', 'Brasil', 'BR', 'https://www.aquariomarinhodorio.com.br', 'Parques y naturaleza', 'Acuario', 'zoologico_acuario', -22.893056, -43.192778, 'Acuario con instalaciones accesibles y servicios para visitantes con discapacidad.'],
  ['LVL2-277', 'BioParque do Rio', 'Rio de Janeiro', 'Rio de Janeiro', 'Brasil', 'BR', 'https://bioparquedorio.com.br', 'Parques y naturaleza', 'Zoológico', 'zoologico_acuario', null, null, 'Zoológico con programas de accesibilidad e inclusión.'],
  ['LVL2-278', 'Jardim Botânico do Rio de Janeiro', 'Rio de Janeiro', 'Rio de Janeiro', 'Brasil', 'BR', 'https://www.gov.br/jbrj/pt-br', 'Parques y naturaleza', 'Jardín botánico', 'espacio_natural', -22.968197, -43.225933, 'Jardín botánico con recorridos tranquilos y accesibles.'],
]

let n = 0
for (const [id, nombre, ciudad, provincia_region, pais, codigo_iso, web_oficial, categoria, tipo, tipo_legacy, latitud, longitud, descripcionOriginal] of filas) {
  insertar.run({
    id, nombre, ciudad, provincia_region, pais, codigo_iso, web_oficial, tipo, tipo_legacy,
    categoria_id: categoriaIdPorNombre(db, categoria),
    latitud, longitud,
    descripcion: `${descripcionOriginal} ${NOTA_NIVEL2}`,
    fuente: web_oficial,
    direccion: null,
  })
  n++
}
console.log(`Insertadas/actualizadas ${n} ubicaciones Nivel 2 (Latinoamérica, primera tanda).`)
db.close()
