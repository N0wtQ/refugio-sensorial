import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useAuth } from '../../contexts/AuthContext'
import Breadcrumb from '../../components/ui/Breadcrumb'

export default function AccesoPage() {
  usePageMeta({
    title: 'Acceso — Espacios | Refugio Sensorial',
    description: 'Inicia sesión o regístrate para añadir y gestionar tus espacios en el mapa.',
    noIndex: true,
  })
  const { user, signIn, signUp, signInWithGoogle, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/espacios'

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [message, setMessage] = useState('')

  if (user) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    const action = mode === 'login' ? signIn : signUp
    const { error } = await action(email, password)

    if (error) {
      setStatus('error')
      setMessage(
        error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : error.message
      )
      return
    }
    if (mode === 'register') {
      setStatus('idle')
      setMessage('Revisa tu email para confirmar la cuenta antes de iniciar sesión.')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { href: '/', label: 'Inicio' },
          { href: '/espacios', label: 'Espacios' },
          { label: 'Acceso' },
        ]}
        className="mb-8"
      />

      <h1 className="text-2xl font-bold text-text mb-2">
        {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
      </h1>
      <p className="text-muted text-sm mb-8">
        Para añadir y gestionar tus propios espacios en el mapa.
      </p>

      {!configured ? (
        <div className="p-4 rounded-xl border border-border bg-surface text-sm text-muted">
          Esta sección está en construcción todavía.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-muted mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text text-sm outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 transition-colors duration-200"
            />
          </div>

          {message && (
            <p role="alert" className={`text-xs ${status === 'error' ? 'text-coral' : 'text-acc'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2.5 rounded-xl bg-pri text-white text-sm font-semibold hover:bg-pri/90 disabled:opacity-50 transition-colors duration-200"
          >
            {status === 'loading' ? 'Un momento...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarme'}
          </button>

          <div className="flex items-center gap-3 text-faint text-[11px]" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            o
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text text-sm font-semibold hover:border-borderH transition-colors duration-200"
          >
            <i className="fa-brands fa-google text-sm" aria-hidden="true" />
            Continuar con Google
          </button>

          <button
            type="button"
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setMessage(''); setStatus('idle') }}
            className="text-xs text-muted hover:text-text transition-colors duration-200 text-center"
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </form>
      )}
    </div>
  )
}
