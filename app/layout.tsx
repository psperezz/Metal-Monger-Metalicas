import type { Metadata } from 'next'
import { Inter, Roboto_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'M3 Metal-Monger | Construcción & Mobiliario Metálico',
  description:
    'Diseño, Fabricación y Ejecución de Proyectos de Metalurgia de Alta Precisión para Espacios Comerciales y Residenciales.',
  keywords: 'metalurgia, acero, mobiliario metálico, steel frame, construcción metálica',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${robotoMono.variable} ${barlowCondensed.variable}`}
    >
      <body className="font-sans antialiased bg-[#FAFAFA]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  )
}
