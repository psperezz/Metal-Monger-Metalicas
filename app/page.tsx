import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ServicesSection from '@/components/ServicesSection'
import HerramientasSection from '@/components/HerramientasSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <HerramientasSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
