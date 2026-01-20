import './App.css'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import VPPExplainer from './components/VPPExplainer'
import ServiceArea from './components/ServiceArea'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import StickyBottomCTA from './components/StickyBottomCTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <VPPExplainer />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <StickyBottomCTA />
    </div>
  )
}

export default App
