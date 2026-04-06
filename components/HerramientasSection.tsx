'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Herramienta, Reserva } from '@/lib/types'
import HerramientaCard from './HerramientaCard'
import ProductSkeleton from './ProductSkeleton'

const FILTROS = ['Todas', 'Soldadura', 'Corte', 'Perforación', 'Doblado', 'Desbaste', 'Aire Comprimido']

export default function HerramientasSection() {
  const [herramientas, setHerramientas] = useState<Herramienta[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState('Todas')

  useEffect(() => {
    async function fetchData() {
      try {
        const [herramientasRes, reservasRes] = await Promise.all([
          supabase.from('herramientas').select('*').order('created_at', { ascending: false }),
          supabase.from('reservas').select('*').eq('estado', 'confirmada')
        ])

        if (herramientasRes.error) throw herramientasRes.error
        if (reservasRes.error) throw reservasRes.error

        setHerramientas(herramientasRes.data ?? [])
        setReservas(reservasRes.data ?? [])
      } catch {
        setError('No se pudieron cargar las herramientas.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtradas = filtro === 'Todas'
    ? herramientas
    : herramientas.filter((h) => h.categoria === filtro)

  return (
    <section id="alquiler" className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <h2 className="font-black text-2xl tracking-[0.2em] uppercase text-ink-DEFAULT whitespace-nowrap">
            Alquiler
          </h2>
          <div className="flex-1 h-px bg-ink-border" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-ink-muted uppercase whitespace-nowrap">
            M3 // Herramientas
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-ink-muted text-sm max-w-xl mb-10"
        >
          Alquila herramientas industriales de calidad profesional. 
          Verifica disponibilidad en tiempo real y reserva por día.
        </motion.p>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTROS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFiltro(f)}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border transition-all duration-200 ${
                filtro === f
                  ? 'bg-brand text-white border-brand shadow-sm shadow-brand/30'
                  : 'bg-white text-ink-muted border-ink-border hover:border-brand hover:text-brand'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            filtradas.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <p className="font-mono text-sm text-ink-muted">
                  // No hay herramientas en esta categoría
                </p>
              </div>
            ) : (
              filtradas.map((h, i) => (
                <HerramientaCard 
                  key={h.id} 
                  herramienta={h} 
                  reservas={reservas}
                  index={i} 
                />
              ))
            )
          )}
        </div>
      </div>
    </section>
  )
}
