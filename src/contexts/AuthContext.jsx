import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const NOT_CONFIGURED = { message: 'Añadir espacios todavía no está activado en este sitio.' }

/**
 * Provides the current Supabase user + auth actions to the whole app.
 * Safe to mount even when Supabase isn't configured yet (supabase === null):
 * `configured` is false, `user` stays null, and every action resolves with
 * a friendly error instead of throwing.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!supabase) return { error: NOT_CONFIGURED }
    return supabase.auth.signUp({ email, password })
  }

  const signIn = async (email, password) => {
    if (!supabase) return { error: NOT_CONFIGURED }
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signInWithGoogle = async () => {
    if (!supabase) return { error: NOT_CONFIGURED }
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/espacios` },
    })
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const value = { user, loading, configured: !!supabase, signUp, signIn, signInWithGoogle, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
