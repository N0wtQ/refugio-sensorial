import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Priority order for Edge neural voices per language (Online = neural, higher
// quality). Falls back to any voice in that language, then to browser default.
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  const prefix = lang === 'en' ? 'en' : 'es'

  if (prefix === 'es') {
    const elvira = voices.find(v => v.name.includes('Elvira')) // Edge neural — Spanish (Spain) female
    if (elvira) return elvira
    const alvaro = voices.find(v => v.name.includes('Alvaro')) // Edge neural — Spanish (Spain) male
    if (alvaro) return alvaro
  } else {
    const aria = voices.find(v => v.name.includes('Aria')) // Edge neural — English (US) female
    if (aria) return aria
    const guy = voices.find(v => v.name.includes('Guy')) // Edge neural — English (US) male
    if (guy) return guy
  }

  const msOnline = voices.find(v =>
    v.name.includes('Microsoft') && v.name.includes('Online') && v.lang.startsWith(prefix)
  )
  if (msOnline) return msOnline

  const ms = voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith(prefix))
  if (ms) return ms

  return voices.find(v => v.lang.startsWith(prefix)) ?? null
}

export function useTTS() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  const [speaking, setSpeaking] = useState(false)
  const utterRef = useRef(null)
  const voiceRef = useRef(null)

  // Voices load asynchronously; reload on voiceschanged (Chrome, Edge) and
  // whenever the active language changes.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const reload = () => { voiceRef.current = pickVoice(lang) }
    reload()
    window.speechSynthesis.addEventListener('voiceschanged', reload)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', reload)
  }, [lang])

  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang  = lang === 'en' ? 'en-US' : 'es-ES'
    u.rate  = 0.88
    u.pitch = 1
    if (voiceRef.current) u.voice = voiceRef.current
    u.onstart = () => setSpeaking(true)
    u.onend   = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    utterRef.current = u
    window.speechSynthesis.speak(u)
  }, [lang])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  return { speak, stop, speaking, supported }
}
