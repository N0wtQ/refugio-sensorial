import { useState, useEffect, useCallback, useRef } from 'react'
import { crearEspacio } from '../lib/espaciosComunidadApi'
import {
  leerPendientes, guardarPendientes, nuevoPendiente,
  esErrorDeConexion, enviarCopiaPorEmail,
} from '../lib/espaciosPendientes'

const REINTENTO_MS = 60_000

/**
 * Espacios que este navegador no pudo publicar todavía. Se reintentan al
 * abrir la página, al recuperar la conexión, al volver a la pestaña y cada
 * minuto mientras quede alguno. Al publicarse, `onPublicado` recibe
 * { id, token } para que se pueda seguir editando como cualquier otro.
 */
export function useEspaciosPendientes({ onPublicado }) {
  const [pendientes, setPendientes] = useState(leerPendientes)
  const sincronizando = useRef(false)
  const onPublicadoRef = useRef(onPublicado)
  onPublicadoRef.current = onPublicado

  const actualizar = useCallback((fn) => {
    setPendientes(prev => {
      const next = fn(prev)
      guardarPendientes(next)
      return next
    })
  }, [])

  const sincronizar = useCallback(async () => {
    if (sincronizando.current) return
    const cola = leerPendientes()
    if (cola.length === 0) return
    sincronizando.current = true
    try {
      for (const item of cola) {
        const { data, error } = await crearEspacio(item.payload)
        if (!error && data) {
          actualizar(prev => prev.filter(p => p.localId !== item.localId))
          onPublicadoRef.current?.({ id: data.id, token: data.manage_token })
        } else if (error && !esErrorDeConexion(error)) {
          // Rechazo definitivo de la base de datos: reintentar no lo arregla.
          // La copia por email ya la tiene quien gestiona el sitio.
          if (!item.emailed) await enviarCopiaPorEmail(item.payload)
          actualizar(prev => prev.filter(p => p.localId !== item.localId))
        } else if (!item.emailed && await enviarCopiaPorEmail(item.payload)) {
          actualizar(prev => prev.map(p => p.localId === item.localId ? { ...p, emailed: true } : p))
        }
      }
    } finally {
      sincronizando.current = false
    }
  }, [actualizar])

  const encolar = useCallback((payload) => {
    const item = nuevoPendiente(payload)
    actualizar(prev => [...prev, item])
    enviarCopiaPorEmail(payload).then(ok => {
      if (ok) actualizar(prev => prev.map(p => p.localId === item.localId ? { ...p, emailed: true } : p))
    })
  }, [actualizar])

  useEffect(() => {
    sincronizar()
    const onVisible = () => { if (document.visibilityState === 'visible') sincronizar() }
    window.addEventListener('online', sincronizar)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('online', sincronizar)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [sincronizar])

  useEffect(() => {
    if (pendientes.length === 0) return
    const timer = setInterval(sincronizar, REINTENTO_MS)
    return () => clearInterval(timer)
  }, [pendientes.length, sincronizar])

  return { pendientes, encolar }
}
