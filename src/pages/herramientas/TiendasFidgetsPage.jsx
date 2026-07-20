import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { tiendasFidgets, tiendasFidgetsTipos } from '../../data/tiendasFidgets'

// Orden de prioridad pedido: fabricantes → especializadas → grandes comercios → marketplaces
const ORDEN_TIPO = ['Fabricante', 'Tienda especializada', 'Gran comercio', 'Marketplace']

const TIPO_BADGE = {
  Fabricante:            'text-acc   bg-acc/10   border-acc/25',
  'Tienda especializada':'text-sec   bg-sec/10   border-sec/25',
  'Gran comercio':        'text-warm  bg-warm/10  border-warm/25',
  Marketplace:            'text-coral bg-coral/10 border-coral/25',
}

const ENVIOS_BADGE = {
  'Sí':         'text-green bg-green/10 border-green/25',
  'Parcial':    'text-warm  bg-warm/10  border-warm/25',
  'No':         'text-faint bg-surface  border-border',
  'Desconocido':'text-faint bg-surface  border-border',
}

// Orden de países: prioridad pedida primero, resto alfabético
const ORDEN_PAIS_PRIORIDAD = [
  'España', 'Francia', 'Alemania', 'Reino Unido', 'Estados Unidos', 'Canadá',
  'Argentina', 'Brasil', 'Chile', 'Latinoamérica', 'Australia', 'Global',
]

function ordenPais(paises) {
  return [...paises].sort((a, b) => {
    const ia = ORDEN_PAIS_PRIORIDAD.indexOf(a)
    const ib = ORDEN_PAIS_PRIORIDAD.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b, 'es')
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

function TiendaCard({ t }) {
  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-card border border-border bg-surface hover:border-sec/30 transition-colors duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text leading-snug">{t.nombre}</h3>
          <p className="text-[11px] text-faint mt-0.5">
            {[t.ciudad, t.pais].filter(Boolean).join(', ')} · {t.modalidad}
          </p>
        </div>
        <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-md border ${TIPO_BADGE[t.tipo] ?? 'text-faint bg-surface border-border'}`}>
          {t.tipo}
        </span>
      </div>

      <p className="text-xs text-muted leading-relaxed">{t.descripcion}</p>

      <div className="text-[11px] text-faint leading-relaxed">
        <p><strong className="text-muted">Productos:</strong> {t.productos}</p>
        {t.marcas && <p><strong className="text-muted">Marcas:</strong> {t.marcas}</p>}
        <p><strong className="text-muted">Idiomas:</strong> {t.idiomas ?? 'Desconocido'}</p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${ENVIOS_BADGE[t.enviosInternacionales] ?? ENVIOS_BADGE.Desconocido}`}>
          Envíos internacionales: {t.enviosInternacionales}
        </span>
        <a
          href={t.web}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${t.nombre} (se abre en nueva pestaña)`}
          className="text-[11px] font-semibold text-pri hover:underline flex items-center gap-1 shrink-0"
        >
          Visitar web <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

export default function TiendasFidgetsPage() {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPais, setFiltroPais] = useState('todos')

  usePageMeta({
    title: 'Dónde comprar fidgets y herramientas de regulación sensorial — Refugio Sensorial',
    description: 'Directorio verificado de fabricantes, tiendas especializadas, grandes comercios y marketplaces donde comprar fidgets, chewies, mantas con peso y otros productos de regulación sensorial en todo el mundo.',
    section: 'herramientas',
  })

  const paises = useMemo(() => ordenPais([...new Set(tiendasFidgets.map(t => t.pais))]), [])

  const filtradas = useMemo(() => tiendasFidgets.filter(t =>
    (filtroTipo === 'todos' || t.tipo === filtroTipo) &&
    (filtroPais === 'todos' || t.pais === filtroPais)
  ), [filtroTipo, filtroPais])

  const porPais = useMemo(() => {
    const grupos = new Map()
    for (const t of filtradas) {
      if (!grupos.has(t.pais)) grupos.set(t.pais, [])
      grupos.get(t.pais).push(t)
    }
    for (const lista of grupos.values()) {
      lista.sort((a, b) => ORDEN_TIPO.indexOf(a.tipo) - ORDEN_TIPO.indexOf(b.tipo))
    }
    return ordenPais([...grupos.keys()]).map(pais => [pais, grupos.get(pais)])
  }, [filtradas])

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/',             label: 'Inicio' },
        { href: '/herramientas', label: 'Herramientas' },
        {                        label: 'Dónde comprar fidgets sensoriales' },
      ]} />

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-semibold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-cart-shopping text-[10px]" aria-hidden="true" />
          Directorio de tiendas
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
          Dónde comprar fidgets sensoriales
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          Directorio verificado de fabricantes, tiendas especializadas, grandes comercios y
          marketplaces donde comprar fidgets, chewies, auriculares antirruido, mantas con peso
          y otros productos de regulación sensorial. Solo se incluyen webs oficiales
          comprobadas — sin inventar datos.
        </p>
        <p className="text-xs text-faint mt-3 flex items-start gap-1.5">
          <i className="fa-solid fa-circle-info mt-0.5" aria-hidden="true" />
          Los marketplaces (Amazon, Etsy, eBay, AliExpress, Temu, Mercado Libre) dependen de
          vendedores individuales — revisa siempre el vendedor concreto y las reseñas antes de
          comprar. No son responsabilidad de las tiendas/fabricantes listados junto a ellos.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrar por tipo de tienda">
        <button
          onClick={() => setFiltroTipo('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
            filtroTipo === 'todos' ? 'bg-coral/15 text-coral border-coral/30' : 'bg-surface text-muted border-border hover:text-text'
          }`}
          aria-pressed={filtroTipo === 'todos'}
        >
          Todos los tipos
        </button>
        {tiendasFidgetsTipos.map(tipo => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(f => f === tipo ? 'todos' : tipo)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
              filtroTipo === tipo ? 'bg-coral/15 text-coral border-coral/30' : 'bg-surface text-muted border-border hover:text-text'
            }`}
            aria-pressed={filtroTipo === tipo}
          >
            {tipo}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrar por país">
        <button
          onClick={() => setFiltroPais('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
            filtroPais === 'todos' ? 'bg-sec/15 text-sec border-sec/30' : 'bg-surface text-muted border-border hover:text-text'
          }`}
          aria-pressed={filtroPais === 'todos'}
        >
          Todos los países
        </button>
        {paises.map(pais => (
          <button
            key={pais}
            onClick={() => setFiltroPais(f => f === pais ? 'todos' : pais)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
              filtroPais === pais ? 'bg-sec/15 text-sec border-sec/30' : 'bg-surface text-muted border-border hover:text-text'
            }`}
            aria-pressed={filtroPais === pais}
          >
            {pais}
          </button>
        ))}
      </div>

      <p className="text-xs text-faint mb-6" aria-live="polite">
        {filtradas.length} tienda{filtradas.length !== 1 ? 's' : ''}
      </p>

      {/* Listado agrupado por país → tipo */}
      <div className="flex flex-col gap-10">
        {porPais.map(([pais, tiendas]) => (
          <section key={pais}>
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <i className="fa-solid fa-earth-americas text-sec text-sm" aria-hidden="true" />
              {pais}
              <span className="text-xs font-normal text-faint">({tiendas.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tiendas.map(t => <TiendaCard key={t.id} t={t} />)}
            </div>
          </section>
        ))}
        {porPais.length === 0 && (
          <p className="text-muted text-sm text-center py-16">No hay tiendas para este filtro.</p>
        )}
      </div>

      <div className="mt-12">
        <Link
          to="/herramientas"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border
                     text-sm font-semibold text-muted hover:border-sec/30 hover:text-text transition-all duration-200"
        >
          <i className="fa-solid fa-arrow-left text-sec text-xs" aria-hidden="true" />
          Volver a Herramientas
        </Link>
      </div>
    </div>
  )
}
