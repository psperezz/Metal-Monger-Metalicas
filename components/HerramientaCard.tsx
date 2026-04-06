'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wrench, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import type { Herramienta, Reserva } from '@/lib/types'
import AvailabilityCalendar from './AvailabilityCalendar'

interface Props {
  herramienta: Herramienta
  reservas: Reserva[]
  index: number
}

const ESTADO_COLORS = {
  disponible: 'bg-green-100 text-green-700 border-green-200',
  mantenimiento: 'bg-amber-100 text-amber-700 border-amber-200',
  no_disponible: 'bg-red-100 text-red-700 border-red-200'
}

const ESTADO_LABELS = {
  disponible: 'Disponible',
  mantenimiento: 'En Mantenimiento',
  no_disponible: 'No Disponible'
}

export default function HerramientaCard({ herramienta, reservas, index }: Props) {
  const [showCalendar, setShowCalendar] = useState(false)
  
  const herramientaReservas = reservas.filter(r => r.herramienta_id === herramienta.id)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden border border-ink-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-600">
        {herramienta.imagen_url ? (
          <img
            src={herramienta.imagen_url}
            alt={herramienta.nombre}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wrench size={48} className="text-white/30" />
          </div>
        )}
        
        {/* Estado badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase backdrop-blur-sm ${ESTADO_COLORS[herramienta.estado]}`}>
            {ESTADO_LABELS[herramienta.estado]}
          </span>
        </div>
        
        {/* Precio badge */}
        <div className="absolute top-3 right-3 bg-brand text-white px-2 py-1 rounded-lg">
          <span className="font-mono text-[9px] uppercase tracking-wider">USD {herramienta.precio_dia}</span>
          <span className="text-[8px] opacity-80">/día</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[9px] text-brand uppercase tracking-widest">
              {herramienta.categoria}
            </span>
            <h3 className="font-black text-ink-DEFAULT text-sm uppercase tracking-wide leading-tight mt-0.5">
              {herramienta.nombre}
            </h3>
          </div>
        </div>

        {herramienta.descripcion && (
          <p className="mt-2 text-ink-muted text-xs leading-relaxed line-clamp-2">
            {herramienta.descripcion}
          </p>
        )}

        {/* Calendar toggle */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full py-2 bg-[#FAFAFA] hover:bg-brand-muted border border-ink-border hover:border-brand rounded-lg text-ink-DEFAULT font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Calendar size={14} />
            {showCalendar ? 'Ocultar Calendario' : 'Ver Disponibilidad'}
          </button>
          
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <AvailabilityCalendar 
                reservas={herramientaReservas}
                className="shadow-inner"
              />
              
              {herramienta.estado === 'disponible' && (
                <a
                  href={`/alquilar/${herramienta.id}`}
                  className="mt-3 w-full py-2.5 bg-brand hover:bg-brand-hover text-white font-black text-xs tracking-widest rounded-full transition-all hover:shadow-lg uppercase flex items-center justify-center gap-2"
                >
                  <DollarSign size={14} />
                  Reservar Ahora
                </a>
              )}
            </motion.div>
          )}
        </div>

        {herramienta.estado !== 'disponible' && (
          <div className="mt-3 flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle size={12} />
            <span className="text-[10px] font-mono uppercase tracking-wide">
              No disponible para reserva
            </span>
          </div>
        )}
      </div>
    </motion.article>
  )
}
