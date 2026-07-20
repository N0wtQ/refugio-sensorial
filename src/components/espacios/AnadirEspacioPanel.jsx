import { useState, useEffect } from 'react'
import { crearEspacio, actualizarEspacio, borrarEspacio } from '../../lib/espaciosComunidadApi'

const CATEGORIAS = ['Sensorial', 'Relax', 'Aventura', 'Cultural', 'Gastronómico', 'Otro']

const INITIAL = { nombre: '', descripcion: '', categoria: 'Sensorial', imagenUrl: '', autorNombre: '', _trap: '' }

// modo: { tipo: 'crear' } | { tipo: 'editar', espacio, token }
export default function AnadirEspacioPanel({ modo, posicion, onCancel, onSaved, onDeleted }) {
  const [values, setValues] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (modo?.tipo === 'editar' && modo.espacio) {
      const e = modo.espacio
      setValues({
        nombre: e.nombre, descripcion: e.descripcion, categoria: e.categoria,
        imagenUrl: e.imagen_url ?? '', autorNombre: e.autor_nombre ?? '', _trap: '',
      })
    } else {
      setValues(INITIAL)
    }
    setStatus('idle')
    setErrorMsg('')
  }, [modo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (values._trap) { onCancel(); return } // bot — silently drop, no error shown

    if (!posicion) {
      setStatus('error')
      setErrorMsg('Haz clic en el mapa para marcar la ubicación.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    const payload = {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      categoria: values.categoria,
      latitud: posicion[0],
      longitud: posicion[1],
      imagenUrl: values.imagenUrl.trim(),
      autorNombre: values.autorNombre.trim(),
    }

    if (modo.tipo === 'crear') {
      const { data, error } = await crearEspacio(payload)
      if (error) { setStatus('error'); setErrorMsg(error.message); return }
      onSaved({ id: data.id, token: data.manage_token })
    } else {
      const { error } = await actualizarEspacio({ id: modo.espacio.id, token: modo.token, ...payload })
      if (error) { setStatus('error'); setErrorMsg(error.message); return }
      onSaved({ id: modo.espacio.id, token: modo.token })
    }
  }

  const handleDelete = async () => {
    if (modo.tipo !== 'editar') return
    if (!confirm(`¿Borrar «${modo.espacio.nombre}»? No se puede deshacer.`)) return
    setStatus('loading')
    const { error } = await borrarEspacio({ id: modo.espacio.id, token: modo.token })
    if (error) { setStatus('error'); setErrorMsg(error.message); return }
    onDeleted(modo.espacio.id)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 rounded-xl border border-pri/25 bg-pri/5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text">
          {modo.tipo === 'crear' ? 'Añadir un espacio' : 'Editar espacio'}
        </h3>
        <button type="button" onClick={onCancel} className="text-faint hover:text-text transition-colors" aria-label="Cancelar">
          <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
        </button>
      </div>

      <p className="text-xs text-muted -mt-1">
        {posicion
          ? `Ubicación: ${posicion[0].toFixed(4)}, ${posicion[1].toFixed(4)} — arrastra el marcador para ajustarla.`
          : 'Haz clic en cualquier punto del mapa para marcar la ubicación.'}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="nombre" className="block text-xs font-semibold text-muted mb-1">Nombre</label>
          <input
            id="nombre" name="nombre" type="text" required maxLength={80}
            value={values.nombre} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="descripcion" className="block text-xs font-semibold text-muted mb-1">Descripción</label>
          <textarea
            id="descripcion" name="descripcion" required rows={3} maxLength={500}
            value={values.descripcion} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 resize-none"
          />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-xs font-semibold text-muted mb-1">Categoría</label>
          <select
            id="categoria" name="categoria" value={values.categoria} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30"
          >
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="autorNombre" className="block text-xs font-semibold text-muted mb-1">Tu nombre (opcional)</label>
          <input
            id="autorNombre" name="autorNombre" type="text" maxLength={40}
            value={values.autorNombre} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="imagenUrl" className="block text-xs font-semibold text-muted mb-1">URL de una imagen (opcional)</label>
          <input
            id="imagenUrl" name="imagenUrl" type="url"
            value={values.imagenUrl} onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30"
          />
        </div>
      </div>

      {/* Honeypot — invisible to people, tempting to bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="espacio_trap">No rellenar</label>
        <input type="text" id="espacio_trap" name="_trap" value={values._trap} onChange={handleChange} tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-xs text-coral">{errorMsg}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-lg bg-pri text-white text-sm font-semibold hover:bg-pri/90 disabled:opacity-50 transition-colors duration-200"
        >
          {status === 'loading' ? 'Guardando...' : modo.tipo === 'crear' ? 'Publicar espacio' : 'Guardar cambios'}
        </button>
        {modo.tipo === 'editar' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === 'loading'}
            className="px-4 py-2 rounded-lg text-coral text-sm font-semibold border border-coral/25 hover:bg-coral/8 disabled:opacity-50 transition-colors duration-200"
          >
            Borrar
          </button>
        )}
      </div>
    </form>
  )
}
