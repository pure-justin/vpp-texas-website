import { ClipboardCheck, Home, Wrench, Banknote, Calendar } from 'lucide-react'
import './HowItWorks.css'

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Check Your Eligibility',
      description: 'Fill out our quick form to see if your home qualifies for a free Sonnen battery system. Most Texas homeowners in Oncor, Centerpoint, or TNMP areas qualify.',
      icon: ClipboardCheck
    },
    {
      number: '02',
      title: 'Free Home Assessment',
      description: 'Our energy experts visit your home to assess your needs and design the perfect system. No pressure, no obligation.',
      icon: Home
    },
    {
      number: '03',
      title: 'Professional Installation',
      description: 'Our certified technicians install your Sonnen battery system in your garage. Clean, quick, and hassle-free. Usually completed in one day.',
      icon: Wrench
    },
    {
      number: '04',
      title: 'Start Saving',
      description: 'Enjoy backup power, lower rates, and peace of mind. We handle the energy plan switch for you, including any cancellation fees.',
      icon: Banknote
    }
  ]

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Simple Process</span>
          <h2>How It Works</h2>
          <p>Getting started with VPP Texas is easier than you think. We handle everything.</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <step.icon size={32} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="timeline-cta">
          <div className="timeline-badge">
            <Calendar size={20} />
            <span>Average Time: 2-3 Weeks from Signup to Power</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
