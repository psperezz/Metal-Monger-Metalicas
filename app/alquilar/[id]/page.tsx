'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, CheckCircle2, Loader2, Wrench } from 'lucide-react'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import { supabase } from '@/lib/supabase'
import type { Herramienta, Reserva } from '@/lib/types'

type ReservaForm = {
  cliente_nombre: string
  cliente_telefono: string
  cliente_email: string
  fecha_inicio: string
  fecha_fin: string
  notas: string
}

const EMPTY_FORM: ReservaForm = {
  cliente_nombre: '',
  cliente_telefono: '',
  cliente_email: '',
  fecha_inicio: '',
  fecha_fin: '',
  notas: '',
}

export default function AlquilarHerramientaPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [herramienta, setHerramienta] = useState<Herramienta | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [form, setForm] = useState<ReservaForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [herramientaRes, reservasRes] = await Promise.all([
          supabase.from('herramientas').select('*').eq('id', params.id).single(),
          supabase.from('reservas').select('*').eq('herramienta_id', params.id).order('fecha_inicio', { ascending: true }),
        ])

        if (herramientaRes.error) throw herramientaRes.error
        if (reservasRes.error) throw reservasRes.error

        setHerramienta(herramientaRes.data)
        setReservas(reservasRes.data ?? [])
      } catch {
        setError('No se pudo cargar la herramienta seleccionada.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchData()
  }, [params.id])

  const diasReservados = useMemo(() => {
    if (!form.fecha_inicio || !form.fecha_fin) return 0
    const start = new Date(form.fecha_inicio)
    const end = new Date(form.fecha_fin)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(diff, 0)
  }, [form.fecha_inicio, form.fecha_fin])

  const total = useMemo(() => {
    if (!herramienta) return 0
    return diasReservados * herramienta.precio_dia
  }, [diasReservados, herramienta])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!herramienta) return
    setSaving(true)
    setError(null)

    try {
      const payload = {
        herramienta_id: herramienta.id,
        cliente_nombre: form.cliente_nombre,
        cliente_telefono: form.cliente_telefono || null,
        cliente_email: form.cliente_email || null,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        notas: form.notas || null,
        estado: 'pendiente',
      }

      const { error: insertError } = await supabase.from('reservas').insert([payload])
      if (insertError) throw insertError

      setSent(true)
      setForm(EMPTY_FORM)
    } catch (err: any) {
      setError(err?.message || 'No se pudo registrar la reserva.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  if (!herramienta || error && !herramienta) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="bg-white border border-ink-border rounded-2xl p-8 text-center max-w-md w-full">
          <p className="font-black uppercase tracking-wide text-ink-DEFAULT mb-2">Error</p>
          <p className="text-sm text-ink-muted mb-6">{error ?? 'Herramienta no encontrada.'}</p>
          <Link href="/" className="inline-flex px-4 py-2 rounded-full bg-brand text-white font-black text-xs uppercase tracking-widest">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink-border text-ink-muted hover:text-brand hover:border-brand transition-colors font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
          <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted hover:text-brand transition-colors">
            M3 // Alquiler
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
          <section className="bg-white border border-ink-border rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-600">
              {herramienta.imagen_url ? (
                <img src={herramienta.imagen_url} alt={herramienta.nombre} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wrench size={58} className="text-white/25" />
                </div>
              )}
            </div>

            <div className="p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">{herramienta.categoria}</span>
              <h1 className="mt-2 font-black text-2xl md:text-3xl uppercase tracking-wide text-ink-DEFAULT">
                {herramienta.nombre}
              </h1>
              {herramienta.descripcion && (
                <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-2xl">
                  {herramienta.descripcion}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-ink-border bg-[#FAFAFA] p-4">
                  <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">Tarifa</p>
                  <p className="mt-1 font-black text-2xl text-ink-DEFAULT">USD {herramienta.precio_dia}</p>
                  <p className="text-xs text-ink-muted">por día</p>
                </div>
                <div className="rounded-xl border border-ink-border bg-[#FAFAFA] p-4">
                  <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">Estado</p>
                  <p className="mt-1 font-black text-lg text-ink-DEFAULT uppercase">{herramienta.estado.replace('_', ' ')}</p>
                  <p className="text-xs text-ink-muted">calendario en tiempo real</p>
                </div>
              </div>

              <AvailabilityCalendar reservas={reservas} className="mt-6" />
            </div>
          </section>

          <section className="bg-white border border-ink-border rounded-2xl p-6 h-fit">
            <p className="font-mono text-[10px] text-brand uppercase tracking-[0.3em] mb-1">// Reserva</p>
            <h2 className="font-black text-xl uppercase tracking-wide text-ink-DEFAULT mb-2">Solicitar alquiler</h2>
            <p className="text-sm text-ink-muted mb-6">
              Selecciona tus fechas y registra la solicitud. La disponibilidad se controla automáticamente.
            </p>

            {sent ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <p className="font-black uppercase tracking-wide text-green-700">Reserva enviada</p>
                <p className="mt-2 text-sm text-green-700/80">Tu solicitud quedó registrada como pendiente de confirmación.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 px-4 py-2 rounded-full bg-white border border-green-200 text-green-700 font-mono text-xs uppercase tracking-widest"
                >
                  Hacer otra reserva
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Nombre *</label>
                  <input
                    required
                    value={form.cliente_nombre}
                    onChange={(e) => setForm((f) => ({ ...f, cliente_nombre: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Teléfono</label>
                    <input
                      value={form.cliente_telefono}
                      onChange={(e) => setForm((f) => ({ ...f, cliente_telefono: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
                      placeholder="+593 ..."
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.cliente_email}
                      onChange={(e) => setForm((f) => ({ ...f, cliente_email: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Fecha inicio *</label>
                    <input
                      required
                      type="date"
                      value={form.fecha_inicio}
                      onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Fecha fin *</label>
                    <input
                      required
                      type="date"
                      value={form.fecha_fin}
                      min={form.fecha_inicio || undefined}
                      onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">Notas</label>
                  <textarea
                    rows={4}
                    value={form.notas}
                    onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand resize-none"
                    placeholder="Proyecto, horario de retiro, observaciones..."
                  />
                </div>

                <div className="rounded-xl border border-ink-border bg-[#FAFAFA] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Días reservados</span>
                    <span className="font-black text-ink-DEFAULT">{diasReservados}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Total estimado</span>
                    <span className="font-black text-brand">USD {total}</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving || herramienta.estado !== 'disponible'}
                  className="w-full py-3 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-black text-sm tracking-widest rounded-full transition-all uppercase flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Calendar size={15} />}
                  {saving ? 'Registrando...' : 'Confirmar solicitud'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
