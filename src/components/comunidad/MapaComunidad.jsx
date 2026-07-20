import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEspaciosComunidad } from '../../hooks/useEspaciosComunidad'

const CATEGORIA_CONFIG = {
  Sensorial:      { color: '#3A82CA', icon: 'fa-spa' },
  Relax:          { color: '#48B0A1', icon: 'fa-couch' },
  Aventura:       { color: '#FBB027', icon: 'fa-mountain' },
  Cultural:       { color: '#816AB7', icon: 'fa-landmark' },
  'Gastronómico': { color: '#E57B86', icon: 'fa-utensils' },
  Otro:           { color: '#9CA3AF', icon: 'fa-location-dot' },
}

function markerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid rgba(12,14,30,0.9);box-shadow:0 0 0 2px ${color}40"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function MapaComunidad() {
  const { espacios, loading, error } = useEspaciosComunidad()

  return (
    <div className="relative rounded-card overflow-hidden border border-border" style={{ height: '560px' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        worldCopyJump
        style={{ height: '100%', width: '100%' }}
        aria-label="Mapa mundial de espacios favoritos de la comunidad"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={18}
        />
        {espacios.map((e) => {
          const cfg = CATEGORIA_CONFIG[e.categoria] ?? CATEGORIA_CONFIG.Otro
          return (
            <Marker key={e.id} position={[e.latitud, e.longitud]} icon={markerIcon(cfg.color)}>
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
                  <p style={{ color: '#6B7280', fontSize: '11px' }}>
                    <i className="fa-solid fa-users mr-1" aria-hidden="true" />
                    {e.autor_nombre ? `Añadido por ${e.autor_nombre}` : 'Añadido por la comunidad'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(12,14,30,0.6)', zIndex: 1000 }}
        >
          <i className="fa-solid fa-spinner fa-spin text-2xl text-muted" aria-hidden="true" />
        </div>
      )}

      <div
        className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs text-text font-medium pointer-events-none"
        style={{ background: 'rgba(12,14,30,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
        aria-live="polite"
      >
        {error
          ? 'No se pudieron cargar los espacios'
          : `${espacios.length} espacio${espacios.length !== 1 ? 's' : ''} de la comunidad`}
      </div>
    </div>
  )
}
