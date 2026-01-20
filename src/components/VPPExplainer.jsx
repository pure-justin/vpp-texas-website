import { useState } from 'react'
import { Check, Zap, Heart, Users } from 'lucide-react'
import './VPPExplainer.css'

function VPPExplainer() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: 'What is a VPP?',
      icon: Zap,
      content: {
        heading: 'Virtual Power Plant Explained',
        text: "A Virtual Power Plant connects thousands of home batteries into one intelligent network. Think of it like a Costco membership for power - by joining together, we all get better rates and more reliable energy.",
        bullets: [
          'Your battery stores cheap energy when prices are low',
          'During peak demand, we share a small amount back to the grid',
          'You get paid for helping stabilize the Texas power grid',
          'Your home always has backup power when you need it'
        ]
      }
    },
    {
      title: 'Your Benefits',
      icon: Heart,
      content: {
        heading: "What's In It For You?",
        text: "VPP membership isn't just about saving money (though you'll do plenty of that). It's about taking control of your energy future.",
        bullets: [
          'Locked-in lower electricity rates',
          'Protection from grid failures and outages',
          'Zero upfront costs for Sonnen battery installation',
          'Contribution to a more sustainable Texas'
        ]
      }
    },
    {
      title: 'Grid Impact',
      icon: Users,
      content: {
        heading: 'Powering Texas Together',
        text: "The Texas grid is under more strain than ever. By joining our VPP, you're part of the solution that keeps the lights on for everyone.",
        bullets: [
          'Reduce strain during extreme weather events',
          'Support renewable energy integration',
          'Decrease reliance on polluting peaker plants',
          'Build a more resilient energy infrastructure'
        ]
      }
    }
  ]

  return (
    <section className="vpp-explainer">
      <div className="container">
        <div className="explainer-grid">
          <div className="explainer-image">
            <img src="/images/power-grid.jpg" alt="Virtual Power Plant network visualization" />
            <div className="image-overlay"></div>
            <div className="stat-bubbles">
              <div className="stat-bubble stat-1">
                <span className="stat-value">10,000+</span>
                <span className="stat-label">Connected Homes</span>
              </div>
              <div className="stat-bubble stat-2">
                <span className="stat-value">50 MW</span>
                <span className="stat-label">Grid Support</span>
              </div>
              <div className="stat-bubble stat-3">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>

          <div className="explainer-content">
            <span className="section-tag">Understanding VPP</span>
            <h2>The Future of <span className="highlight">Home Energy</span></h2>

            <div className="tabs-container">
              <div className="tabs-nav">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    <tab.icon size={20} />
                    <span>{tab.title}</span>
                  </button>
                ))}
              </div>

              <div className="tab-content">
                <h3>{tabs[activeTab].content.heading}</h3>
                <p>{tabs[activeTab].content.text}</p>
                <ul>
                  {tabs[activeTab].content.bullets.map((bullet, index) => (
                    <li key={index}>
                      <Check size={18} className="check-icon" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VPPExplainer
