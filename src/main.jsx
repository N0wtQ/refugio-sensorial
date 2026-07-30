import './i18n/index.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Vite's hashed chunk filenames change on every deploy — a tab left open
// across a deploy 404s when it later tries to fetch a chunk that no longer
// exists. Vite emits this event for that exact case; reload once (guarded
// against a loop) instead of leaving the tab stuck.
window.addEventListener('vite:preloadError', () => {
  const key = 'refugio-sensorial-stale-chunk-reload'
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
