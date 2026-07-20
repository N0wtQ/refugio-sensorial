import { supabase } from './supabase'

// Thin wrappers around the Postgres RPC functions in
// supabase/migrations/0002_espacios_sin_login.sql. No accounts involved:
// "auth" is possessing the manage_token returned once at creation time.

export async function crearEspacio({ nombre, descripcion, categoria, latitud, longitud, imagenUrl, autorNombre }) {
  if (!supabase) return { error: { message: 'Añadir espacios todavía no está activado en este sitio.' } }
  const { data, error } = await supabase.rpc('crear_espacio_comunidad', {
    p_nombre: nombre,
    p_descripcion: descripcion,
    p_categoria: categoria,
    p_latitud: latitud,
    p_longitud: longitud,
    p_imagen_url: imagenUrl || null,
    p_autor_nombre: autorNombre || null,
  })
  if (error) return { error }
  return { data: data?.[0] } // { id, manage_token }
}

export async function actualizarEspacio({ id, token, nombre, descripcion, categoria, latitud, longitud, imagenUrl, autorNombre }) {
  if (!supabase) return { error: { message: 'Añadir espacios todavía no está activado en este sitio.' } }
  const { error } = await supabase.rpc('actualizar_espacio_comunidad', {
    p_id: id,
    p_token: token,
    p_nombre: nombre,
    p_descripcion: descripcion,
    p_categoria: categoria,
    p_latitud: latitud,
    p_longitud: longitud,
    p_imagen_url: imagenUrl || null,
    p_autor_nombre: autorNombre || null,
  })
  return { error }
}

export async function borrarEspacio({ id, token }) {
  if (!supabase) return { error: { message: 'Añadir espacios todavía no está activado en este sitio.' } }
  const { error } = await supabase.rpc('borrar_espacio_comunidad', { p_id: id, p_token: token })
  return { error }
}
