import { useState } from 'react'
import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './FAQ.css'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "How is the battery system really free?",
      answer: "We partner with energy providers and grid operators who subsidize the equipment cost in exchange for your participation in the Virtual Power Plant. During peak demand periods, a small portion of your stored energy helps stabilize the grid. You get the battery, they get grid support - everyone wins."
    },
    {
      question: "What happens during a power outage?",
      answer: "Your Sonnen battery automatically kicks in within milliseconds - so fast you won't even notice the switch. Your essential appliances, lights, AC, and refrigerator keep running while the rest of the neighborhood goes dark. Most systems provide 8-24 hours of backup depending on your usage."
    },
    {
      question: "Will I really save money on electricity?",
      answer: "Yes! Our members save an average of $120/month. You get locked-in lower rates and avoid the unpredictable delivery fee increases from Centerpoint and Oncor. Plus, we handle switching your provider and cover any early termination fees from your current plan."
    },
    {
      question: "How long does installation take?",
      answer: "The typical timeline is 2-3 weeks from signup to activation. The actual installation is usually completed in a single day. Our certified technicians handle everything - permits, installation, testing, and activation."
    },
    {
      question: "What are the requirements to qualify?",
      answer: "You must be a homeowner in Oncor, Centerpoint, or TNMP territory (Houston and Dallas areas). You need available garage wall space for the battery unit (about 4x3 feet). Most homeowners with decent credit qualify."
    },
    {
      question: "Is there a contract or commitment?",
      answer: "Yes, there's a service agreement (typically 10-15 years) tied to your energy plan. This is how we're able to provide the equipment at no cost. If you sell your home, the agreement typically transfers to the new owner - it's often seen as a selling point!"
    },
    {
      question: "What brand of battery do you install?",
      answer: "We install Sonnen batteries, a German-engineered premium home battery system known for its reliability, safety, and longevity. Sonnen batteries are designed to last 15+ years and come with comprehensive warranty coverage."
    },
    {
      question: "How much of my battery power goes to the grid?",
      answer: "During peak demand events (usually just a few hours per month), we may draw up to 20% of your stored capacity. Your home's needs always come first - we never drain your battery to a point that would leave you without backup power."
    }
  ]

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const answerVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
  }

  return (
    <section className="faq" id="faq">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="section-tag">Common Questions</span>
          <h2>Frequently Asked <span className="highlight">Questions</span></h2>
          <p>Everything you need to know about joining Texas's Virtual Power Plant</p>
        </motion.div>

        <div className="faq-grid">
          <motion.div
            className="faq-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                variants={itemVariants}
              >
                <motion.button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>{faq.question}</span>
                  <motion.span
                    className="faq-toggle"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="faq-answer"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={answerVariants}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="faq-cta"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="cta-card"
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="cta-icon"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <MessageCircle size={32} />
              </motion.div>
              <h3>Still Have Questions?</h3>
              <p>Our energy experts are ready to help. Get personalized answers about your home and situation.</p>
              <motion.a
                href="tel:+12544104104"
                className="cta-phone"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={20} />
                <span>(254) 410-4104</span>
              </motion.a>
              <span className="cta-hours">Mon-Fri: 8am-8pm | Sat: 9am-5pm</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
