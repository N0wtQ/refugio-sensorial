import { Link } from 'react-router-dom'
import ResourceLibrary from '../components/ResourceLibrary'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumb from '../components/ui/Breadcrumb'

export default function LibraryPage() {
  usePageMeta({
    title: 'Herramientas digitales para TEA y TDAH — Biblioteca Neurodivergente | Refugio Sensorial',
    description: 'Más de 80 apps, extensiones y recursos digitales clasificados por perfil neurodivergente: TEA, TDAH, dislexia, TOC y más. Filtra por categoría y precio.',
  })
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: 'Inicio' },
        { label: 'Herramientas' },
      ]} />

      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sec/10 border border-sec/20 text-sec text-xs font-semibold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-toolbox text-[10px]" aria-hidden="true" />
          Biblioteca digital
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
          Herramientas para el día a día
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          Apps, webs y recursos digitales clasificados por categoría y perfil neurodivergente.
          Cada herramienta ha sido seleccionada y valorada por la comunidad.
        </p>
      </header>

      {/* Subcategoría: directorio de tiendas de fidgets */}
      <Link
        to="/herramientas/tiendas-fidgets"
        className="group flex items-center gap-4 p-4 mb-8 rounded-card border border-coral/20 bg-coral/5
                   hover:border-coral/40 hover:bg-coral/10 transition-all duration-200"
      >
        <div className="w-11 h-11 rounded-xl bg-coral/15 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-cart-shopping text-coral text-base" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text group-hover:text-coral transition-colors duration-200">
            Dónde comprar fidgets sensoriales
          </p>
          <p className="text-xs text-muted mt-0.5">
            Directorio verificado de fabricantes, tiendas especializadas y marketplaces en todo el mundo.
          </p>
        </div>
        <i className="fa-solid fa-chevron-right text-faint group-hover:text-coral group-hover:translate-x-0.5 transition-all duration-200 shrink-0" aria-hidden="true" />
      </Link>

      <ResourceLibrary />
    </div>
  )
}
