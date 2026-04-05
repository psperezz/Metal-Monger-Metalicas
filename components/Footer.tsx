export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white">
      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-white/10 py-3">
        <div className="flex gap-12 animate-[marquee_18s_linear_infinite] whitespace-nowrap w-max">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-mono text-[9px] tracking-[0.4em] text-white/25 uppercase">
              Minimalismo Industrial
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#FF5C00" />
                <text x="20" y="26" textAnchor="middle" fill="white" fontSize="11"
                  fontWeight="900" fontFamily="system-ui">M3</text>
              </svg>
              <div>
                <p className="text-xs font-black tracking-[0.15em] uppercase">Metal·Monger</p>
                <p className="text-[9px] font-mono text-white/40 tracking-widest uppercase">Metálicas</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs font-mono">
              Construcción y Mobiliario Metálico de alta precisión. Más de 12 años de experiencia.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase mb-4">
              Navegación
            </p>
            <ul className="space-y-2">
              {['Inicio', 'Servicios', 'Proyectos', 'Nosotros'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`}
                    className="text-xs text-white/50 hover:text-white font-mono tracking-widest uppercase transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase mb-4">
              Contacto
            </p>
            <div className="space-y-2">
              {[
                'psebastianp2000@gmail.com',
                '+593 979 498 966',
                '+593 963 249 391',
                'Quito, Ecuador',
              ].map((c) => (
                <p key={c} className="text-xs text-white/50 font-mono tracking-wide">{c}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">
            Footer #333333
          </p>
          <p className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">
            © {new Date().getFullYear()} M3 Metal-Monger Metálicas
          </p>
          <a href="/admin" className="font-mono text-[9px] text-white/15 hover:text-white/40 tracking-[0.3em] uppercase transition-colors">
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
