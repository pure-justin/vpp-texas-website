import { useState } from 'react'
import { MapPin, Building2, Home, Users, Sun, Star, Phone, ArrowRight } from 'lucide-react'
import AddressAutocomplete from './AddressAutocomplete'
import './ServiceArea.css'

function ServiceArea() {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [eligibilityResult, setEligibilityResult] = useState(null)

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
  }

  const handleEligibilityCheck = (result) => {
    setEligibilityResult(result)
  }

  const areas = [
    { icon: Building2, name: 'Houston Metro', provider: 'Centerpoint' },
    { icon: MapPin, name: 'Dallas-Fort Worth', provider: 'Oncor' },
    { icon: Home, name: 'Katy / Sugar Land', provider: 'Centerpoint' },
    { icon: Users, name: 'The Woodlands', provider: 'Centerpoint' },
    { icon: Sun, name: 'Plano / Frisco', provider: 'Oncor' },
    { icon: Star, name: 'Arlington / McKinney', provider: 'Oncor' }
  ]

  return (
    <section className="service-area" id="service-area">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Service Area</span>
          <h2>Now Serving <span className="highlight">Texas</span></h2>
          <p>We're currently enrolling homeowners in major Texas metro areas</p>
        </div>

        <div className="service-grid">
          <div className="map-container">
            <div className="map-visual">
              <img src="/images/aerial-neighborhood.jpg" alt="Texas neighborhood aerial view" />
              <div className="map-overlay"></div>
            </div>
            <div className="coverage-badges">
              <div className="coverage-badge">
                <span className="badge-dot"></span>
                <span>Centerpoint</span>
              </div>
              <div className="coverage-badge">
                <span className="badge-dot"></span>
                <span>Oncor</span>
              </div>
              <div className="coverage-badge">
                <span className="badge-dot"></span>
                <span>TNMP</span>
              </div>
            </div>
          </div>

          <div className="service-info">
            <h3>Serving Major Texas Markets</h3>
            <p>
              Our Virtual Power Plant program is available to homeowners in Centerpoint,
              Oncor, and TNMP service territories. These deregulated markets qualify
              for our $0-cost battery program.
            </p>

            <div className="areas-list">
              {areas.map((area, index) => (
                <div className="area-item" key={index}>
                  <div className="area-icon">
                    <area.icon size={18} />
                  </div>
                  <span>{area.name}</span>
                </div>
              ))}
            </div>

            <div className="eligibility-checker">
              <h4>Check Your Eligibility</h4>
              <p className="checker-subtitle">
                Enter your address to instantly verify your utility provider and VPP eligibility
              </p>

              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                onEligibilityCheck={handleEligibilityCheck}
                showEligibility={true}
                placeholder="Enter your home address"
              />

              {eligibilityResult?.eligible && (
                <div className="eligible-cta">
                  <p>Ready to get started? Speak with an energy expert today.</p>
                  <a href="tel:+12544104104" className="cta-btn">
                    <Phone size={18} />
                    <span>Call (254) 410-4104</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceArea
