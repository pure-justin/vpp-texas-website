import { ClipboardCheck, Home, Wrench, Banknote, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="section-tag">Simple Process</span>
          <h2>How It Works</h2>
          <p>Getting started with VPP Texas is easier than you think. We handle everything.</p>
        </motion.div>

        <motion.div
          className="steps-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              className="step-card"
              key={index}
              variants={stepVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <motion.div
                className="step-number"
                variants={numberVariants}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                {step.number}
              </motion.div>
              <motion.div
                className="step-icon"
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <step.icon size={32} />
              </motion.div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="timeline-cta"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="timeline-badge"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ display: 'flex' }}
            >
              <Calendar size={20} />
            </motion.div>
            <span>Average Time: 2-3 Weeks from Signup to Power</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
