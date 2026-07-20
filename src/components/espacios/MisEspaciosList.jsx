// Lists the community spaces THIS browser created (tracked in localStorage
// via useMisEspaciosLocal), cross-referenced against the live data so names
// stay in sync. Lets the owner jump into edit mode for one of their spots.
export default function MisEspaciosList({ misEspacios, espaciosComunidad, onEditar }) {
  if (misEspacios.length === 0) return null

  const items = misEspacios
    .map(({ id, token }) => ({ token, espacio: espaciosComunidad.find(e => e.id === id) }))
    .filter(x => x.espacio)

  if (items.length === 0) return null

  return (
    <div className="p-3 rounded-xl border border-border bg-surface">
      <p className="text-xs font-semibold text-muted mb-2">Tus espacios en este dispositivo</p>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ espacio, token }) => (
          <li key={espacio.id}>
            <button
              type="button"
              onClick={() => onEditar(espacio, token)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-pri/8 text-pri border border-pri/20 hover:bg-pri/15 transition-colors duration-200"
            >
              <i className="fa-solid fa-pen text-[9px]" aria-hidden="true" />
              {espacio.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
