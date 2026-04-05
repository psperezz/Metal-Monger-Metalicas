'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin } from 'lucide-react'

// ─── CAMBIA ESTE NÚMERO POR EL TUYO (código de país sin + ni espacios) ───
const WA_NUMBER = '593979498966'
// ─────────────────────────────────────────────────────────────────────────

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.486a.5.5 0 0 0 .617.611l5.757-1.505A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.523-5.165-1.427l-.362-.216-3.756.982.999-3.648-.235-.376A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

export default function ContactSection() {
  const [form, setForm] = useState({ nombre: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Hola, soy *${form.nombre}*.\n\n${form.mensaje}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank')
    setSent(true)
    setForm({ nombre: '', mensaje: '' })
  }

  return (
    <section id="nosotros" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-black text-2xl tracking-[0.2em] uppercase text-ink-DEFAULT">
                Nosotros
              </h2>
              <div className="flex-1 h-px bg-ink-border" />
            </div>

            <h3 className="font-condensed font-black text-4xl md:text-5xl uppercase leading-tight text-ink-DEFAULT mb-6">
              Fabricamos<br />
              <span className="text-brand">Precisión</span><br />
              en Acero
            </h3>

            <p className="text-ink-muted leading-relaxed mb-6 max-w-md">
              M3 Metal-Monger es un taller especializado en metalurgia de precisión.
              Trabajamos con los mejores estándares ASTM para garantizar resistencia,
              durabilidad y estética en cada proyecto.
            </p>

            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl border border-ink-border bg-[#FAFAFA]">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shrink-0 font-black text-white text-sm">
                PP
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-wide text-ink-DEFAULT">
                  Arq. Pablo Pérez
                </p>
                <p className="font-mono text-[9px] text-brand uppercase tracking-widest mt-0.5">
                  Artesano en Cerrajería · Titulado JNDA
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Phone,     label: '+593 979 498 966' },
                { icon: Phone,     label: '+593 963 249 391' },
                { icon: WhatsAppIcon, label: 'WhatsApp disponible' },
                { icon: MapPin,    label: 'Quito, Ecuador' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-brand" />
                  </div>
                  <span className="font-mono text-xs text-ink-soft tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-ink-border">
              {[
                { n: '7+', label: 'Años de experiencia' },
                { n: '40+', label: 'Proyectos completados' },
                { n: '100%', label: 'Satisfacción garantizada' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="font-condensed font-black text-3xl text-brand">{n}</p>
                  <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-[#FAFAFA] rounded-2xl border border-ink-border p-8">
              <p className="font-mono text-[9px] text-brand uppercase tracking-[0.3em] mb-1">
                // WhatsApp
              </p>
              <h4 className="font-black text-xl uppercase tracking-wide text-ink-DEFAULT mb-1">
                Solicitar Cotización
              </h4>
              <p className="text-ink-muted text-xs mb-6">
                Completa los datos y te abrirá WhatsApp con el mensaje listo.
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-4">
                    <WhatsAppIcon />
                  </div>
                  <p className="font-black text-ink-DEFAULT uppercase tracking-wide">
                    ¡WhatsApp abierto!
                  </p>
                  <p className="text-sm text-ink-muted mt-2 max-w-xs mx-auto">
                    Se abrió WhatsApp con tu mensaje. Si no se abrió,{' '}
                    <a
                      href={`https://wa.me/${WA_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline"
                    >
                      haz clic aquí
                    </a>.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-brand font-mono text-xs underline"
                  >
                    Nueva cotización
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-ink-border rounded-lg text-sm font-sans text-ink-DEFAULT placeholder:text-ink-muted/50 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-1.5">
                      Describe tu proyecto
                    </label>
                    <textarea
                      id="mensaje"
                      rows={5}
                      required
                      placeholder="Material, dimensiones, cantidad, uso final..."
                      value={form.mensaje}
                      onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-ink-border rounded-lg text-sm font-sans text-ink-DEFAULT placeholder:text-ink-muted/50 focus:outline-none focus:border-brand transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm tracking-widest rounded-full transition-all hover:shadow-lg hover:shadow-[#25D366]/30 uppercase flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon />
                    Enviar por WhatsApp
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
