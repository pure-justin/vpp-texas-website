import { useState } from 'react'
import { MapPin, Building2, Home, Users, Sun, Star, Phone, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const areaVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08 + 0.3,
        type: "spring",
        stiffness: 100
      }
    })
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1 + 0.5,
        type: "spring",
        stiffness: 150
      }
    })
  }

  return (
    <section className="service-area" id="service-area">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="section-tag">Service Area</span>
          <h2>Now Serving <span className="highlight">Texas</span></h2>
          <p>We're currently enrolling homeowners in major Texas metro areas</p>
        </motion.div>

        <div className="service-grid">
          <motion.div
            className="map-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="map-visual">
              <img src="/images/aerial-neighborhood.jpg" alt="Texas neighborhood aerial view" />
              <div className="map-overlay"></div>
            </div>
            <motion.div
              className="coverage-badges"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {['Centerpoint', 'Oncor', 'TNMP'].map((provider, i) => (
                <motion.div
                  className="coverage-badge"
                  key={provider}
                  custom={i}
                  variants={badgeVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <motion.span
                    className="badge-dot"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                  <span>{provider}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="service-info"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <h3>Serving Major Texas Markets</h3>
            <p>
              Our Virtual Power Plant program is available to homeowners in Centerpoint,
              Oncor, and TNMP service territories. These deregulated markets qualify
              for our $0-cost battery program.
            </p>

            <motion.div
              className="areas-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {areas.map((area, index) => (
                <motion.div
                  className="area-item"
                  key={index}
                  custom={index}
                  variants={areaVariants}
                  whileHover={{
                    x: 8,
                    backgroundColor: "rgba(0, 212, 170, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    className="area-icon"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    <area.icon size={18} />
                  </motion.div>
                  <span>{area.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="eligibility-checker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
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
                <motion.div
                  className="eligible-cta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>Ready to get started? Speak with an energy expert today.</p>
                  <motion.a
                    href="tel:+12544104104"
                    className="cta-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone size={18} />
                    <span>Call (254) 410-4104</span>
                    <ArrowRight size={16} />
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ServiceArea
