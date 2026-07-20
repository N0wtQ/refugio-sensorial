import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import { LUGARES, TIPOS } from '../data/lugares'
import { useEspaciosComunidad } from '../hooks/useEspaciosComunidad'
import { useMisEspaciosLocal } from '../hooks/useMisEspaciosLocal'
import LocationPickerLayer from './espacios/LocationPickerLayer'
import AnadirEspacioPanel from './espacios/AnadirEspacioPanel'
import MisEspaciosList from './espacios/MisEspaciosList'

const CATEGORIA_COMUNIDAD_CONFIG = {
  Sensorial:      { color: '#3A82CA', icon: 'fa-spa' },
  Relax:          { color: '#48B0A1', icon: 'fa-couch' },
  Aventura:       { color: '#FBB027', icon: 'fa-mountain' },
  Cultural:       { color: '#816AB7', icon: 'fa-landmark' },
  'Gastronómico': { color: '#E57B86', icon: 'fa-utensils' },
  Otro:           { color: '#9CA3AF', icon: 'fa-location-dot' },
}

function comunidadMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid rgba(12,14,30,0.9);box-shadow:0 0 0 2px ${color}40"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

const TYPE_CONFIG = {
  supermercado:          { color: '#3A82CA', label: 'Hora silenciosa', icon: 'fa-cart-shopping' },
  biblioteca:            { color: '#816AB7', label: 'Biblioteca',       icon: 'fa-book' },
  sala_estudio:          { color: '#9CC156', label: 'Sala de estudio',  icon: 'fa-graduation-cap' },
  espacio_natural:       { color: '#48B0A1', label: 'Espacio natural',  icon: 'fa-tree' },
  centro_civico:         { color: '#FBB027', label: 'Centro cívico',    icon: 'fa-building' },
  centro_comercial:      { color: '#ec4899', label: 'Centro comercial', icon: 'fa-bag-shopping' },
  aeropuerto:            { color: '#ef4444', label: 'Aeropuerto',       icon: 'fa-plane' },
  cultura:               { color: '#E57B86', label: 'Cultura / Museo',  icon: 'fa-landmark' },
  hotel:                 { color: '#06b6d4', label: 'Hotel',            icon: 'fa-hotel' },
  restaurante_silencioso:{ color: '#10b981', label: 'Restaurante',      icon: 'fa-utensils' },
  sunflower:             { color: '#eab308', label: 'Sunflower',        icon: 'fa-sun' },
  coworking:             { color: '#a78bfa', label: 'Coworking',        icon: 'fa-laptop' },
}

function getColor(tipo) {
  return TYPE_CONFIG[tipo]?.color ?? '#9CA3AF'
}

// Re-centra el mapa cuando cambian lat/lng/zoom (p. ej. al resolver la
// geolocalización del usuario, después de que el mapa ya se haya montado
// con la vista por defecto).
function MapController({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [lat, lng, zoom, map])
  return null
}

const DEFAULT_VIEW = { lat: 40.416, lng: -3.703, zoom: 6 } // España — vista por defecto

// Pide la ubicación del navegador una vez; si el usuario la concede, el
// mapa se centra y hace zoom en su zona. Si la deniega, no está disponible
// o tarda demasiado, se queda con la vista por defecto sin mostrar error
// — es un comportamiento opcional y silencioso, no un fallo de la app.
function useUserLocationView() {
  const [view, setView] = useState(DEFAULT_VIEW)

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setView({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 12 })
      },
      () => {}, // denegado / no disponible / timeout — se mantiene la vista por defecto
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    )
  }, [])

  return view
}

// Stats by type
const STATS = TIPOS.reduce((acc, t) => {
  acc[t] = LUGARES.filter(l => l.tipo === t).length
  return acc
}, {})

export default function SilentMap() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('tipo') ?? 'todos'
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const userView = useUserLocationView()
  const { espacios: espaciosComunidad } = useEspaciosComunidad()
  const { misEspacios, añadir: recordarLocal, quitar: olvidarLocal, tokenDe } = useMisEspaciosLocal()

  // modo: null | { tipo: 'crear' } | { tipo: 'editar', espacio, token }
  const [modo, setModo] = useState(null)
  const [posicion, setPosicion] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return LUGARES.filter(l => {
      const matchType = filter === 'todos' || l.tipo === filter
      const matchSearch = !q ||
        l.nombre.toLowerCase().includes(q) ||
        l.ciudad.toLowerCase().includes(q) ||
        l.descripcion.toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [filter, search])

  const handleTypeClick = useCallback((tipo) => {
    const next = new URLSearchParams(searchParams)
    if (searchParams.get('tipo') === tipo) next.delete('tipo')
    else next.set('tipo', tipo)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // Clic en el mapa: si no hay nada abierto, empieza a crear un espacio ahí
  // mismo; si ya se está creando/editando uno, simplemente lo reposiciona.
  const handleMapPick = (latlng) => {
    if (!modo) setModo({ tipo: 'crear' })
    setPosicion(latlng)
  }
  const iniciarEdicion = (espacio, token) => {
    setModo({ tipo: 'editar', espacio, token })
    setPosicion([espacio.latitud, espacio.longitud])
  }
  const cancelar = () => { setModo(null); setPosicion(null) }
  const guardado = ({ id, token }) => {
    recordarLocal(id, token)
    setModo(null)
    setPosicion(null)
  }
  const borrado = (id) => {
    olvidarLocal(id)
    setModo(null)
    setPosicion(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Añadir espacio — sin cuenta, publicación instantánea */}
      <div className="flex items-center gap-3 flex-wrap p-3 rounded-xl border border-acc/15 bg-acc/5">
        <p className="text-xs text-muted leading-relaxed">
          <i className="fa-solid fa-circle-info text-acc mr-1.5" aria-hidden="true" />
          <strong className="text-text font-semibold">¿Conoces un espacio que falta?</strong>{' '}
          Haz clic en cualquier punto del mapa para añadirlo — sin registrarte, y podrás
          editarlo o borrarlo después desde este mismo dispositivo.
        </p>
      </div>

      {modo && (
        <AnadirEspacioPanel
          modo={modo}
          posicion={posicion}
          onCancel={cancelar}
          onSaved={guardado}
          onDeleted={borrado}
        />
      )}

      <MisEspaciosList
        misEspacios={misEspacios}
        espaciosComunidad={espaciosComunidad}
        onEditar={iniciarEdicion}
      />

      {/* Search */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-faint text-sm pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={e => {
          const val = e.target.value
          setSearch(val)
          const next = new URLSearchParams(searchParams)
          if (val) next.set('q', val); else next.delete('q')
          setSearchParams(next, { replace: true })
        }}
          placeholder="Buscar por ciudad, nombre o tipo de espacio..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-faint outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 transition-colors duration-200"
          aria-label="Buscar espacios silenciosos"
        />
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de espacio">
        <button
          onClick={() => {
            const next = new URLSearchParams(searchParams)
            next.delete('tipo')
            setSearchParams(next, { replace: true })
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 border ${
            filter === 'todos'
              ? 'bg-white/10 text-text border-white/20'
              : 'bg-surface text-muted border-border hover:text-text'
          }`}
          aria-pressed={filter === 'todos'}
        >
          Todos ({LUGARES.length})
        </button>
        {TIPOS.map(tipo => {
          const cfg = TYPE_CONFIG[tipo]
          const count = STATS[tipo] ?? 0
          if (!count || !cfg) return null
          const active = filter === tipo
          return (
            <button
              key={tipo}
              onClick={() => handleTypeClick(tipo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 border"
              style={active
                ? { backgroundColor: `${cfg.color}20`, color: cfg.color, borderColor: `${cfg.color}50` }
                : { backgroundColor: 'rgba(19,21,43,1)', color: '#9CA3AF', borderColor: 'rgba(129,106,183,0.1)' }
              }
              aria-pressed={active}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cfg.color, opacity: active ? 1 : 0.5 }}
                aria-hidden="true"
              />
              {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Map */}
      <div className="relative rounded-card overflow-hidden border border-border" style={{ height: '520px' }}>
        {modo && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white pointer-events-none"
            style={{ background: 'rgba(58,130,202,0.92)', zIndex: 1000 }}
          >
            <i className="fa-solid fa-arrows-up-down-left-right mr-1.5" aria-hidden="true" />
            Arrastra el marcador o vuelve a hacer clic para ajustar la ubicación
          </div>
        )}
        <MapContainer
          center={[DEFAULT_VIEW.lat, DEFAULT_VIEW.lng]}
          zoom={DEFAULT_VIEW.zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          aria-label="Mapa interactivo de espacios silenciosos en el mundo"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={18}
          />
          {filtered.map((lugar) => (
            <CircleMarker
              key={lugar.id}
              center={[lugar.lat, lugar.lng]}
              radius={7}
              bubblingMouseEvents={false}
              pathOptions={{
                color: getColor(lugar.tipo),
                fillColor: getColor(lugar.tipo),
                fillOpacity: 0.8,
                weight: 1.5,
              }}
              aria-label={`${lugar.nombre}, ${lugar.ciudad}`}
            >
              <Popup maxWidth={280}>
                <div className="text-sm" style={{ minWidth: '220px', fontFamily: 'Inter, system-ui, sans-serif', padding: '14px 16px 12px' }}>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: getColor(lugar.tipo) }}
                  >
                    <i className={`fa-solid ${TYPE_CONFIG[lugar.tipo]?.icon ?? 'fa-location-dot'} mr-1.5`} aria-hidden="true" />
                    {TYPE_CONFIG[lugar.tipo]?.label ?? lugar.tipo}
                  </p>
                  <h3 style={{ fontWeight: 600, color: '#E5E7EB', fontSize: '15px', marginBottom: '4px', lineHeight: '1.3' }}>
                    {lugar.nombre}
                  </h3>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '6px' }}>
                    <i className="fa-solid fa-location-dot mr-1" style={{ color: '#6B7280' }} aria-hidden="true" />
                    {lugar.ciudad}
                  </p>
                  {lugar.horario && (
                    <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '8px' }}>
                      <i className="fa-regular fa-clock mr-1" style={{ color: '#6B7280' }} aria-hidden="true" />
                      {lugar.horario}
                    </p>
                  )}
                  {lugar.descripcion && (
                    <p style={{ color: '#D1D5DB', fontSize: '12px', lineHeight: '1.55', marginBottom: '10px' }}>
                      {lugar.descripcion}
                    </p>
                  )}
                  {lugar.url && lugar.url !== '#' && (
                    <a
                      href={lugar.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver fuente: ${lugar.nombre} (se abre en nueva pestaña)`}
                      style={{ color: '#3A82CA', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Ver fuente <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Espacios añadidos por cualquier visitante */}
          {espaciosComunidad
            .filter(e => !(modo?.tipo === 'editar' && modo.espacio.id === e.id)) // oculta el que se está editando — lo sustituye el marcador de picking
            .map((e) => {
            const cfg = CATEGORIA_COMUNIDAD_CONFIG[e.categoria] ?? CATEGORIA_COMUNIDAD_CONFIG.Otro
            const miToken = tokenDe(e.id)
            return (
              <Marker key={e.id} position={[e.latitud, e.longitud]} icon={comunidadMarkerIcon(cfg.color)}>
                <Popup maxWidth={280}>
                  <div className="text-sm" style={{ minWidth: '220px', fontFamily: 'Inter, system-ui, sans-serif', padding: '14px 16px 12px' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: cfg.color }}>
                      <i className={`fa-solid ${cfg.icon} mr-1.5`} aria-hidden="true" />
                      {e.categoria}
                    </p>
                    <h3 style={{ fontWeight: 600, color: '#E5E7EB', fontSize: '15px', marginBottom: '4px', lineHeight: '1.3' }}>
                      {e.nombre}
                    </h3>
                    {e.imagen_url && (
                      <img
                        src={e.imagen_url}
                        alt=""
                        style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                        loading="lazy"
                      />
                    )}
                    <p style={{ color: '#D1D5DB', fontSize: '12px', lineHeight: '1.55', marginBottom: '8px' }}>
                      {e.descripcion}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: miToken ? '8px' : 0 }}>
                      <i className="fa-solid fa-users mr-1" aria-hidden="true" />
                      {e.autor_nombre ? `Añadido por ${e.autor_nombre}` : 'Añadido por la comunidad'}
                    </p>
                    {miToken && (
                      <button
                        onClick={() => iniciarEdicion(e, miToken)}
                        style={{ color: '#3A82CA', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-pen" style={{ fontSize: '10px' }} aria-hidden="true" /> Editar este espacio
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}

          <LocationPickerLayer position={posicion} onPick={handleMapPick} />
          <MapController lat={userView.lat} lng={userView.lng} zoom={userView.zoom} />
        </MapContainer>

        {/* Results overlay */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs text-text font-medium pointer-events-none"
          style={{ background: 'rgba(12,14,30,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
          aria-live="polite"
        >
          {filtered.length} espacio{filtered.length !== 1 ? 's' : ''} visibles
        </div>
      </div>
    </div>
  )
}
