'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Producto, ProductoInsert } from '@/lib/types'
import { CATEGORIAS } from '@/lib/types'
import {
  Plus, Pencil, Trash2, LogOut, X, Save, Loader2,
  Package, AlertCircle, CheckCircle2, Hammer
} from 'lucide-react'

const EMPTY_FORM: ProductoInsert = {
  nombre: '', categoria: 'Mobiliario', precio: 0,
  material: '', coordenadas_diseno: '', imagen_url: '', descripcion: '',
}

type Toast = { type: 'success' | 'error'; msg: string }

export default function AdminPage() {
  const router = useRouter()

  const [auth, setAuth]         = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<'create' | 'edit' | null>(null)
  const [editId, setEditId]     = useState<string | null>(null)
  const [form, setForm]         = useState<ProductoInsert>(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast]       = useState<Toast | null>(null)

  const showToast = (t: Toast) => {
    setToast(t)
    setTimeout(() => setToast(null), 3500)
  }

  const fetchProductos = useCallback(async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })
    setProductos(data ?? [])
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login')
      } else {
        setAuth(true)
        fetchProductos().finally(() => setLoading(false))
      }
    })
  }, [router, fetchProductos])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModal('create')
  }

  const openEdit = (p: Producto) => {
    setForm({
      nombre: p.nombre, categoria: p.categoria, precio: p.precio,
      material: p.material ?? '', coordenadas_diseno: p.coordenadas_diseno ?? '',
      imagen_url: p.imagen_url ?? '', descripcion: p.descripcion ?? '',
    })
    setEditId(p.id)
    setModal('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        material: form.material || null,
        coordenadas_diseno: form.coordenadas_diseno || null,
        imagen_url: form.imagen_url || null,
        descripcion: form.descripcion || null,
      }

      if (modal === 'create') {
        const { error } = await supabase.from('productos').insert([payload])
        if (error) throw error
        showToast({ type: 'success', msg: 'Producto creado correctamente.' })
      } else if (modal === 'edit' && editId) {
        const { error } = await supabase.from('productos').update(payload).eq('id', editId)
        if (error) throw error
        showToast({ type: 'success', msg: 'Producto actualizado.' })
      }

      await fetchProductos()
      setModal(null)
    } catch {
      showToast({ type: 'error', msg: 'Error al guardar. Intenta nuevamente.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) {
      showToast({ type: 'error', msg: 'Error al eliminar.' })
    } else {
      showToast({ type: 'success', msg: 'Producto eliminado.' })
      await fetchProductos()
    }
    setDeleteId(null)
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-mono ${
          toast.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={14} />
            : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <header className="bg-white border-b border-ink-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 34 34" fill="none" className="w-7 h-7">
              <polygon points="17,2 30,9.5 30,24.5 17,32 4,24.5 4,9.5" fill="#FF5C00" />
              <text x="17" y="22" textAnchor="middle" fill="white" fontSize="9"
                fontWeight="900" fontFamily="system-ui">M3</text>
            </svg>
            <div className="hidden sm:block">
              <p className="text-xs font-black tracking-[0.12em] uppercase text-ink-DEFAULT">
                Metal·Monger
              </p>
              <p className="font-mono text-[8px] text-ink-muted tracking-widest uppercase">
                Administración
              </p>
            </div>
            <span className="hidden md:block h-4 w-px bg-ink-border mx-2" />
            <span className="hidden md:block font-mono text-[9px] text-ink-muted uppercase tracking-widest">
              Panel de Control
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href="/" target="_blank"
              className="hidden sm:block font-mono text-[9px] text-ink-muted hover:text-brand uppercase tracking-widest transition-colors">
              Ver sitio →
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink-border hover:border-brand hover:text-brand text-ink-muted text-xs font-mono transition-colors"
            >
              <LogOut size={11} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Productos', value: productos.length },
            { label: 'Mobiliario',    value: productos.filter(p => p.categoria === 'Mobiliario').length },
            { label: 'Estructura',   value: productos.filter(p => p.categoria === 'Estructura').length },
            { label: 'Remodelación', value: productos.filter(p => p.categoria === 'Remodelación').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-ink-border rounded-xl p-4">
              <p className="font-condensed font-black text-3xl text-ink-DEFAULT">{value}</p>
              <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package size={16} className="text-ink-muted" />
            <h2 className="font-black text-sm uppercase tracking-widest text-ink-DEFAULT">
              Catálogo de Productos
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/herramientas"
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-brand text-brand hover:bg-brand-muted text-xs font-black tracking-widest rounded-full transition-all uppercase"
            >
              <Hammer size={13} />
              Panel Alquiler
            </a>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-black tracking-widest rounded-full transition-all uppercase"
            >
              <Plus size={13} />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-ink-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-brand animate-spin" />
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20">
              <Package size={32} className="text-ink-border mx-auto mb-3" />
              <p className="font-mono text-xs text-ink-muted">Sin productos. Crea el primero.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ink-border bg-[#FAFAFA]">
                    {['Nombre', 'Categoría', 'Precio', 'Material', 'Acciones'].map((h) => (
                      <th key={h} className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-b border-ink-border last:border-0 hover:bg-[#FAFAFA] transition-colors ${i % 2 === 0 ? '' : 'bg-white'}`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-black text-xs uppercase tracking-wide text-ink-DEFAULT">{p.nombre}</p>
                        {p.descripcion && (
                          <p className="text-ink-muted text-[10px] mt-0.5 line-clamp-1 max-w-[200px]">{p.descripcion}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-brand/10 text-brand border border-brand/20">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-ink-DEFAULT">
                          ${p.precio.toLocaleString('es-MX')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-[10px] text-ink-muted">{p.material ?? '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-md text-ink-muted hover:text-brand hover:bg-brand-muted transition-colors"
                            aria-label="Editar"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 rounded-md text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-border">
              <div>
                <p className="font-mono text-[9px] text-brand uppercase tracking-[0.3em]">
                  {modal === 'create' ? '// Nuevo Producto' : '// Editar Producto'}
                </p>
                <h3 className="font-black text-lg uppercase tracking-wide text-ink-DEFAULT mt-0.5">
                  {modal === 'create' ? 'Crear Producto' : 'Editar Producto'}
                </h3>
              </div>
              <button
                onClick={() => setModal(null)}
                className="p-2 rounded-full hover:bg-ink-border transition-colors text-ink-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  Nombre *
                </label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Estantería Industrial Reforzada"
                  className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              {/* Categoría + Precio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                    Categoría *
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors bg-white"
                  >
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                    Precio (MXN) *
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.precio}
                    onChange={(e) => setForm(f => ({ ...f, precio: Number(e.target.value) }))}
                    placeholder="8500"
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Material + Coordenadas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                    Material
                  </label>
                  <input
                    value={form.material ?? ''}
                    onChange={(e) => setForm(f => ({ ...f, material: e.target.value }))}
                    placeholder="ASTM A36"
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                    Coordenadas Diseño
                  </label>
                  <input
                    value={form.coordenadas_diseno ?? ''}
                    onChange={(e) => setForm(f => ({ ...f, coordenadas_diseno: e.target.value }))}
                    placeholder="19.4326° N, 99.1332° W"
                    className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              {/* URL Imagen */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={form.imagen_url ?? ''}
                  onChange={(e) => setForm(f => ({ ...f, imagen_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={form.descripcion ?? ''}
                  onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Descripción del producto..."
                  className="w-full px-4 py-2.5 border border-ink-border rounded-lg text-sm text-ink-DEFAULT focus:outline-none focus:border-brand transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 border border-ink-border rounded-full text-sm font-mono text-ink-muted hover:border-ink-DEFAULT transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-black text-sm tracking-widest rounded-full transition-all uppercase flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <h3 className="font-black text-center text-ink-DEFAULT uppercase tracking-wide mb-2">
              ¿Eliminar Producto?
            </h3>
            <p className="text-center text-sm text-ink-muted mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-ink-border rounded-full text-sm font-mono text-ink-muted hover:border-ink-DEFAULT transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-sm tracking-widest rounded-full transition-all uppercase"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
