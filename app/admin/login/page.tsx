'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogIn, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#FF5C00" />
              <text x="20" y="26" textAnchor="middle" fill="white" fontSize="11"
                fontWeight="900" fontFamily="system-ui">M3</text>
            </svg>
            <div>
              <p className="text-white text-xs font-black tracking-[0.15em] uppercase">
                Metal·Monger
              </p>
              <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                Panel de Administración
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <p className="font-mono text-[9px] text-brand uppercase tracking-[0.3em] mb-1">
            // Acceso restringido
          </p>
          <h1 className="text-white font-black text-xl uppercase tracking-wide mb-6">
            Iniciar Sesión
          </h1>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
              <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-xs font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pablo@m3metalmonger.mx"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest rounded-full transition-all uppercase flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="font-mono text-xs">Verificando...</span>
              ) : (
                <>
                  <LogIn size={14} />
                  Acceder
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 font-mono text-[9px] text-white/20 tracking-widest uppercase">
          M3 Metal-Monger © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
