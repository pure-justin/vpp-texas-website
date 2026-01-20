import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import './Testimonials.css'

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const scrollContainerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  const testimonials = [
    {
      quote: "When the power went out during the winter storm, we were the only house on the block with lights. My kids didn't even know there was an outage. VPP Texas literally saved us.",
      author: "Sarah M.",
      location: "Katy, TX",
      rating: 5,
      savings: "$127/mo"
    },
    {
      quote: "I was skeptical about the 'no cost' part, but they delivered. Sonnen battery installed in my garage, lower electric bill, and peace of mind. Wish I'd done this years ago.",
      author: "Michael T.",
      location: "Plano, TX",
      rating: 5,
      savings: "$89/mo"
    },
    {
      quote: "The whole process took less than 3 weeks. Their team handled everything including switching my energy provider. I just signed a few forms and that was it.",
      author: "Jennifer R.",
      location: "Sugar Land, TX",
      rating: 5,
      savings: "$156/mo"
    },
    {
      quote: "Best decision we made for our home. During last summer's heat wave, our AC never stopped. While neighbors were sweating, we were comfortable.",
      author: "David L.",
      location: "The Woodlands, TX",
      rating: 5,
      savings: "$112/mo"
    }
  ]

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll to update dots
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const cardWidth = container.offsetWidth
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < testimonials.length) {
      setCurrentIndex(newIndex)
    }
  }

  // Scroll to specific card when dot is clicked
  const scrollToCard = (index) => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.offsetWidth
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
    setCurrentIndex(index)
  }

  // Desktop auto-scroll
  useEffect(() => {
    if (isMobile) return

    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [currentIndex, isMobile])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const statVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  }

  return (
    <section className="testimonials">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="section-tag">Real Stories</span>
          <h2>What Texas Homeowners <span className="highlight">Are Saying</span></h2>
        </motion.div>

        {/* Mobile: Native scroll */}
        {isMobile ? (
          <>
            <div
              className="testimonial-scroll"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {testimonials.map((testimonial, index) => (
                <div className="testimonial-card" key={index}>
                  <div className="quote-icon">
                    <Quote size={32} />
                  </div>
                  <p className="quote">{testimonial.quote}</p>
                  <div className="testimonial-footer">
                    <div className="author-info">
                      <div className="author-avatar">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <span className="author-name">{testimonial.author}</span>
                        <span className="author-location">{testimonial.location}</span>
                      </div>
                    </div>
                    <div className="testimonial-stats">
                      <div className="rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>
                            <Star size={16} fill="currentColor" />
                          </span>
                        ))}
                      </div>
                      <div className="savings">
                        Saving <span className="savings-amount">{testimonial.savings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => scrollToCard(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          /* Desktop: Animated carousel */
          <>
            <motion.div
              className="testimonials-carousel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                className="carousel-btn prev"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>

              <div className="testimonial-wrapper">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <Quote size={40} />
                  </div>
                  <p className="quote">{testimonials[currentIndex].quote}</p>
                  <div className="testimonial-footer">
                    <div className="author-info">
                      <div className="author-avatar">
                        {testimonials[currentIndex].author[0]}
                      </div>
                      <div>
                        <span className="author-name">{testimonials[currentIndex].author}</span>
                        <span className="author-location">{testimonials[currentIndex].location}</span>
                      </div>
                    </div>
                    <div className="testimonial-stats">
                      <div className="rating">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <span key={i}>
                            <Star size={18} fill="currentColor" />
                          </span>
                        ))}
                      </div>
                      <div className="savings">
                        Saving <span className="savings-amount">{testimonials[currentIndex].savings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                className="carousel-btn next"
                onClick={nextSlide}
                aria-label="Next testimonial"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            </motion.div>

            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </>
        )}

        <motion.div
          className="testimonials-summary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { value: '5.0', label: 'Google Rating' },
            { value: '500+', label: '5-Star Reviews' },
            { value: '$120', label: 'Avg Monthly Savings' }
          ].map((stat, i) => (
            <motion.div
              className="summary-stat"
              key={i}
              custom={i}
              variants={statVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
