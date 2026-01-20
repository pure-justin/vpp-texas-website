import { DollarSign, Zap, TrendingUp, Clock, Globe, Lock, ArrowRight } from 'lucide-react'
import './Benefits.css'

function Benefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Zero Upfront Cost',
      description: 'Get a premium Sonnen home battery system installed at absolutely no cost to you. No loans, no hidden fees, no catches.'
    },
    {
      icon: Zap,
      title: 'Backup Power Protection',
      description: 'Keep your lights on, AC running, and family safe when the Texas grid fails. Never worry about outages again.'
    },
    {
      icon: TrendingUp,
      title: 'Lower Electric Bills',
      description: 'Lock in lower electricity rates and avoid the rising delivery fees from Centerpoint and Oncor.'
    },
    {
      icon: Clock,
      title: 'Quick Installation',
      description: 'Our white-glove installation process takes just 2-3 weeks from signup to powering your home.'
    },
    {
      icon: Globe,
      title: 'Help the Grid',
      description: 'Be part of the solution. Your battery helps stabilize the Texas grid and supports your community.'
    },
    {
      icon: Lock,
      title: 'Fixed Rate Plans',
      description: "Say goodbye to surprise bills. Lock in a fixed rate and know exactly what you'll pay each month."
    }
  ]

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="benefits" id="benefits">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Why Choose VPP Texas</span>
          <h2>Everything You Need. <span className="highlight">Nothing You Don't.</span></h2>
          <p>Join thousands of Texas homeowners who've already made the switch to smarter, cheaper, more reliable energy.</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">
                <benefit.icon size={28} />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="benefits-cta">
          <div className="cta-content">
            <h3>Premium Sonnen Battery Technology</h3>
            <p>
              Our state-of-the-art Sonnen battery systems are designed for the Texas climate.
              Sleek, powerful, and built to last 15+ years with industry-leading safety standards.
            </p>
            <button onClick={scrollToContact} className="cta-button">
              See If You Qualify
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
