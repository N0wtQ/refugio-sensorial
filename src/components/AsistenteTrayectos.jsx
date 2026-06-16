import { useState, useId } from 'react'

const REFUGIOS = [
  {
    id: 1,
    nombre: 'Biblioteca Pública Eugenio Trías',
    tipo: 'biblioteca', icon: 'fa-book',
    ciudad: 'Madrid',
    direccion: 'Parque del Retiro, s/n, 28009 Madrid',
    descripcion: 'Sala de lectura silenciosa con luz cálida filtrada y asientos acolchados. Acceso libre sin carné.',
    horario: 'Mar–Dom 10:00–22:00',
    desvio: 2, distancia: '210 m fuera de ruta',
    servicios: ['Silencio garantizado', 'Luz tenue', 'Sin wi-fi invasivo'],
  },
  {
    id: 2,
    nombre: 'Jardín del Príncipe de Anglona',
    tipo: 'espacio_natural', icon: 'fa-leaf',
    ciudad: 'Madrid',
    direccion: 'C. del Príncipe de Anglona, 3, 28005 Madrid',
    descripcion: 'Jardín histórico amurallado, poco conocido y habitualmente tranquilo. Entrada gratuita.',
    horario: 'Lun–Dom 10:00–20:00 (varía según estación)',
    desvio: 3, distancia: '380 m fuera de ruta',
    servicios: ['Aire libre', 'Muy poco concurrido', 'Bancos a la sombra'],
  },
  {
    id: 3,
    nombre: 'Sala de Descanso — Aeropuerto T4',
    tipo: 'aeropuerto', icon: 'fa-plane',
    ciudad: 'Madrid',
    direccion: 'Terminal T4, Aeropuerto Adolfo Suárez, 28042 Madrid',
    descripcion: 'Zona sensorial certificada con iluminación ajustable y espacio de quietud para viajeros.',
    horario: 'Todos los días 06:00–00:00',
    desvio: 5, distancia: '700 m fuera de ruta',
    servicios: ['Iluminación ajustable', 'Distintivo Sunflower', 'Sin ruido ambiental alto'],
  },
  {
    id: 4,
    nombre: 'Biblioteca de Cataluña — Sala Silenciosa',
    tipo: 'biblioteca', icon: 'fa-book',
    ciudad: 'Barcelona',
    direccion: 'C/ de l\'Hospital, 56, 08001 Barcelona',
    descripcion: 'Majestuoso edificio medieval. La sala norte tiene iluminación natural muy suave y silencio estricto.',
    horario: 'Lun–Vie 9:00–20:00 · Sáb 9:00–14:00',
    desvio: 2, distancia: '180 m fuera de ruta',
    servicios: ['Silencio estricto', 'Luz natural', 'Asientos ergonómicos'],
  },
  {
    id: 5,
    nombre: 'Parc de la Ciutadella',
    tipo: 'espacio_natural', icon: 'fa-leaf',
    ciudad: 'Barcelona',
    direccion: 'Passeig de Picasso, 21, 08003 Barcelona',
    descripcion: 'Amplio parque urbano con zonas alejadas del tráfico. El sector del lago es especialmente tranquilo.',
    horario: 'Abierto todos los días 8:00–22:00',
    desvio: 4, distancia: '450 m fuera de ruta',
    servicios: ['Zonas verdes sin ruido', 'Bancos aislados', 'Entrada libre'],
  },
  {
    id: 6,
    nombre: 'Centro Cívico Cotxeres de Sants',
    tipo: 'centro_civico', icon: 'fa-building',
    ciudad: 'Barcelona',
    direccion: 'C/ Sants, 79, 08014 Barcelona',
    descripcion: 'Sala multiusos adaptada con señalización visual, suelo antideslizante y luz regulable.',
    horario: 'Lun–Vie 9:00–21:00 · Sáb 10:00–14:00',
    desvio: 1, distancia: '90 m fuera de ruta',
    servicios: ['Señalización visual', 'Zona de descanso', 'Personal formado en diversidad'],
  },
  {
    id: 7,
    nombre: 'Jardines del Real (Viveros)',
    tipo: 'espacio_natural', icon: 'fa-leaf',
    ciudad: 'Valencia',
    direccion: 'C/ General Elio, s/n, 46010 Valencia',
    descripcion: 'Jardines históricos con zona de pinos y bancos apartados. Muy tranquilos en horario matinal.',
    horario: 'Lun–Dom 8:00–21:00 (horario de verano)',
    desvio: 3, distancia: '320 m fuera de ruta',
    servicios: ['Arbolado denso', 'Zona de silencio', 'Acceso sin barreras'],
  },
  {
    id: 8,
    nombre: 'Biblioteca Municipal Central de Sevilla',
    tipo: 'biblioteca', icon: 'fa-book',
    ciudad: 'Sevilla',
    direccion: 'C/ Almirante Apodaca, 2, 41003 Sevilla',
    descripcion: 'Sala de hemeroteca de uso tranquilo. Clima fresco y silencio natural incluso en días de calor.',
    horario: 'Lun–Vie 9:00–21:00',
    desvio: 2, distancia: '150 m fuera de ruta',
    servicios: ['Clima fresco', 'Silencio natural', 'Luz interior cálida'],
  },
  {
    id: 9,
    nombre: 'Parque Grande José Antonio Labordeta',
    tipo: 'espacio_natural', icon: 'fa-leaf',
    ciudad: 'Zaragoza',
    direccion: 'Paseo de Ruiseñores, s/n, 50006 Zaragoza',
    descripcion: 'El parque más grande de Zaragoza. La zona de rosaleda y estanque es especialmente calmada.',
    horario: 'Abierto las 24 horas',
    desvio: 4, distancia: '500 m fuera de ruta',
    servicios: ['Zonas muy poco concurridas', 'Naturaleza densa', 'Bancos aislados'],
  },
  {
    id: 10,
    nombre: 'Sala Sensorial — Guggenheim Bilbao',
    tipo: 'cultura', icon: 'fa-landmark',
    ciudad: 'Bilbao',
    direccion: 'Abandoibarra Etorb., 2, 48009 Bilbao',
    descripcion: 'Espacio de descanso sensorial disponible para visitantes y personal. Iluminación muy tenue.',
    horario: 'Mar–Dom 10:00–19:00',
    desvio: 1, distancia: '120 m fuera de ruta',
    servicios: ['Iluminación tenue', 'Sin estímulos sonoros', 'Asientos suaves'],
  },
  {
    id: 11,
    nombre: 'Mercadona — Hora Silenciosa (Vallecas)',
    tipo: 'supermercado', icon: 'fa-cart-shopping',
    ciudad: 'Madrid',
    direccion: 'Av. de la Albufera, 88, 28038 Madrid',
    descripcion: 'Horario sin música, iluminación reducida y megafonía desactivada los martes de 17:00 a 19:00.',
    horario: 'Hora silenciosa: martes 17:00–19:00',
    desvio: 3, distancia: '400 m fuera de ruta',
    servicios: ['Sin música', 'Luz reducida', 'Sin megafonía'],
  },
  {
    id: 12,
    nombre: 'Sala de Estudio Silenciosa — Biblioteca Jaume Fuster',
    tipo: 'sala_estudio', icon: 'fa-graduation-cap',
    ciudad: 'Barcelona',
    direccion: 'Pl. de Lesseps, 20-22, 08023 Barcelona',
    descripcion: 'Sala en planta alta con vistas al parque. Reglas de silencio estrictas y temperatura constante.',
    horario: 'Lun–Vie 10:00–21:00 · Sáb 10:00–14:00',
    desvio: 2, distancia: '230 m fuera de ruta',
    servicios: ['Silencio estricto', 'Temperatura constante', 'Luz natural lateral'],
  },
]

const TIPO_CONFIG = {
  biblioteca:      { color: '#816AB7', label: 'Biblioteca' },
  espacio_natural: { color: '#48B0A1', label: 'Espacio natural' },
  aeropuerto:      { color: '#8b5cf6', label: 'Aeropuerto' },
  centro_civico:   { color: '#FBB027', label: 'Centro cívico' },
  cultura:         { color: '#E57B86', label: 'Cultura / Museo' },
  supermercado:    { color: '#3A82CA', label: 'Hora silenciosa' },
  sala_estudio:    { color: '#9CC156', label: 'Sala de estudio' },
}

function buscarRefugios(origen, destino) {
  const q = (origen + ' ' + destino).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const ciudades = ['madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'bilbao']
  const ciudadMatch = ciudades.find(c => q.includes(c))

  let candidatos = REFUGIOS.filter(r => r.desvio <= 5)

  if (ciudadMatch) {
    const porCiudad = candidatos.filter(r =>
      r.ciudad.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(ciudadMatch)
    )
    if (porCiudad.length > 0) candidatos = porCiudad
  }

  return [...candidatos].sort((a, b) => a.desvio - b.desvio)
}

export default function AsistenteTrayectos() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [estado, setEstado] = useState('idle') // idle | buscando | resultados | vacio
  const [resultados, setResultados] = useState([])

  const idOrigen  = useId()
  const idDestino = useId()

  const handleBuscar = (e) => {
    e.preventDefault()
    if (!origen.trim() || !destino.trim()) return

    setEstado('buscando')
    setTimeout(() => {
      const found = buscarRefugios(origen, destino)
      setResultados(found)
      setEstado(found.length > 0 ? 'resultados' : 'vacio')
    }, 600)
  }

  const handleReset = () => {
    setEstado('idle')
    setResultados([])
    setOrigen('')
    setDestino('')
  }

  return (
    <section aria-labelledby="trayectos-heading" className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acc/10 border border-acc/20 text-acc text-xs font-semibold uppercase tracking-widest mb-4">
          <i className="fa-solid fa-route text-[10px]" aria-hidden="true" />
          Trayectos sensoriales
        </div>
        <h1 id="trayectos-heading" className="text-3xl font-bold text-text leading-snug mb-3">
          Asistente de Trayectos<br />
          <span className="text-acc">Sensoriales</span>
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-prose">
          Dinos de dónde sales y adónde vas. Te mostramos los refugios sensoriales
          que puedes visitar en el camino con un desvío máximo de 5 minutos.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleBuscar}
        className="rounded-card bg-surface border border-border p-6 flex flex-col gap-5 mb-6"
        aria-label="Formulario de búsqueda de trayecto"
      >
        {/* Origen */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={idOrigen} className="text-sm font-semibold text-text flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border"
              style={{ backgroundColor: 'rgba(72,176,161,0.12)', borderColor: 'rgba(72,176,161,0.3)', color: '#48B0A1' }}
              aria-hidden="true"
            >A</span>
            Punto de origen
          </label>
          <input
            id={idOrigen}
            type="text"
            value={origen}
            onChange={e => setOrigen(e.target.value)}
            placeholder="p. ej. Plaza Mayor, Madrid"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text text-sm placeholder:text-faint outline-none transition-colors duration-200 focus:border-acc/50 focus:ring-1 focus:ring-acc/25"
            aria-required="true"
            disabled={estado === 'buscando'}
          />
        </div>

        {/* Flecha separadora */}
        <div className="flex items-center gap-3 -my-1" aria-hidden="true">
          <div className="flex-1 border-t border-border" />
          <i className="fa-solid fa-arrow-down text-faint text-xs" />
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Destino */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={idDestino} className="text-sm font-semibold text-text flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border"
              style={{ backgroundColor: 'rgba(72,176,161,0.12)', borderColor: 'rgba(72,176,161,0.3)', color: '#48B0A1' }}
              aria-hidden="true"
            >B</span>
            Destino final
          </label>
          <input
            id={idDestino}
            type="text"
            value={destino}
            onChange={e => setDestino(e.target.value)}
            placeholder="p. ej. Estación de Atocha, Madrid"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text text-sm placeholder:text-faint outline-none transition-colors duration-200 focus:border-acc/50 focus:ring-1 focus:ring-acc/25"
            aria-required="true"
            disabled={estado === 'buscando'}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={!origen.trim() || !destino.trim() || estado === 'buscando'}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: (!origen.trim() || !destino.trim() || estado === 'buscando') ? 'rgba(72,176,161,0.15)' : '#48B0A1',
            color: (!origen.trim() || !destino.trim() || estado === 'buscando') ? '#48B0A1' : '#0C0E1E',
          }}
        >
          {estado === 'buscando' ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin text-xs" aria-hidden="true" />
              Buscando refugios…
            </>
          ) : (
            <>
              <i className="fa-solid fa-magnifying-glass text-xs" aria-hidden="true" />
              Buscar refugios en el camino
            </>
          )}
        </button>
      </form>

      {/* Estado: vacío */}
      {estado === 'vacio' && (
        <div className="rounded-card bg-surface border border-border p-8 text-center" role="status">
          <i className="fa-solid fa-map-pin text-faint text-2xl mb-4 block" aria-hidden="true" />
          <p className="text-text font-semibold mb-1">Sin refugios encontrados</p>
          <p className="text-muted text-sm leading-relaxed mb-5">
            No encontramos refugios sensoriales en este trayecto concreto.<br />
            Prueba con ciudades como Madrid, Barcelona o Bilbao.
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-acc font-semibold hover:text-acc/75 transition-colors duration-200"
          >
            Hacer otra búsqueda
          </button>
        </div>
      )}

      {/* Estado: resultados */}
      {estado === 'resultados' && (
        <div role="region" aria-label="Refugios encontrados en el trayecto">
          {/* Cabecera resultados */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="text-text font-semibold">{resultados.length}</span>
              {' '}refugio{resultados.length !== 1 ? 's' : ''} en el camino de{' '}
              <span className="text-acc font-medium">{origen}</span>
              {' '}a{' '}
              <span className="text-acc font-medium">{destino}</span>
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-faint hover:text-muted transition-colors duration-200 flex items-center gap-1.5"
              aria-label="Nueva búsqueda"
            >
              <i className="fa-solid fa-xmark text-[10px]" aria-hidden="true" />
              Nueva búsqueda
            </button>
          </div>

          {/* Lista de refugios */}
          <ol className="flex flex-col gap-3" aria-label="Lista de refugios sensoriales">
            {resultados.map((r, i) => {
              const cfg = TIPO_CONFIG[r.tipo] ?? { color: '#9CA3AF', label: r.tipo }
              return (
                <li key={r.id}>
                  <article
                    className="rounded-card bg-surface border border-border p-5 flex flex-col gap-3 transition-colors duration-200 hover:border-borderH"
                    aria-label={`${r.nombre}, desvío ${r.desvio} minutos`}
                  >
                    {/* Cabecera tarjeta */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Número de orden */}
                        <span
                          className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5"
                          style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-text leading-snug">{r.nombre}</h2>
                          <p className="text-xs text-faint mt-0.5 flex items-center gap-1.5">
                            <i className="fa-solid fa-location-dot" aria-hidden="true" />
                            {r.direccion}
                          </p>
                        </div>
                      </div>

                      {/* Badge desvío */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                        >
                          +{r.desvio} min
                        </span>
                        <span className="text-[10px] text-faint whitespace-nowrap">{r.distancia}</span>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs text-muted leading-relaxed pl-9">{r.descripcion}</p>

                    {/* Servicios + horario */}
                    <div className="pl-9 flex flex-wrap gap-2">
                      {r.servicios.map(s => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-md border"
                          style={{ color: cfg.color, backgroundColor: `${cfg.color}10`, borderColor: `${cfg.color}25` }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Horario */}
                    <p className="pl-9 text-[11px] text-faint flex items-center gap-1.5">
                      <i className="fa-regular fa-clock" aria-hidden="true" />
                      {r.horario}
                    </p>
                  </article>
                </li>
              )
            })}
          </ol>

          {/* Nota al pie */}
          <p className="mt-5 text-center text-xs text-faint leading-relaxed">
            Los tiempos de desvío son estimaciones aproximadas. Verifica el horario antes de ir.
          </p>
        </div>
      )}
    </section>
  )
}
