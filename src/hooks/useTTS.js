import { useState, useCallback, useRef, useEffect } from 'react'

// Priority order for Spanish Edge neural voices (Online = neural, higher quality).
// Falls back to any Spanish voice, then to browser default.
function pickSpanishVoice() {
  const voices = window.speechSynthesis.getVoices()

  // 1. Edge neural — Spanish (Spain) female: Elvira
  const elvira = voices.find(v => v.name.includes('Elvira'))
  if (elvira) return elvira

  // 2. Edge neural — Spanish (Spain) male: Alvaro
  const alvaro = voices.find(v => v.name.includes('Alvaro'))
  if (alvaro) return alvaro

  // 3. Any Microsoft Online (neural) Spanish voice
  const msOnlineEs = voices.find(v =>
    v.name.includes('Microsoft') && v.name.includes('Online') && v.lang.startsWith('es')
  )
  if (msOnlineEs) return msOnlineEs

  // 4. Any Microsoft Spanish voice
  const msEs = voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('es'))
  if (msEs) return msEs

  // 5. Any Spanish voice
  return voices.find(v => v.lang.startsWith('es')) ?? null
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const utterRef = useRef(null)
  const voiceRef = useRef(null)

  // Voices load asynchronously; reload on voiceschanged (Chrome, Edge).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const reload = () => { voiceRef.current = pickSpanishVoice() }
    reload()
    window.speechSynthesis.addEventListener('voiceschanged', reload)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', reload)
  }, [])

  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang  = 'es-ES'
    u.rate  = 0.88
    u.pitch = 1
    if (voiceRef.current) u.voice = voiceRef.current
    u.onstart = () => setSpeaking(true)
    u.onend   = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    utterRef.current = u
    window.speechSynthesis.speak(u)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  return { speak, stop, speaking, supported }
}
