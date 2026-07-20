import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Read-only list of community-submitted "espacios", live-updated via
 * Supabase Realtime. Returns an empty list (no error) if Supabase isn't
 * configured yet.
 */
export function useEspaciosComunidad() {
  const [espacios, setEspacios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchEspacios() {
    if (!supabase) return
    // Columnas explícitas, no select('*'): la base de datos solo concede
    // SELECT sobre estas columnas a anon/authenticated (manage_token queda
    // fuera a propósito — ver migración 0002). select('*') exige acceso a
    // TODAS las columnas de la tabla, así que con un GRANT por columnas
    // Postgres la rechaza entera con "permission denied for column
    // manage_token" en vez de omitirla — la lista nunca cargaba por esto.
    const { data, error: fetchError } = await supabase
      .from('espacios_comunidad')
      .select('id, nombre, descripcion, categoria, latitud, longitud, imagen_url, autor_nombre, created_at, updated_at')
      .order('created_at', { ascending: false })
    if (fetchError) setError(fetchError)
    else setEspacios(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    fetchEspacios()

    // Realtime mantiene la lista al día para lo que añaden OTROS
    // visitantes mientras la página está abierta. Requiere que la tabla
    // esté añadida a la publicación `supabase_realtime` en el proyecto
    // (Database → Replication) — si no lo está, este canal simplemente no
    // emite nada, sin error. Por eso el propio "guardado"/"borrado" del
    // formulario NO depende de esto: llama a refetch() directamente (ver
    // más abajo), así que añadir/editar/borrar tu propio espacio siempre
    // se refleja al instante, esté o no activado el Realtime.
    const channel = supabase
      .channel('espacios_comunidad_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'espacios_comunidad' }, fetchEspacios)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { espacios, loading, error, refetch: fetchEspacios }
}
