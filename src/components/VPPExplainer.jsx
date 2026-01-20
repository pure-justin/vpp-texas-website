import { useState } from 'react'
import { Check, Zap, Heart, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  }

  const bulletVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        type: "spring",
        stiffness: 100
      }
    })
  }

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2 + 0.3,
        type: "spring",
        stiffness: 150
      }
    })
  }

  return (
    <section className="vpp-explainer">
      <div className="container">
        <motion.div
          className="explainer-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="explainer-image"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img src="/images/power-grid.jpg" alt="Virtual Power Plant network visualization" />
            <div className="image-overlay"></div>
            <div className="stat-bubbles">
              {[
                { value: '10,000+', label: 'Connected Homes', className: 'stat-1' },
                { value: '50 MW', label: 'Grid Support', className: 'stat-2' },
                { value: '99.9%', label: 'Uptime', className: 'stat-3' }
              ].map((stat, i) => (
                <motion.div
                  className={`stat-bubble ${stat.className}`}
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={bubbleVariants}
                  whileHover={{
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="explainer-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <span className="section-tag">Understanding VPP</span>
            <h2>The Future of <span className="highlight">Home Energy</span></h2>

            <div className="tabs-container">
              <div className="tabs-nav">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={index}
                    className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      animate={activeTab === index ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <tab.icon size={20} />
                    </motion.span>
                    <span>{tab.title}</span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="tab-content"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h3>{tabs[activeTab].content.heading}</h3>
                  <p>{tabs[activeTab].content.text}</p>
                  <ul>
                    {tabs[activeTab].content.bullets.map((bullet, index) => (
                      <motion.li
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={bulletVariants}
                      >
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check size={18} className="check-icon" />
                        </motion.span>
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VPPExplainer
