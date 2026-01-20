import { DollarSign, Zap, TrendingUp, Clock, Globe, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
    const element = document.getElementById('hero-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="benefits" id="benefits">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="section-tag">Why Choose VPP Texas</span>
          <h2>Everything You Need. <span className="highlight">Nothing You Don't.</span></h2>
          <p>Join thousands of Texas homeowners who've already made the switch to smarter, cheaper, more reliable energy.</p>
        </motion.div>

        <motion.div
          className="benefits-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              className="benefit-card"
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="benefit-icon"
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <benefit.icon size={28} />
              </motion.div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="benefits-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="cta-content">
            <h3>Premium Sonnen Battery Technology</h3>
            <p>
              Our state-of-the-art Sonnen battery systems are designed for the Texas climate.
              Sleek, powerful, and built to last 15+ years with industry-leading safety standards.
            </p>
            <motion.button
              onClick={scrollToContact}
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See If You Qualify
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Benefits
