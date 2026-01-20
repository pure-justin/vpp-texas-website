import { Star, Home, DollarSign, Zap, Shield } from 'lucide-react'
import './TrustBadges.css'

function TrustBadges() {
  const badges = [
    { icon: Star, value: '5.0', label: 'Google Rating' },
    { icon: Home, value: '2,500+', label: 'Texas Homes' },
    { icon: DollarSign, value: '$0', label: 'Upfront Cost' },
    { icon: Zap, value: '100%', label: 'Grid Support' },
    { icon: Shield, value: 'BBB', label: 'Accredited' }
  ]

  return (
    <section className="trust-badges">
      <div className="container">
        <div className="badges-grid">
          {badges.map((badge, index) => (
            <div className="badge-item" key={index}>
              <div className="badge-icon">
                <badge.icon size={22} />
              </div>
              <div className="badge-content">
                <span className="badge-value">{badge.value}</span>
                <span className="badge-label">{badge.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
