import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import './Testimonials.css'

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Real Stories</span>
          <h2>What Texas Homeowners <span className="highlight">Are Saying</span></h2>
        </div>

        <div className="testimonials-carousel">
          <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous testimonial">
            <ChevronLeft size={24} />
          </button>

          <div className="testimonial-wrapper">
            <div className={`testimonial-card ${isAnimating ? 'animating' : ''}`}>
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
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <div className="savings">
                    Saving <span className="savings-amount">{testimonials[currentIndex].savings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextSlide} aria-label="Next testimonial">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div className="testimonials-summary">
          <div className="summary-stat">
            <span className="stat-value">5.0</span>
            <span className="stat-label">Google Rating</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">500+</span>
            <span className="stat-label">5-Star Reviews</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">$120</span>
            <span className="stat-label">Avg Monthly Savings</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
