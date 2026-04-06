'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Herramienta, Reserva } from '@/lib/types'
import {
  ArrowLeft, Calendar, CheckCircle2, Hammer, Loader2,
  Pencil, Plus, Save, Trash2, X,
} from 'lucide-react'

type Toast = { type: 'success' | 'error'; msg: string }

type HForm = {
  nombre: string; categoria: string; precio_dia: number
  descripcion: string; imagen_url: string
  estado: 'disponible' | 'mantenimiento' | 'no_disponible'
}

type RForm = {
  herramienta_id: string; cliente_nombre: string
  cliente_telefono: string; cliente_email: string
  fecha_inicio: string; fecha_fin: string
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  notas: string
}

const EMPTY_H: HForm = { nombre: '', categoria: 'General', precio_dia: 0, descripcion: '', imagen_url: '', estado: 'disponible' }
const EMPTY_R: RForm = { herramienta_id: '', cliente_nombre: '', cliente_telefono: '', cliente_email: '', fecha_inicio: '', fecha_fin: '', estado: 'confirmada', notas: '' }
const CATS = ['General', 'Soldadura', 'Corte', 'Perforación', 'Doblado', 'Desbaste', 'Aire Comprimido']

export default function AdminHerramientasPage() {
  const router = useRouter()
  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [herramientas, setHerramientas] = useState<Herramienta[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [hModal, setHModal] = useState<'create' | 'edit' | null>(null)
  const [rModal, setRModal] = useState(false)
  const [hId, setHId] = useState<string | null>(null)
  const [hForm, setHForm] = useState<HForm>(EMPTY_H)
  const [rForm, setRForm] = useState<RForm>(EMPTY_R)

  const flash = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3500) }

  const fetchData = useCallback(async () => {
    const [hr, rr] = await Promise.all([
      supabase.from('herramientas').select('*').order('created_at', { ascending: false }),
      supabase.from('reservas').select('*').order('fecha_inicio', { ascending: false }),
    ])
    setHerramientas(hr.data ?? [])
    setReservas(rr.data ?? [])
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      setAuth(true)
      fetchData().finally(() => setLoading(false))
    })
  }, [fetchData, router])

  const hMap = useMemo(() => Object.fromEntries(herramientas.map(h => [h.id, h.nombre])), [herramientas])

  const openCreateH = () => { setHForm(EMPTY_H); setHId(null); setHModal('create') }
  const openEditH = (h: Herramienta) => {
    setHForm({ nombre: h.nombre, categoria: h.categoria, precio_dia: h.precio_dia, descripcion: h.descripcion ?? '', imagen_url: h.imagen_url ?? '', estado: h.estado })
    setHId(h.id); setHModal('edit')
  }
  const openCreateR = () => { setRForm({ ...EMPTY_R, herramienta_id: herramientas[0]?.id ?? '' }); setRModal(true) }

  const saveH = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const p = { ...hForm, precio_dia: Number(hForm.precio_dia), descripcion: hForm.descripcion || null, imagen_url: hForm.imagen_url || null }
      if (hModal === 'create') { const { error } = await supabase.from('herramientas').insert([p]); if (error) throw error }
      if (hModal === 'edit' && hId) { const { error } = await supabase.from('herramientas').update(p).eq('id', hId); if (error) throw error }
      await fetchData(); setHModal(null); flash({ type: 'success', msg: 'Herramienta guardada.' })
    } catch { flash({ type: 'error', msg: 'Error al guardar herramienta.' }) }
    finally { setSaving(false) }
  }

  const deleteH = async (id: string) => {
    const { error } = await supabase.from('herramientas').delete().eq('id', id)
    if (error) { flash({ type: 'error', msg: 'Error al eliminar.' }); return }
    await fetchData(); flash({ type: 'success', msg: 'Herramienta eliminada.' })
  }

  const saveR = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const p = { ...rForm, cliente_telefono: rForm.cliente_telefono || null, cliente_email: rForm.cliente_email || null, notas: rForm.notas || null }
      const { error } = await supabase.from('reservas').insert([p])
      if (error) throw error
      await fetchData(); setRModal(false); flash({ type: 'success', msg: 'Reserva registrada.' })
    } catch (err: any) { flash({ type: 'error', msg: err?.message || 'Error al crear reserva.' }) }
    finally { setSaving(false) }
  }

  const updateREstado = async (id: string, estado: Reserva['estado']) => {
    const { error } = await supabase.from('reservas').update({ estado }).eq('id', id)
    if (error) { flash({ type: 'error', msg: 'Error al actualizar.' }); return }
    await fetchData(); flash({ type: 'success', msg: 'Estado actualizado.' })
  }

  const deleteR = async (id: string) => {
    const { error } = await supabase.from('reservas').delete().eq('id', id)
    if (error) { flash({ type: 'error', msg: 'Error al eliminar reserva.' }); return }
    await fetchData(); flash({ type: 'success', msg: 'Reserva eliminada.' })
  }

  if (!auth) return <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>

  const inp = "w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm focus:outline-none focus:border-brand"
  const lbl = "block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5"

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-mono ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={14} /> : <X size={14} />}
          {toast.msg}
        </div>
      )}

      <header className="bg-white border-b border-ink-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="inline-flex items-center gap-2 text-ink-muted hover:text-brand transition-colors font-mono text-xs uppercase tracking-widest"><ArrowLeft size={14} />Panel</Link>
            <span className="h-4 w-px bg-ink-border" />
            <p className="font-black text-xs uppercase tracking-[0.12em] text-ink-DEFAULT">Alquiler</p>
          </div>
          <Link href="/" target="_blank" className="font-mono text-[9px] text-ink-muted hover:text-brand uppercase tracking-widest">Ver sitio →</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Herramientas', v: herramientas.length },
            { l: 'Disponibles', v: herramientas.filter(h => h.estado === 'disponible').length },
            { l: 'Reservas activas', v: reservas.filter(r => r.estado === 'pendiente' || r.estado === 'confirmada').length },
            { l: 'Total reservas', v: reservas.length },
          ].map(({ l, v }) => (
            <div key={l} className="bg-white border border-ink-border rounded-xl p-4">
              <p className="font-condensed font-black text-3xl text-ink-DEFAULT">{v}</p>
              <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* Herramientas table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><Hammer size={16} className="text-ink-muted" /><h2 className="font-black text-sm uppercase tracking-widest text-ink-DEFAULT">Herramientas</h2></div>
            <button onClick={openCreateH} className="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-black tracking-widest rounded-full transition-all uppercase"><Plus size={13} />Nueva</button>
          </div>
          <div className="bg-white border border-ink-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand animate-spin" /></div>
            ) : herramientas.length === 0 ? (
              <div className="text-center py-20"><Hammer size={32} className="text-ink-border mx-auto mb-3" /><p className="font-mono text-xs text-ink-muted">Sin herramientas.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-ink-border bg-[#FAFAFA]">{['Nombre', 'Categoría', 'Tarifa', 'Estado', ''].map(h => <th key={h} className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{h}</th>)}</tr></thead>
                  <tbody>
                    {herramientas.map(h => (
                      <tr key={h.id} className="border-b border-ink-border last:border-0 hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-5 py-4"><p className="font-black text-xs uppercase tracking-wide text-ink-DEFAULT">{h.nombre}</p>{h.descripcion && <p className="text-ink-muted text-[10px] mt-0.5 line-clamp-1 max-w-[220px]">{h.descripcion}</p>}</td>
                        <td className="px-5 py-4 font-mono text-[10px] text-ink-muted">{h.categoria}</td>
                        <td className="px-5 py-4 font-mono text-xs text-ink-DEFAULT">USD {h.precio_dia}</td>
                        <td className="px-5 py-4"><span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-brand/10 text-brand border border-brand/20">{h.estado.replace('_', ' ')}</span></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><button onClick={() => openEditH(h)} className="p-1.5 rounded-md text-ink-muted hover:text-brand hover:bg-brand-muted transition-colors"><Pencil size={13} /></button><button onClick={() => deleteH(h.id)} className="p-1.5 rounded-md text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Reservas table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><Calendar size={16} className="text-ink-muted" /><h2 className="font-black text-sm uppercase tracking-widest text-ink-DEFAULT">Reservas / Bloqueos</h2></div>
            <button onClick={openCreateR} className="flex items-center gap-1.5 px-4 py-2 bg-ink-DEFAULT hover:bg-ink-soft text-white text-xs font-black tracking-widest rounded-full transition-all uppercase"><Plus size={13} />Nuevo bloqueo</button>
          </div>
          <div className="bg-white border border-ink-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand animate-spin" /></div>
            ) : reservas.length === 0 ? (
              <div className="text-center py-20"><Calendar size={32} className="text-ink-border mx-auto mb-3" /><p className="font-mono text-xs text-ink-muted">Sin reservas.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-ink-border bg-[#FAFAFA]">{['Herramienta', 'Cliente', 'Fechas', 'Estado', ''].map(h => <th key={h} className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{h}</th>)}</tr></thead>
                  <tbody>
                    {reservas.map(r => (
                      <tr key={r.id} className="border-b border-ink-border last:border-0 hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-5 py-4 font-black text-xs uppercase tracking-wide text-ink-DEFAULT">{hMap[r.herramienta_id] ?? '—'}</td>
                        <td className="px-5 py-4"><p className="font-black text-xs text-ink-DEFAULT">{r.cliente_nombre}</p><p className="text-[10px] text-ink-muted">{r.cliente_telefono ?? r.cliente_email ?? '—'}</p></td>
                        <td className="px-5 py-4 font-mono text-[10px] text-ink-muted">{r.fecha_inicio} → {r.fecha_fin}</td>
                        <td className="px-5 py-4">
                          <select value={r.estado} onChange={e => updateREstado(r.id, e.target.value as Reserva['estado'])} className="px-3 py-1.5 rounded-lg border border-ink-border bg-white text-[10px] font-mono uppercase tracking-widest">
                            {['pendiente', 'confirmada', 'cancelada', 'completada'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-4"><button onClick={() => deleteR(r.id)} className="p-1.5 rounded-md text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Herramienta modal */}
      {hModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-border">
              <div>
                <p className="font-mono text-[9px] text-brand uppercase tracking-[0.3em]">{hModal === 'create' ? '// Nueva' : '// Editar'}</p>
                <h3 className="font-black text-lg uppercase tracking-wide text-ink-DEFAULT mt-0.5">{hModal === 'create' ? 'Crear Herramienta' : 'Editar Herramienta'}</h3>
              </div>
              <button onClick={() => setHModal(null)} className="p-2 rounded-full hover:bg-ink-border transition-colors text-ink-muted"><X size={16} /></button>
            </div>
            <form onSubmit={saveH} className="p-6 space-y-4">
              <div><label className={lbl}>Nombre *</label><input required value={hForm.nombre} onChange={e => setHForm(f => ({ ...f, nombre: e.target.value }))} className={inp} placeholder="Soldadora MIG 250A" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Categoría</label><select value={hForm.categoria} onChange={e => setHForm(f => ({ ...f, categoria: e.target.value }))} className={`${inp} bg-white`}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={lbl}>Tarifa USD/día</label><input required type="number" min={0} value={hForm.precio_dia} onChange={e => setHForm(f => ({ ...f, precio_dia: Number(e.target.value) }))} className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Estado</label><select value={hForm.estado} onChange={e => setHForm(f => ({ ...f, estado: e.target.value as HForm['estado'] }))} className={`${inp} bg-white`}><option value="disponible">Disponible</option><option value="mantenimiento">Mantenimiento</option><option value="no_disponible">No disponible</option></select></div>
                <div><label className={lbl}>URL Imagen</label><input value={hForm.imagen_url} onChange={e => setHForm(f => ({ ...f, imagen_url: e.target.value }))} className={inp} placeholder="https://..." /></div>
              </div>
              <div><label className={lbl}>Descripción</label><textarea rows={3} value={hForm.descripcion} onChange={e => setHForm(f => ({ ...f, descripcion: e.target.value }))} className={`${inp} resize-none`} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setHModal(null)} className="flex-1 py-2.5 border border-ink-border rounded-full text-sm font-mono text-ink-muted hover:border-ink-DEFAULT transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-black text-sm tracking-widest rounded-full transition-all uppercase flex items-center justify-center gap-2">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reserva modal */}
      {rModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-border">
              <div>
                <p className="font-mono text-[9px] text-brand uppercase tracking-[0.3em]">// Nueva Reserva</p>
                <h3 className="font-black text-lg uppercase tracking-wide text-ink-DEFAULT mt-0.5">Bloqueo / Reserva manual</h3>
              </div>
              <button onClick={() => setRModal(false)} className="p-2 rounded-full hover:bg-ink-border transition-colors text-ink-muted"><X size={16} /></button>
            </div>
            <form onSubmit={saveR} className="p-6 space-y-4">
              <div><label className={lbl}>Herramienta *</label><select required value={rForm.herramienta_id} onChange={e => setRForm(f => ({ ...f, herramienta_id: e.target.value }))} className={`${inp} bg-white`}>{herramientas.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Cliente / motivo *</label><input required value={rForm.cliente_nombre} onChange={e => setRForm(f => ({ ...f, cliente_nombre: e.target.value }))} className={inp} placeholder="Cliente o Bloqueo interno" /></div>
                <div><label className={lbl}>Estado</label><select value={rForm.estado} onChange={e => setRForm(f => ({ ...f, estado: e.target.value as RForm['estado'] }))} className={`${inp} bg-white`}><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="cancelada">Cancelada</option><option value="completada">Completada</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Fecha inicio *</label><input required type="date" value={rForm.fecha_inicio} onChange={e => setRForm(f => ({ ...f, fecha_inicio: e.target.value }))} className={inp} /></div>
                <div><label className={lbl}>Fecha fin *</label><input required type="date" min={rForm.fecha_inicio || undefined} value={rForm.fecha_fin} onChange={e => setRForm(f => ({ ...f, fecha_fin: e.target.value }))} className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Teléfono</label><input value={rForm.cliente_telefono} onChange={e => setRForm(f => ({ ...f, cliente_telefono: e.target.value }))} className={inp} /></div>
                <div><label className={lbl}>Email</label><input type="email" value={rForm.cliente_email} onChange={e => setRForm(f => ({ ...f, cliente_email: e.target.value }))} className={inp} /></div>
              </div>
              <div><label className={lbl}>Notas</label><textarea rows={2} value={rForm.notas} onChange={e => setRForm(f => ({ ...f, notas: e.target.value }))} className={`${inp} resize-none`} placeholder="Observaciones..." /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRModal(false)} className="flex-1 py-2.5 border border-ink-border rounded-full text-sm font-mono text-ink-muted hover:border-ink-DEFAULT transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-black text-sm tracking-widest rounded-full transition-all uppercase flex items-center justify-center gap-2">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
