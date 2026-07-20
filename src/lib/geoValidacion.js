// Comprueba si unas coordenadas caen en mar/agua abierta antes de dejar
// publicar un espacio ahí. Usa la geocodificación inversa gratuita de
// Nominatim (OpenStreetMap) — sin API key, sin coste, coherente con el
// resto del proyecto ("sin backend de pago"). Máx. 1 petición por envío
// de formulario, dentro de la política de uso de Nominatim para un sitio
// de tráfico bajo.
export async function esZonaMaritima(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    )
    if (!res.ok) return false // el servicio falla → no bloquear al usuario por un fallo ajeno
    const data = await res.json()

    // Sin resultado ("Unable to geocode this location") = normalmente mar
    // abierto, sin ninguna entidad terrestre cerca.
    if (data.error || !data.address) return true

    const categoria = data.category ?? data.class
    const tipo = data.type
    const AGUA = new Set(['sea', 'ocean', 'bay', 'strait', 'water', 'reef'])
    if (categoria === 'water' || AGUA.has(tipo)) return true

    return false
  } catch {
    return false // fallo de red → no bloquear (evita falsos positivos por conectividad)
  }
}
