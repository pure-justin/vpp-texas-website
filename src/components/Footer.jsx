import { Zap, Phone, Mail, Shield, Star, ShieldCheck, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">
                <Zap size={24} />
              </span>
              <span className="logo-text">VPP<span className="accent">Texas</span></span>
            </div>
            <p>Empowering Texas homeowners with free battery backup, lower rates, and a more resilient energy future.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <button onClick={() => scrollToSection('benefits')}>Benefits</button>
              <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
              <button onClick={() => scrollToSection('service-area')}>Service Area</button>
              <button onClick={() => scrollToSection('faq')}>FAQ</button>
              <button onClick={() => scrollToSection('hero-form')}>Check Eligibility</button>
            </div>

            <div className="link-group">
              <h4>Services</h4>
              <a href="#">Home Battery Backup</a>
              <a href="#">Virtual Power Plant</a>
              <a href="#">Energy Plan Switching</a>
              <a href="#">Solar Advisory</a>
              <a href="#">Generator Solutions</a>
            </div>

            <div className="link-group">
              <h4>Contact</h4>
              <a href="tel:+12544104104" className="contact-link">
                <Phone size={16} /> (254) 410-4104
              </a>
              <a href="mailto:support@vpptexas.com" className="contact-link">
                <Mail size={16} /> support@vpptexas.com
              </a>
              <address>
                <MapPin size={16} />
                <span>
                  11740 Katy Fwy Suite 1700<br />
                  Houston, TX 77079
                </span>
              </address>
            </div>
          </div>
        </div>

        <div className="footer-certifications">
          <div className="cert-item">
            <Shield size={20} className="cert-icon" />
            <span>BBB Accredited</span>
          </div>
          <div className="cert-item">
            <Star size={20} className="cert-icon" />
            <span>5-Star Rated</span>
          </div>
          <div className="cert-item">
            <ShieldCheck size={20} className="cert-icon" />
            <span>Licensed & Insured</span>
          </div>
          <div className="cert-item">
            <Zap size={20} className="cert-icon" />
            <span>Texas Proud</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} VPP Texas. All rights reserved. Tax ID: 39-3665233</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
