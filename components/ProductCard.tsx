'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Layers, Maximize2 } from 'lucide-react'
import type { Producto } from '@/lib/types'

const CATEGORIA_COLORS: Record<string, string> = {
  Mobiliario:  'bg-brand/10 text-brand border border-brand/20',
  Estructura:  'bg-ink-DEFAULT/5 text-ink-DEFAULT border border-ink-DEFAULT/15',
  Remodelación: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const GRADIENT_PLACEHOLDERS = [
  'from-slate-800 to-slate-600',
  'from-zinc-800 to-zinc-600',
  'from-stone-700 to-stone-500',
]

interface Props {
  producto: Producto
  index: number
}

export default function ProductCard({ producto, index }: Props) {
  const gradClass = GRADIENT_PLACEHOLDERS[index % GRADIENT_PLACEHOLDERS.length]
  const catClass  = CATEGORIA_COLORS[producto.categoria] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden border border-ink-border shadow-sm hover:shadow-md hover:border-brand/40 transition-all duration-300 flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {producto.imagen_url && !imgError ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradClass} flex items-center justify-center`}>
            <svg viewBox="0 0 70 80" fill="none" className="w-12 h-14 opacity-30">
              <polygon points="35,4 64,20 64,60 35,76 6,60 6,20" fill="white" />
              <text x="35" y="52" textAnchor="middle" fill="white" fontSize="18"
                fontWeight="900" fontFamily="system-ui">M3</text>
            </svg>
          </div>
        )}

        {/* Orange accent dot */}
        <div className="absolute top-3 right-3 w-3 h-3 bg-brand rounded-full shadow-md" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase backdrop-blur-sm ${catClass}`}>
            {producto.categoria}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-black text-ink-DEFAULT text-sm uppercase tracking-wide leading-tight">
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="mt-1.5 text-ink-muted text-xs leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-3">
            <span className="font-mono text-xs text-ink-muted">USD</span>
            <span className="font-black text-lg text-ink-DEFAULT">
              ${producto.precio.toLocaleString('en-US')}
            </span>
          </div>

          {/* Metadata footer */}
          <div className="flex items-center justify-between border-t border-ink-border pt-3">
            <div className="flex flex-col gap-0.5">
              {producto.coordenadas_diseno && (
                <span className="flex items-center gap-1 font-mono text-[9px] text-ink-muted uppercase tracking-widest">
                  <MapPin size={8} className="text-brand shrink-0" />
                  {producto.coordenadas_diseno}
                </span>
              )}
              {producto.material && (
                <span className="flex items-center gap-1 font-mono text-[9px] text-ink-muted uppercase tracking-widest">
                  <Layers size={8} className="text-brand shrink-0" />
                  MAT: {producto.material}
                </span>
              )}
            </div>
            <button
              className="p-1.5 rounded-md text-ink-muted hover:text-brand hover:bg-brand-muted transition-colors"
              aria-label="Ver detalle"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
