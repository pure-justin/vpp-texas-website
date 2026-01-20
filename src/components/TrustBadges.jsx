import { Star, Home, DollarSign, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import './TrustBadges.css'

function TrustBadges() {
  const badges = [
    { icon: Star, value: '5.0', label: 'Google Rating' },
    { icon: Home, value: '2,500+', label: 'Texas Homes' },
    { icon: DollarSign, value: '$0', label: 'Upfront Cost' },
    { icon: Zap, value: '100%', label: 'Grid Support' },
    { icon: Shield, value: 'BBB', label: 'Accredited' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const badgeVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12
      }
    }
  }

  return (
    <section className="trust-badges">
      <div className="container">
        <motion.div
          className="badges-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {badges.map((badge, index) => (
            <motion.div
              className="badge-item"
              key={index}
              variants={badgeVariants}
              whileHover={{
                y: -4,
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <motion.div
                className="badge-icon"
                whileHover={{
                  rotate: 360,
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              >
                <badge.icon size={22} />
              </motion.div>
              <div className="badge-content">
                <motion.span
                  className="badge-value"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {badge.value}
                </motion.span>
                <span className="badge-label">{badge.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TrustBadges
