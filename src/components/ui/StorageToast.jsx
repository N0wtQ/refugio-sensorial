import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StorageToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer
    function handleQuota() {
      setVisible(true)
      clearTimeout(timer)
      timer = setTimeout(() => setVisible(false), 5000)
    }
    window.addEventListener('storage:quota', handleQuota)
    return () => {
      window.removeEventListener('storage:quota', handleQuota)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border shadow-xl text-sm text-muted max-w-sm w-[calc(100%-2rem)]"
        >
          <i className="fa-solid fa-triangle-exclamation text-warm shrink-0" aria-hidden="true" />
          <span>El almacenamiento local está lleno. No se pudieron guardar los favoritos.</span>
          <button
            onClick={() => setVisible(false)}
            aria-label="Cerrar aviso"
            className="ml-auto shrink-0 text-faint hover:text-muted transition-colors"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
