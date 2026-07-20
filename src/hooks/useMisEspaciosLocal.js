import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'refugio-sensorial:mis-espacios'

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage full/unavailable — the entry just won't persist across reloads
  }
}

/**
 * Tracks which community spaces THIS browser created, so the person who
 * added a spot can edit/delete it later — no accounts, just a secret
 * manage_token remembered locally (same device/browser only).
 */
export function useMisEspaciosLocal() {
  const [misEspacios, setMisEspacios] = useState(read)

  useEffect(() => { write(misEspacios) }, [misEspacios])

  const añadir = useCallback((id, token) => {
    setMisEspacios(prev => [...prev.filter(e => e.id !== id), { id, token }])
  }, [])

  const quitar = useCallback((id) => {
    setMisEspacios(prev => prev.filter(e => e.id !== id))
  }, [])

  const tokenDe = useCallback((id) => misEspacios.find(e => e.id === id)?.token, [misEspacios])

  return { misEspacios, añadir, quitar, tokenDe }
}
