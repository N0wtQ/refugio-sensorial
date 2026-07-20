// Importa ubicaciones verificadas a la tabla ubicaciones_verificadas.
// Uso manual, NO se ejecuta en el build/CI — es una herramienta para quien
// mantiene los datos, no parte del pipeline de despliegue.
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-ubicaciones.mjs data/ubicaciones-seed.json
//
// La service_role key SOLO se usa aquí, en un script local — nunca en el
// frontend ni con el prefijo VITE_ (eso la expondría al navegador).
//
// Por cada entrada del JSON:
//   1. Valida los campos obligatorios (nombre, pais, fecha_verificacion, fuente_url).
//      Si faltan, la descarta (no se puede verificar sin fuente).
//   2. Busca la categoría por nombre; si no existe, la crea.
//   3. Busca una ubicación existente por (nombre, ciudad, pais) en minúsculas.
//      Si existe, la actualiza. Si no, la crea.
// Termina imprimiendo un resumen: creadas / actualizadas / descartadas.

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const inputPath = process.argv[2]

if (!url || !serviceKey) {
  console.error('Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.')
  process.exit(1)
}
if (!inputPath) {
  console.error('Uso: node scripts/import-ubicaciones.mjs <archivo.json>')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

const REQUIRED = ['nombre', 'pais', 'categoria', 'fecha_verificacion', 'fuente_url']

async function categoriaId(nombre) {
  const { data: existing } = await supabase
    .from('categorias_verificadas')
    .select('id')
    .ilike('nombre', nombre)
    .maybeSingle()
  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from('categorias_verificadas')
    .insert({ nombre })
    .select('id')
    .single()
  if (error) throw error
  console.log(`  + categoría nueva: "${nombre}"`)
  return created.id
}

async function importar() {
  const raw = await readFile(inputPath, 'utf8')
  const ubicaciones = JSON.parse(raw)

  let creadas = 0, actualizadas = 0, descartadas = 0

  for (const u of ubicaciones) {
    const faltantes = REQUIRED.filter(campo => !u[campo])
    if (faltantes.length > 0) {
      console.warn(`SKIP "${u.nombre ?? '(sin nombre)'}" — faltan campos obligatorios: ${faltantes.join(', ')}`)
      descartadas++
      continue
    }

    const catId = await categoriaId(u.categoria)

    const fila = {
      nombre: u.nombre,
      categoria_id: catId,
      direccion: u.direccion ?? null,
      ciudad: u.ciudad ?? null,
      provincia_estado: u.provincia_estado ?? null,
      pais: u.pais,
      codigo_postal: u.codigo_postal ?? null,
      latitud: u.latitud ?? null,
      longitud: u.longitud ?? null,
      descripcion: u.descripcion ?? null,
      adaptaciones_sensoriales: u.adaptaciones_sensoriales ?? [],
      horarios_tranquilos: u.horarios_tranquilos ?? null,
      certificaciones: u.certificaciones ?? [],
      sitio_web: u.sitio_web ?? null,
      telefono: u.telefono ?? null,
      imagenes: u.imagenes ?? [],
      fecha_verificacion: u.fecha_verificacion,
      fuente_url: u.fuente_url,
      fuente_nombre: u.fuente_nombre ?? null,
    }

    const { data: existente } = await supabase
      .from('ubicaciones_verificadas')
      .select('id')
      .ilike('nombre', u.nombre)
      .ilike('ciudad', u.ciudad ?? '')
      .ilike('pais', u.pais)
      .maybeSingle()

    if (existente) {
      const { error } = await supabase
        .from('ubicaciones_verificadas')
        .update(fila)
        .eq('id', existente.id)
      if (error) throw error
      console.log(`  ~ actualizada: ${u.nombre} (${u.ciudad ?? u.pais})`)
      actualizadas++
    } else {
      const { error } = await supabase
        .from('ubicaciones_verificadas')
        .insert(fila)
      if (error) throw error
      console.log(`  + creada: ${u.nombre} (${u.ciudad ?? u.pais})`)
      creadas++
    }
  }

  console.log(`\nResumen: ${creadas} creadas · ${actualizadas} actualizadas · ${descartadas} descartadas de ${ubicaciones.length} totales.`)
}

importar().catch(err => {
  console.error('Error en la importación:', err.message)
  process.exit(1)
})
