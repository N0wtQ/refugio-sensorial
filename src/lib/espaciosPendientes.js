// Cola local de espacios que no se pudieron publicar (sin conexión, Supabase
// caído o pausado...). Un espacio que alguien ha escrito no debe perderse
// nunca: se guarda aquí, se muestra en el mapa como "pendiente" y se
// reintenta solo (ver useEspaciosPendientes). Además, la primera vez que
// falla se manda una copia por email a quien gestiona el sitio, para que no
// dependa de que esa persona vuelva a abrir la web.

const STORAGE_KEY = 'refugio-sensorial:espacios-pendientes'
const FORMSPREE_URL = 'https://formspree.io/f/mwvzvdbd'

export function leerPendientes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function guardarPendientes(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage lleno/no disponible — queda al menos la copia por email
  }
}

export function nuevoPendiente(payload) {
  return {
    localId: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    payload,
    createdAt: new Date().toISOString(),
    emailed: false,
  }
}

// Errores de Postgres/PostgREST traen un código (SQLSTATE de 5 caracteres o
// PGRSTxxx) y son definitivos: reintentar no los arregla. Un fallo de red
// (fetch rechazado, proyecto pausado, 5xx) llega sin código o con
// PGRST00x (sin conexión a la base de datos) y sí merece reintento.
export function esErrorDeConexion(error) {
  if (!error) return false
  const code = String(error.code ?? '')
  if (!code) return true
  if (/^PGRST00/.test(code)) return true
  return false
}

export async function enviarCopiaPorEmail(payload) {
  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Espacio pendiente de publicar: ${payload.nombre}`,
        aviso: 'No se pudo guardar en la base de datos al enviarlo. Se reintentará solo desde el navegador de quien lo añadió; esta es una copia por si acaso.',
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        categoria: payload.categoria,
        autor: payload.autorNombre || '(sin nombre)',
        imagen: payload.imagenUrl || '(sin imagen)',
        coordenadas: `${payload.latitud}, ${payload.longitud}`,
        mapa: `https://www.openstreetmap.org/?mlat=${payload.latitud}&mlon=${payload.longitud}#map=17/${payload.latitud}/${payload.longitud}`,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
