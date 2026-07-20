import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useAuth } from '../../contexts/AuthContext'
import Breadcrumb from '../../components/ui/Breadcrumb'

const MapaComunidad = lazy(() => import('../../components/comunidad/MapaComunidad'))

export default function ComunidadPage() {
  usePageMeta({
    title: 'Comunidad — Espacios favoritos de personas neurodivergentes en el mundo | Refugio Sensorial',
    description: 'Mapa mundial de espacios favoritos compartidos por la comunidad neurodivergente: lugares sensoriales, de relax, culturales y más, en cualquier país.',
  })
  const { user, loading, configured, signOut } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: 'Inicio' },
        { label: 'Comunidad' },
      ]} />

      <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acc/10 border border-acc/20 text-acc text-xs font-semibold uppercase tracking-wider mb-4">
            <i className="fa-solid fa-earth-americas text-[10px]" aria-hidden="true" />
            Mapa mundial
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
            Espacios de la comunidad
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Lugares favoritos compartidos por personas neurodivergentes de todo el mundo:
            espacios sensoriales, de relax, culturales, gastronómicos y más.
          </p>
        </div>

        {configured && !loading && (
          user ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-faint truncate max-w-[160px]">{user.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-muted border border-border hover:text-text hover:border-borderH transition-colors duration-200"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/comunidad/acceso"
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pri/10 text-pri text-sm font-semibold border border-pri/25 hover:bg-pri/18 transition-colors duration-200"
            >
              <i className="fa-solid fa-user text-xs" aria-hidden="true" />
              Iniciar sesión
            </Link>
          )
        )}
      </header>

      {!configured ? (
        <div className="text-center py-16 rounded-card border border-border bg-surface">
          <i className="fa-solid fa-earth-americas text-3xl text-faint mb-4 block" aria-hidden="true" />
          <p className="text-muted text-sm font-medium mb-1">Próximamente</p>
          <p className="text-faint text-xs">Esta sección está en construcción.</p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-acc/5 border border-acc/15 mb-8" role="note">
            <i className="fa-solid fa-circle-info text-acc mt-0.5 shrink-0" aria-hidden="true" />
            <div className="text-sm text-muted leading-relaxed">
              <strong className="text-text font-semibold">¿Quieres añadir un espacio?</strong>{' '}
              Muy pronto podrás compartir tus propios lugares favoritos desde aquí.
              {!user && ' Inicia sesión para que tu cuenta esté lista cuando se active.'}
            </div>
          </div>

          <Suspense fallback={<div className="h-[560px] rounded-card border border-border bg-surface animate-pulse" />}>
            <MapaComunidad />
          </Suspense>
        </>
      )}
    </div>
  )
}
