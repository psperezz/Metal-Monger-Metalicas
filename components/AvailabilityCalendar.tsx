'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Reserva } from '@/lib/types'

interface CalendarProps {
  reservas: Reserva[]
  onDateSelect?: (date: Date) => void
  selectedRange?: { start: Date | null; end: Date | null }
  className?: string
}

export default function AvailabilityCalendar({ 
  reservas, 
  onDateSelect, 
  selectedRange,
  className = '' 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const ocupados = useMemo(() => {
    const dates = new Set<string>()
    reservas
      .filter(r => r.estado === 'confirmada' || r.estado === 'pendiente')
      .forEach(r => {
        const start = new Date(r.fecha_inicio)
        const end = new Date(r.fecha_fin)
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.add(d.toISOString().split('T')[0])
        }
      })
    return dates
  }, [reservas])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const days: (Date | null)[] = []
    
    for (let i = 0; i < startPadding; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    
    return days
  }, [currentMonth])

  const isOcupado = (date: Date) => ocupados.has(date.toISOString().split('T')[0])
  
  const isSelected = (date: Date) => {
    if (!selectedRange?.start) return false
    const dateStr = date.toISOString().split('T')[0]
    const startStr = selectedRange.start?.toISOString().split('T')[0]
    const endStr = selectedRange.end?.toISOString().split('T')[0]
    
    if (!endStr) return dateStr === startStr
    return dateStr >= startStr! && dateStr <= endStr
  }

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  return (
    <div className={`bg-white rounded-xl border border-ink-border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth}
          className="p-1 hover:bg-brand-muted rounded-lg transition-colors"
        >
          <ChevronLeft size={18} className="text-ink-muted" />
        </button>
        <span className="font-black text-sm uppercase tracking-wide">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          onClick={nextMonth}
          className="p-1 hover:bg-brand-muted rounded-lg transition-colors"
        >
          <ChevronRight size={18} className="text-ink-muted" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center py-1 font-mono text-[9px] text-ink-muted uppercase">
            {day}
          </div>
        ))}
        
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={idx} className="aspect-square" />
          
          const ocupado = isOcupado(date)
          const selected = isSelected(date)
          const isToday = date.toDateString() === new Date().toDateString()
          
          return (
            <button
              key={idx}
              onClick={() => onDateSelect?.(date)}
              disabled={ocupado && !onDateSelect}
              className={`
                aspect-square rounded-lg text-xs font-medium relative
                transition-all duration-200
                ${ocupado 
                  ? 'bg-red-100 text-red-500 cursor-not-allowed' 
                  : selected
                    ? 'bg-brand text-white'
                    : 'hover:bg-brand-muted text-ink-DEFAULT'
                }
                ${isToday && !selected && !ocupado ? 'ring-1 ring-brand' : ''}
              `}
            >
              {date.getDate()}
              {ocupado && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-ink-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-brand" />
          <span className="text-[10px] font-mono text-ink-muted uppercase">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100" />
          <span className="text-[10px] font-mono text-ink-muted uppercase">Ocupado</span>
        </div>
      </div>
    </div>
  )
}
