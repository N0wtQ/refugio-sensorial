import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'

const INITIAL = { nombre: '', email: '', pais: '', mensaje: '', _trap: '' }

function Field({ id, label, required, requiredSuffix, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-muted"
      >
        {label}
        {required && <span className="ml-1 text-coral" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> {requiredSuffix}</span>}
      </label>
      {children}
      {/* Error sits right below the field it belongs to — calm, descriptive */}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-warm flex items-center gap-1.5">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-surfaceH border border-border text-text text-sm placeholder:text-faint outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 transition-colors duration-200'

export default function ContactForm() {
  const { t } = useTranslation('contact')
  const prefersReduced = useReducedMotion()
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const validate = () => {
    const e = {}
    if (!values.nombre.trim()) e.nombre = t('errors.nombre')
    if (!values.email.trim()) e.email = t('errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = t('errors.emailInvalid')
    if (!values.pais.trim()) e.pais = t('errors.pais')
    if (!values.mensaje.trim()) e.mensaje = t('errors.mensajeRequired')
    else if (values.mensaje.trim().length < 10)
      e.mensaje = t('errors.mensajeTooShort')
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    // Clear error for this field on edit
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Honeypot: bots fill hidden fields, humans don't
    if (values._trap) { setStatus('success'); return }
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Move focus to first invalid field
      const firstId = Object.keys(errs)[0]
      document.getElementById(firstId)?.focus()
      return
    }
    setStatus('sending')
    try {
      const { _trap, ...payload } = values
      const res = await fetch('https://formspree.io/f/mwvzvdbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-acc/10 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-check text-acc text-xl" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">{t('success.title')}</h3>
        <p className="text-sm text-muted">{t('success.text')}</p>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReduced ? 0 : 0.45 }}
      className="flex flex-col gap-5"
      aria-label={t('formAriaLabel')}
    >
      {/* Honeypot: hidden from humans, catches bots that fill all fields */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="trap_name">{t('honeypotLabel')}</label>
        <input
          type="text"
          id="trap_name"
          name="_trap"
          value={values._trap}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field id="nombre" label={t('fields.nombre.label')} required requiredSuffix={t('requiredSuffix')} error={errors.nombre}>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          placeholder={t('fields.nombre.placeholder')}
          autoComplete="name"
          className={inputClass}
          aria-describedby={errors.nombre ? 'nombre-error' : undefined}
          aria-invalid={!!errors.nombre}
        />
      </Field>

      <Field id="email" label={t('fields.email.label')} required requiredSuffix={t('requiredSuffix')} error={errors.email}>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder={t('fields.email.placeholder')}
          autoComplete="email"
          className={inputClass}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field id="pais" label={t('fields.pais.label')} required requiredSuffix={t('requiredSuffix')} error={errors.pais}>
        <input
          type="text"
          id="pais"
          name="pais"
          value={values.pais}
          onChange={handleChange}
          placeholder={t('fields.pais.placeholder')}
          autoComplete="country-name"
          className={inputClass}
          aria-describedby={errors.pais ? 'pais-error' : undefined}
          aria-invalid={!!errors.pais}
        />
      </Field>

      <Field id="mensaje" label={t('fields.mensaje.label')} required requiredSuffix={t('requiredSuffix')} error={errors.mensaje}>
        <textarea
          id="mensaje"
          name="mensaje"
          value={values.mensaje}
          onChange={handleChange}
          rows={5}
          placeholder={t('fields.mensaje.placeholder')}
          className={`${inputClass} resize-y min-h-[120px]`}
          aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
          aria-invalid={!!errors.mensaje}
        />
      </Field>

      {status === 'error' && (
        <p role="alert" className="text-sm text-warm bg-warm/8 border border-warm/20 rounded-xl px-4 py-3">
          <i className="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
          {t('error.text')}{' '}
          <a
            href="https://www.instagram.com/refugio.sensorial.oficial"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-warm/75 transition-colors"
          >
            Instagram
          </a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
        aria-label={status === 'sending' ? t('submit.sendingAriaLabel') : t('submit.idleAriaLabel')}
        className="self-start px-7 py-3.5 rounded-xl bg-pri text-white text-sm font-semibold tracking-wide hover:bg-pri/85 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]"
      >
        {status === 'sending' ? (
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            {t('submit.sending')}
          </span>
        ) : (
          t('submit.idle')
        )}
      </button>
    </motion.form>
  )
}
