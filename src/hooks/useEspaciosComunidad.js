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

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let active = true

    async function fetchEspacios() {
      const { data, error: fetchError } = await supabase
        .from('espacios_comunidad')
        .select('*')
        .order('created_at', { ascending: false })
      if (!active) return
      if (fetchError) setError(fetchError)
      else setEspacios(data ?? [])
      setLoading(false)
    }

    fetchEspacios()

    const channel = supabase
      .channel('espacios_comunidad_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'espacios_comunidad' }, fetchEspacios)
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  return { espacios, loading, error }
}
