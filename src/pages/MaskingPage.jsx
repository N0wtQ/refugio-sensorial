import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumb from '../components/ui/Breadcrumb'
import TTSButton from '../components/ui/TTSButton'

const RAZONES = [
  {
    icon: 'fa-people-group',
    titulo: 'Encajar socialmente',
    desc: 'Desde pequeños aprendemos que comportarse de cierta forma hace que los demás nos acepten. El masking nace de ese aprendizaje repetido.',
  },
  {
    icon: 'fa-heart-crack',
    titulo: 'Evitar el rechazo',
    desc: 'Cada vez que una forma de ser «diferente» recibió una respuesta negativa, el cerebro registró: cambia esto para que no te rechacen.',
  },
  {
    icon: 'fa-user-slash',
    titulo: 'Bullying y presión social',
    desc: 'Experiencias de acoso o ridiculización en el pasado dejan una huella que lleva a suprimir comportamientos propios para evitar que se repitan.',
  },
  {
    icon: 'fa-briefcase',
    titulo: 'Entornos laborales',
    desc: 'El lugar de trabajo puede exigir una actuación constante: vocabulario, tono, expresiones y ritmos que no son los propios.',
  },
  {
    icon: 'fa-house-user',
    titulo: 'Dinámica familiar',
    desc: 'Crecer en un entorno que no entendía o aceptaba la neurodivergencia lleva a aprender a actuar normal desde muy pequeño.',
  },
  {
    icon: 'fa-clock-rotate-left',
    titulo: 'Diagnóstico tardío o ausente',
    desc: 'Años sin saber que eres autista significan años aprendiendo a imitar sin tener herramientas para gestionarlo.',
  },
]

const EJEMPLOS = [
  {
    icon: 'fa-eye',
    titulo: 'Forzar el contacto visual',
    desc: 'Mirar a los ojos aunque sea incómodo o doloroso, porque así se hace en las conversaciones.',
  },
  {
    icon: 'fa-face-smile',
    titulo: 'Copiar expresiones',
    desc: 'Imitar la cara, el tono y los gestos de los demás para parecer empático o entusiasmado aunque no se sienta así.',
  },
  {
    icon: 'fa-comment-dots',
    titulo: 'Ensayar conversaciones',
    desc: 'Preparar mentalmente qué decir, cómo responder y qué cara poner antes de cualquier interacción social.',
  },
  {
    icon: 'fa-hand',
    titulo: 'Reprimir el stimming',
    desc: 'Parar de balancearse, taparse los oídos o mover las manos en público aunque eso dificulte la regulación.',
  },
  {
    icon: 'fa-face-meh',
    titulo: 'Fingir que estás bien',
    desc: 'Responder «estoy bien» cuando en realidad estás al límite, para no incomodar a los demás.',
  },
  {
    icon: 'fa-star',
    titulo: 'Ocultar intereses',
    desc: 'No mencionar los temas que te apasionan por miedo a parecer raro o diferente.',
  },
]

const CONSECUENCIAS = [
  {
    icon: 'fa-battery-empty',
    color: 'text-coral',
    bg: 'bg-coral/10',
    border: 'border-coral/25',
    glow: 'rgba(229,123,134,0.07)',
    titulo: 'Agotamiento extremo',
    desc: 'Mantener una actuación constante consume una cantidad enorme de energía cognitiva. Al final del día puede quedar nada.',
    tts: 'Mantener una actuación constante consume una cantidad enorme de energía cognitiva. Al final del día, de la semana o del año puede quedar nada. El masking no es gratis: tiene un coste directo sobre el sistema nervioso.',
  },
  {
    icon: 'fa-heart-crack',
    color: 'text-sec',
    bg: 'bg-sec/10',
    border: 'border-sec/25',
    glow: 'rgba(129,106,183,0.07)',
    titulo: 'Ansiedad crónica',
    desc: 'Estar permanentemente pendiente de cómo te comportas, cómo suenas y cómo te ven genera un estado de alerta constante.',
    tts: 'Estar permanentemente pendiente de cómo te comportas, cómo suenas y cómo te ven los demás genera un estado de alerta constante. Con el tiempo, ese nivel de vigilancia se convierte en ansiedad crónica.',
  },
  {
    icon: 'fa-fire-flame-curved',
    color: 'text-coral',
    bg: 'bg-coral/10',
    border: 'border-coral/25',
    glow: 'rgba(229,123,134,0.07)',
    titulo: 'Burnout autista',
    desc: 'El masking sostenido es uno de los principales factores que llevan al burnout autista: un colapso profundo y difícil de recuperar.',
    tts: 'El masking sostenido durante mucho tiempo es uno de los principales factores que llevan al burnout autista: un colapso profundo que puede durar meses o años y que es difícil de recuperar.',
  },
  {
    icon: 'fa-cloud-rain',
    color: 'text-pri',
    bg: 'bg-pri/10',
    border: 'border-pri/25',
    glow: 'rgba(58,130,202,0.07)',
    titulo: 'Depresión',
    desc: 'No poder ser uno mismo durante años puede llevar a una sensación de vacío y, eventualmente, a depresión clínica.',
    tts: 'No poder ser uno mismo durante años puede llevar a una sensación de vacío, de no saber quién eres realmente, y eventualmente a depresión clínica.',
  },
  {
    icon: 'fa-user-question',
    color: 'text-acc',
    bg: 'bg-acc/10',
    border: 'border-acc/25',
    glow: 'rgba(72,176,161,0.07)',
    titulo: 'Pérdida de identidad',
    desc: 'Después de años de masking intenso, muchas personas no saben cómo son «de verdad» fuera del personaje.',
    tts: 'Después de años de masking intenso, muchas personas sienten que no saben cómo son de verdad o qué les gusta fuera del personaje que han construido para el mundo.',
  },
]

const CHECKLIST = [
  'Al llegar a casa tras interacciones sociales te sientes completamente agotado',
  'En público actúas de forma muy diferente a como eres en privado',
  'Tienes que pensar activamente cómo comportarte en la mayoría de situaciones sociales',
  'Suprimes comportamientos que te ayudan a regularte (stimming, movimiento, quietud...)',
  'Finges emociones que no sientes o escondes las que sí tienes',
  'Después de tiempo con gente necesitas largo tiempo a solas para recuperarte',
  'No sabes muy bien cómo eres «tú de verdad» fuera de los contextos sociales',
  'Sientes alivio cuando estás solo porque puedes quitarte la máscara',
]

const ESTRATEGIAS = [
  {
    icon: 'fa-seedling',
    titulo: 'Empieza en entornos seguros',
    desc: 'Practica siendo más tú mismo con una persona de confianza antes de hacerlo en grupos más grandes. Un entorno seguro es el primer paso.',
  },
  {
    icon: 'fa-battery-half',
    titulo: 'Gestiona tu energía',
    desc: 'Identifica qué situaciones requieren más masking y reduce las que puedas. No todas las interacciones merecen el mismo coste energético.',
  },
  {
    icon: 'fa-hand-holding-heart',
    titulo: 'Permítete el stimming en privado',
    desc: 'Cuando estés solo, permite los comportamientos que necesitas para regularte. No tienes que suprimirlos cuando no hay nadie mirando.',
  },
  {
    icon: 'fa-circle-info',
    titulo: 'Comunica tus necesidades',
    desc: 'Con personas de confianza, practica pedir lo que necesitas directamente en lugar de intentar adivinar qué esperan de ti.',
  },
  {
    icon: 'fa-person-walking',
    titulo: 'Reducción gradual',
    desc: 'No es necesario ni recomendable dejar de enmascarar de golpe. Cada pequeño paso hacia ser más auténtico cuenta.',
  },
]

const MITOS = [
  {
    mito: 'Todo el mundo hace masking',
    realidad: 'La intensidad es completamente diferente. Ajustar el tono en una entrevista no es lo mismo que construir un personaje completo para sobrevivir en cada interacción.',
  },
  {
    mito: 'Es fácil de parar cuando quieres',
    realidad: 'Para muchas personas autistas el masking es automático después de años de práctica. Reducirlo requiere trabajo activo y un entorno que lo permita.',
  },
  {
    mito: 'Si haces masking, no eres «tan autista»',
    realidad: 'El masking puede ocultar completamente las señales de autismo, lo que lleva a diagnósticos tardíos o erróneos. No tiene nada que ver con la intensidad del autismo.',
  },
  {
    mito: 'Basta con decidir dejarlo',
    realidad: 'El masking es una respuesta aprendida de supervivencia. Reducirlo de golpe sin un entorno seguro puede ser perjudicial.',
  },
  {
    mito: 'Te lo inventas para excusarte',
    realidad: 'El masking es un fenómeno documentado e investigado. El agotamiento que genera es real y mesurable, aunque desde fuera no se vea.',
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function InfoCard({ item, index, prefersReduced, color = 'text-pri', bg = 'bg-pri/10' }) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.07 }}
      className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  )
}

function ConsequenceCard({ item, index, prefersReduced }) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.08 }}
      className={`relative flex items-start gap-3 p-4 rounded-card border ${item.border} overflow-hidden`}
      style={{ background: `radial-gradient(ellipse at 0% 0%, ${item.glow}, transparent 60%)` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
        <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
      </div>
      <TTSButton text={item.tts} />
    </motion.div>
  )
}

function AccordionItem({ item, prefersReduced, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-surface hover:bg-white/3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri focus-visible:ring-inset"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <i className="fa-solid fa-circle-xmark text-coral text-xs shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-muted line-through leading-snug">{item.mito}</span>
        </div>
        <i
          className={`fa-solid fa-chevron-down text-[10px] text-faint shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-surface">
              <div className="flex items-start gap-2.5 mt-3">
                <i className="fa-solid fa-circle-check text-acc text-xs shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-muted leading-relaxed">{item.realidad}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MaskingPage() {
  usePageMeta({
    title: 'Masking autista: qué es, por qué ocurre y cómo reducirlo — Refugio Sensorial',
    description: 'Qué es el masking o camuflaje autista, por qué ocurre, ejemplos cotidianos, consecuencias y estrategias para reducirlo de forma gradual y segura.',
  })
  const prefersReduced = useReducedMotion()
  const [openMito, setOpenMito] = useState(null)

  const toggleMito = (index) => setOpenMito(prev => prev === index ? null : index)

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: 'Inicio' },
        { href: '/entender-y-prepararse', label: 'Entender y prepararse' },
        { label: 'Masking' },
      ]} />

      {/* Header */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pri/10 flex items-center justify-center text-pri shrink-0">
            <i className="fa-solid fa-masks-theater" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">Masking autista</h1>
            <p className="text-sm text-muted">El camuflaje que agota sin que nadie lo vea</p>
          </div>
        </div>
      </motion.div>

      {/* Qué es */}
      <section aria-labelledby="que-es-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="relative p-5 rounded-card border border-pri/25 bg-pri/5 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-card"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(58,130,202,0.07), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 id="que-es-heading" className="text-base font-bold text-text mb-2">¿Qué es el masking?</h2>
              <p className="text-sm text-muted leading-relaxed mb-2">
                El masking —también llamado camuflaje autista— es el proceso de suprimir, ocultar o modificar comportamientos, formas de comunicarse y necesidades propias para adaptarse a las expectativas sociales del entorno.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                No es una decisión consciente la mayoría de las veces. Es una respuesta aprendida, muchas veces desde la infancia, a entornos que no aceptaban o comprendían la neurodivergencia.
              </p>
            </div>
            <TTSButton text="El masking o camuflaje autista es el proceso de suprimir, ocultar o modificar comportamientos propios para adaptarse a las expectativas sociales del entorno. No es una decisión consciente la mayoría de las veces. Es una respuesta aprendida, muchas veces desde la infancia, a entornos que no aceptaban o comprendían la neurodivergencia." />
          </div>
        </motion.div>
      </section>

      {/* Por qué ocurre */}
      <section aria-labelledby="razones-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="razones-heading" className="text-base font-bold text-text">¿Por qué ocurre?</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {RAZONES.map((item, i) => (
            <InfoCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} />
          ))}
        </div>
      </section>

      {/* Ejemplos cotidianos */}
      <section aria-labelledby="ejemplos-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="ejemplos-heading" className="text-base font-bold text-text">Ejemplos cotidianos</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {EJEMPLOS.map((item, i) => (
            <InfoCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} color="text-sec" bg="bg-sec/10" />
          ))}
        </div>
      </section>

      {/* Consecuencias */}
      <section aria-labelledby="consecuencias-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="consecuencias-heading" className="text-base font-bold text-text">¿Cómo te afecta?</h2>
        </motion.div>
        <div className="space-y-2.5">
          {CONSECUENCIAS.map((item, i) => (
            <ConsequenceCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} />
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section aria-labelledby="checklist-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="relative p-5 rounded-card border border-acc/25 bg-acc/5 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-card"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(72,176,161,0.07), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-acc/10 text-acc">
                  <i className="fa-solid fa-list-check text-sm" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="checklist-heading" className="text-base font-bold text-text leading-tight">¿Lo estoy haciendo?</h2>
                  <p className="text-xs text-muted">Señales de que el masking forma parte de tu día a día</p>
                </div>
              </div>
              <TTSButton text="Checklist de masking autista. Si reconoces varias de estas situaciones, es posible que el masking forme parte de tu día a día. Recuerda: identificarlo no es para etiquetarte, sino para entenderte mejor y poder cuidarte. Al llegar a casa tras interacciones sociales te sientes completamente agotado. En público actúas de forma muy diferente a como eres en privado. Tienes que pensar activamente cómo comportarte en la mayoría de situaciones sociales. Suprimes comportamientos que te ayudan a regularte. Finges emociones que no sientes o escondes las que sí tienes. Después de tiempo con gente necesitas largo tiempo a solas para recuperarte. No sabes muy bien cómo eres de verdad fuera de los contextos sociales. Sientes alivio cuando estás solo porque puedes quitarte la máscara." />
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <i className="fa-solid fa-check text-acc text-[11px] mt-[3px] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-faint leading-relaxed">
              Identificar el masking no es para etiquetarte, sino para entenderte mejor y poder cuidarte.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Estrategias */}
      <section aria-labelledby="estrategias-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="estrategias-heading" className="text-base font-bold text-text">Cómo reducirlo gradualmente</h2>
        </motion.div>
        <div className="space-y-2.5">
          {ESTRATEGIAS.map((item, i) => (
            <motion.div
              key={item.titulo}
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.07 }}
              className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-pri/10 text-pri">
                <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mitos */}
      <section aria-labelledby="mitos-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="mitos-heading" className="text-base font-bold text-text">Mitos y realidades</h2>
        </motion.div>
        <div className="space-y-2">
          {MITOS.map((item, i) => (
            <motion.div
              key={item.mito}
              initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : i * 0.06 }}
            >
              <AccordionItem
                item={item}
                prefersReduced={prefersReduced}
                isOpen={openMito === i}
                onToggle={() => toggleMito(i)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nav links */}
      <nav aria-label="Continúa aprendiendo" className="grid sm:grid-cols-2 gap-3">
        {[
          {
            to: '/entender-y-prepararse/estados',
            icon: 'fa-brain',
            color: 'text-coral',
            bg: 'bg-coral/10',
            border: 'border-coral/25',
            bgCard: 'bg-coral/5',
            label: 'Meltdown, shutdown y burnout',
            desc: 'Qué son, cómo diferenciarlos y cómo gestionarlos',
          },
          {
            to: '/entender-y-prepararse/guias',
            icon: 'fa-masks-theater',
            color: 'text-pri',
            bg: 'bg-pri/10',
            border: 'border-pri/25',
            bgCard: 'bg-pri/5',
            label: 'Guía: Masking Autista',
            desc: 'Descarga la guía práctica con checklist y ejercicios',
          },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`group flex items-start gap-3 p-4 rounded-card border ${link.border} ${link.bgCard} hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.bg} ${link.color}`}>
              <i className={`fa-solid ${link.icon} text-sm`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${link.color} leading-snug mb-0.5`}>{link.label}</p>
              <p className="text-xs text-muted leading-relaxed">{link.desc}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
