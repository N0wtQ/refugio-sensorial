import { Suspense, lazy } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumb from '../components/ui/Breadcrumb'

const SilentMap = lazy(() => import('../components/SilentMap'))

export default function MapPage() {
  usePageMeta({
    title: 'Mapa de espacios silenciosos y accesibles — Refugio Sensorial',
    description: 'Encuentra y comparte sitios silenciosos, accesibles y seguros para personas autistas y con hipersensibilidad sensorial, en España y en cualquier parte del mundo.',
  })
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: 'Inicio' },
        { label: 'Mapa' },
      ]} />

      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pri/10 border border-pri/20 text-pri text-xs font-semibold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-location-dot text-[10px]" aria-hidden="true" />
          Mapa interactivo
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
          Espacios silenciosos en el mundo
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          Lugares verificados con hora silenciosa, accesibilidad sensorial y distintivo de
          discapacidad invisible — hoy sobre todo en España, y cada vez en más países gracias
          a las aportaciones de la comunidad.
        </p>
      </header>

      {/* Map */}
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            aria-label="Cargando mapa..."
            className="flex items-center justify-center rounded-card border border-border bg-surface"
            style={{ height: '520px' }}
          >
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-muted mb-3 block" aria-hidden="true" />
              <p className="text-muted text-sm">Cargando el mapa...</p>
            </div>
          </div>
        }
      >
        <SilentMap />
      </Suspense>
    </div>
  )
}
