import { useState, useEffect } from 'react'
import { Zap, Phone, Menu, X } from 'lucide-react'
import './Navbar.css'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <a href="/" className="logo">
            <div className="logo-icon">
              <Zap size={24} />
            </div>
            <span className="logo-text">VPP<span className="accent">Texas</span></span>
          </a>

          <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollToSection('benefits')}>Benefits</button>
            <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button onClick={() => scrollToSection('service-area')}>Service Area</button>
            <button onClick={() => scrollToSection('faq')}>FAQ</button>
          </div>

          <div className="nav-cta">
            <a href="tel:+12544104104" className="nav-phone">
              <Phone size={18} />
              <span>(254) 410-4104</span>
            </a>
            <button onClick={() => scrollToSection('hero-form')} className="nav-btn">
              Check Eligibility
            </button>
          </div>

          <button
            className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => scrollToSection('benefits')}>Benefits</button>
          <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
          <button onClick={() => scrollToSection('service-area')}>Service Area</button>
          <button onClick={() => scrollToSection('faq')}>FAQ</button>
          <button onClick={() => scrollToSection('hero-form')} className="mobile-cta">
            Check Eligibility
          </button>
          <a href="tel:+12544104104" className="mobile-phone">
            <Phone size={18} />
            <span>(254) 410-4104</span>
          </a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
