import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './ui/LanguageSwitcher'

// t must be the 'nav' namespace translator — labels/descs come from
// src/i18n/locales/{es,en}/nav.json, routes/icons/colors are not translatable.
function buildLinks(t) {
  return [
    { to: '/', label: t('links.home') },
    { to: '/espacios', label: t('links.map') },
    {
      label: t('links.herramientas.label'),
      basePath: '/herramientas',
      children: [
        {
          to: '/herramientas',
          label: t('links.herramientas.library.label'),
          icon: 'fa-toolbox',
          color: 'text-sec',
          desc: t('links.herramientas.library.desc'),
        },
        {
          to: '/herramientas/categoria/tiendas-fidgets',
          label: t('links.herramientas.stores.label'),
          icon: 'fa-cart-shopping',
          color: 'text-warm',
          desc: t('links.herramientas.stores.desc'),
        },
      ],
    },
    {
      label: t('links.entender.label'),
      basePath: '/entender-y-prepararse',
      children: [
        {
          to: '/entender-y-prepararse/estados',
          label: t('links.entender.estados.label'),
          icon: 'fa-brain',
          color: 'text-coral',
          desc: t('links.entender.estados.desc'),
        },
        {
          to: '/entender-y-prepararse/senales',
          label: t('links.entender.senales.label'),
          icon: 'fa-triangle-exclamation',
          color: 'text-sec',
          desc: t('links.entender.senales.desc'),
        },
        {
          to: '/entender-y-prepararse/tecnicas',
          label: t('links.entender.tecnicas.label'),
          icon: 'fa-heart-pulse',
          color: 'text-acc',
          desc: t('links.entender.tecnicas.desc'),
        },
        {
          to: '/entender-y-prepararse/kit-de-bolso',
          label: t('links.entender.kitBolso.label'),
          icon: 'fa-kit-medical',
          color: 'text-pri',
          desc: t('links.entender.kitBolso.desc'),
        },
        {
          to: '/entender-y-prepararse/masking',
          label: t('links.entender.masking.label'),
          icon: 'fa-masks-theater',
          color: 'text-pri',
          desc: t('links.entender.masking.desc'),
        },
        {
          to: '/entender-y-prepararse/guias',
          label: t('links.entender.guias.label'),
          icon: 'fa-folder-open',
          color: 'text-sec',
          desc: t('links.entender.guias.desc'),
        },
      ],
    },
  ]
}

// ── Desktop dropdown ───────────────────────────────────────────────────────────

function DesktopDropdown({ link, pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const active = pathname.startsWith(link.basePath)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div
      ref={ref}
      className="relative z-[200]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false) }}
      onKeyDown={handleKeyDown}
    >
      <Link
        ref={triggerRef}
        to={link.basePath}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
          active ? 'bg-white/8 text-text' : 'text-muted hover:text-text hover:bg-white/5'
        }`}
      >
        {link.label}
        <i
          className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full left-0 mt-1.5 w-72 rounded-xl border border-borderH bg-[#0C0E1E] shadow-2xl shadow-black/60 overflow-hidden z-[200] py-1"
          >
            {link.children.map((child) => {
              const childActive = pathname === child.to
              return (
                <Link
                  key={child.to}
                  to={child.to}
                  onClick={() => setOpen(false)}
                  aria-current={childActive ? 'page' : undefined}
                  className={`flex items-start gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/5 ${
                    childActive ? 'bg-white/3' : ''
                  }`}
                >
                  <i className={`fa-solid ${child.icon} text-xs ${child.color} mt-1 shrink-0`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm ${childActive ? 'font-semibold text-text' : 'text-muted'}`}>
                      {child.label}
                    </span>
                    <span className="block text-xs text-faint mt-0.5 leading-snug">{child.desc}</span>
                  </div>
                  {childActive && (
                    <i className="fa-solid fa-check text-[10px] text-pri mt-1 shrink-0" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Navbar ────────────────────────────────────────────────────────────────

export default function Navbar({ onOpenSearch }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation('nav')
  const { t: tc } = useTranslation('common')
  const links = buildLinks(t)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setExpandedMobile(null)
  }, [pathname])

  const handleScrollLink = (e, to) => {
    if (!to.startsWith('/#')) return
    e.preventDefault()
    const id = to.slice(2)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20'
          : 'bg-bg/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-[72px] gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={t('logoAriaLabel')}>
          <img src={`${import.meta.env.BASE_URL}logo-icon.svg`} alt="" className="h-10 w-auto" aria-hidden="true" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label={t('ariaLabel')}>
          {links.map((link) => {
            if (link.children) {
              return <DesktopDropdown key={link.label} link={link} pathname={pathname} />
            }
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                  active
                    ? 'bg-white/8 text-text'
                    : 'text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <button
            type="button"
            onClick={onOpenSearch}
            aria-label={t('search.ariaLabel')}
            title={t('search.title')}
            className="ml-1 p-2 rounded-lg text-faint hover:text-text hover:bg-white/5 transition-colors duration-200"
          >
            <i className="fa-solid fa-magnifying-glass text-sm" aria-hidden="true" />
          </button>
          <LanguageSwitcher className="ml-1" />
          <Link
            to="/ayuda"
            className="ml-1 flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-coral border border-coral/25 bg-coral/5 hover:bg-coral/12 hover:border-coral/40 transition-all duration-200"
            aria-label={tc('crisisCta.navAriaLabel')}
          >
            <i className="fa-solid fa-heart-pulse text-xs" aria-hidden="true" />
            {tc('crisisCta.label')}
          </Link>
        </nav>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label={t('search.mobileAriaLabel')}
            className="p-2 rounded-lg text-faint hover:text-text hover:bg-white/5 transition-colors duration-200"
          >
            <i className="fa-solid fa-magnifying-glass text-sm" aria-hidden="true" />
          </button>
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t('menu.close') : t('menu.open')}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors duration-200"
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-base`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-border bg-bg/98 backdrop-blur-md px-5 pb-4 pt-3 flex flex-col gap-0.5"
            aria-label={t('mobileAriaLabel')}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setMenuOpen(false)
                menuButtonRef.current?.focus()
              }
            }}
          >
            {/* Language switcher — top of the mobile drawer */}
            <LanguageSwitcher className="self-stretch justify-center mb-2" />

            {/* Crisis CTA — always first in mobile drawer */}
            <Link
              to="/ayuda"
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-coral/8 border border-coral/25 text-coral text-sm font-semibold mb-2"
              aria-label={tc('crisisCta.drawerAriaLabel')}
            >
              <i className="fa-solid fa-heart-pulse text-sm" aria-hidden="true" />
              {tc('crisisCta.label')}
              <i className="fa-solid fa-arrow-right text-xs ml-auto" aria-hidden="true" />
            </Link>

            {links.map((link) => {
              if (link.children) {
                const isExpanded = expandedMobile === link.label
                const isActive = pathname.startsWith(link.basePath)
                return (
                  <div key={link.label}>
                    <div className={`flex items-center rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/5' : ''}`}>
                      <Link
                        to={link.basePath}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                          isActive ? 'text-text' : 'text-muted hover:text-text'
                        }`}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setExpandedMobile(isExpanded ? null : link.label)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? t('menu.collapseSection') : t('menu.expandSection')}
                        className="px-3 py-2.5 text-muted hover:text-text transition-colors duration-200"
                      >
                        <i
                          className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-1 mb-1.5 border-l border-border/50 pl-3 flex flex-col gap-0.5">
                            {link.children.map((child) => {
                              const childActive = pathname === child.to
                              return (
                                <Link
                                  key={child.to}
                                  to={child.to}
                                  aria-current={childActive ? 'page' : undefined}
                                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    childActive
                                      ? 'text-text font-semibold bg-white/5'
                                      : 'text-muted hover:text-text hover:bg-white/5'
                                  }`}
                                >
                                  <i className={`fa-solid ${child.icon} text-xs ${child.color}`} aria-hidden="true" />
                                  {child.label}
                                </Link>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              const isActive = pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => link.scroll && handleScrollLink(e, link.to)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-text bg-white/5' : 'text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
