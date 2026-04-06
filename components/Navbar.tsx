'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'INICIO', href: '#inicio' },
  { label: 'SERVICIOS', href: '#servicios' },
  { label: 'ALQUILER', href: '#alquiler' },
  { label: 'NOSOTROS', href: '#nosotros' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-ink-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="/logo-m3-icon.png"
              alt="M3 Metal·Monger Metálicas"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-1.5 rounded-full bg-brand text-white text-[11px] font-black tracking-[0.12em] hover:bg-brand-hover transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#nosotros')}
              className="ml-2 px-4 py-1.5 rounded-full border-2 border-dashed border-brand text-brand text-[11px] font-black tracking-[0.1em] hover:bg-brand-muted transition-colors"
            >
              SOLICITAR COTIZACIÓN
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-6 bg-ink transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white border-b border-ink-border px-4 pb-4"
        >
          <div className="flex flex-col gap-2 pt-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="w-full py-2.5 rounded-full bg-brand text-white text-sm font-black tracking-widest"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#nosotros')}
              className="w-full py-2.5 rounded-full border-2 border-dashed border-brand text-brand text-sm font-black tracking-widest"
            >
              SOLICITAR COTIZACIÓN
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
