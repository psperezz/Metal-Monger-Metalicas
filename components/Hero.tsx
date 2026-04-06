'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ─── Particle system ─── */
interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  type: 'dot' | 'hex' | 'triangle'
  color: string
  alpha: number
  rotation: number
  rotSpeed: number
}

const ORANGE = '#FF5C00'
const DARK   = '#1A1A1A'
const PALETTE = [ORANGE, ORANGE, ORANGE, DARK, DARK]

function mkParticle(w: number, h: number): Particle {
  const types: Particle['type'][] = ['dot', 'dot', 'hex', 'hex', 'triangle']
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    size: Math.random() * 9 + 4,
    type: types[Math.floor(Math.random() * types.length)],
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    alpha: Math.random() * 0.55 + 0.15,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
  }
}

function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot
    i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
             : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
  }
  ctx.closePath(); ctx.stroke()
}

function drawTri(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.beginPath()
  for (let i = 0; i < 3; i++) {
    const a = (Math.PI * 2 / 3) * i + rot
    i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
             : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
  }
  ctx.closePath(); ctx.stroke()
}

/* ─── Component ─── */
export default function Hero() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const ptclsRef   = useRef<Particle[]>([])
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const rafRef     = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const init = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ptclsRef.current = Array.from({ length: 90 }, () =>
        mkParticle(canvas.width, canvas.height))
    }

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    init()
    window.addEventListener('resize', init)
    window.addEventListener('mousemove', onMouse)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of ptclsRef.current) {
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 110 && d > 0) {
          const f = (110 - d) / 110
          p.vx += (dx / d) * f * 0.28
          p.vy += (dy / d) * f * 0.28
        }
        p.vx *= 0.985; p.vy *= 0.985
        p.x  += p.vx;  p.y  += p.vy
        p.rotation += p.rotSpeed
        if (p.x < -20) p.x = canvas.width  + 20
        if (p.x > canvas.width  + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        ctx.globalAlpha   = p.alpha
        ctx.strokeStyle   = p.color
        ctx.fillStyle     = p.color
        ctx.lineWidth     = 1.5

        if (p.type === 'dot') {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill()
        } else if (p.type === 'hex') {
          drawHex(ctx, p.x, p.y, p.size, p.rotation)
        } else {
          drawTri(ctx, p.x, p.y, p.size, p.rotation)
        }
      }
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', onMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-screen bg-white overflow-hidden flex flex-col"
    >
      {/* Particle canvas — full section */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Grid overlay (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          zIndex: 1,
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top spacer for navbar */}
        <div className="h-16" />

        {/* Logo cluster — centered */}
        <div className="flex justify-center mt-2 md:mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <img
              src="/logo-m3.png"
              alt="M3 Metal·Monger Metálicas"
              className="h-[44rem] sm:h-[52rem] md:h-[60rem] lg:h-[72rem] w-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Hero headline — left aligned */}
        <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-16 pb-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <h1 className="font-condensed font-black text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] tracking-tight text-ink-DEFAULT uppercase text-balance">
              Soluciones
              <br />
              Integrales
              <br />
              <span className="text-brand">en Metal</span>
              <br />
              y Arquitectura
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-base md:text-lg text-ink-soft max-w-xl leading-relaxed"
            >
              Diseño, Fabricación y Ejecución de Proyectos de Metalurgia de
              Alta Precisión para Espacios Comerciales y Residenciales.
              Contáctenos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={() => document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3 bg-brand hover:bg-brand-hover text-white font-black text-sm tracking-widest rounded-full transition-all hover:shadow-lg hover:shadow-brand/30 uppercase"
              >
                Ver Servicios
              </button>
              <button
                onClick={() => document.querySelector('#nosotros')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3 border-2 border-dashed border-brand text-brand hover:bg-brand-muted font-black text-sm tracking-widest rounded-full transition-all uppercase"
              >
                Solicitar Cotización
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] text-ink-muted uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-0.5 h-6 bg-brand rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-brand-light to-transparent z-10" />
    </section>
  )
}
