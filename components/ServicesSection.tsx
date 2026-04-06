'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Producto } from '@/lib/types'
import ProductCard from './ProductCard'
import ProductSkeleton from './ProductSkeleton'

const FILTROS = ['Todos', 'Mobiliario', 'Estructura', 'Remodelación']

export default function ServicesSection() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [filtro, setFiltro]       = useState('Todos')

  useEffect(() => {
    async function fetchProductos() {
      try {
        const { data, error: err } = await supabase
          .from('productos')
          .select('*')
          .order('created_at', { ascending: false })

        if (err) throw err
        setProductos(data ?? [])
      } catch {
        setError('No se pudieron cargar los productos. Verifica las variables de entorno de Supabase.')
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [])

  const filtrados  = filtro === 'Todos'
    ? productos
    : productos.filter((p) => p.categoria === filtro)


  return (
    <>
      {/* ── Servicios ── */}
      <section id="servicios" className="py-20 bg-[#FAFAFA]">
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
              Servicios
            </h2>
            <div className="flex-1 h-px bg-ink-border" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-ink-muted uppercase whitespace-nowrap">
              M3 // Catálogo
            </span>
          </motion.div>

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
              <p className="font-mono text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {filtrados.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-3 text-center py-16"
                  >
                    <p className="font-mono text-sm text-ink-muted">
                      // Sin productos en esta categoría
                    </p>
                  </motion.div>
                ) : (
                  filtrados.map((p, i) => (
                    <ProductCard key={p.id} producto={p} index={i} />
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

    </>
  )
}
