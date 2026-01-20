import './App.css'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBadges from './components/TrustBadges'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import VPPExplainer from './components/VPPExplainer'
import ServiceArea from './components/ServiceArea'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
// ContactForm removed - all leads go through hero qualification
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Benefits />
        <HowItWorks />
        <VPPExplainer />
        <ServiceArea />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App
