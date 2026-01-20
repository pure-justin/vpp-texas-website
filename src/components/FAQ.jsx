import { useState } from 'react'
import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
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

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Common Questions</span>
          <h2>Frequently Asked <span className="highlight">Questions</span></h2>
          <p>Everything you need to know about joining Texas's Virtual Power Plant</p>
        </div>

        <div className="faq-grid">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">
                    <ChevronDown size={20} />
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <div className="cta-card">
              <div className="cta-icon">
                <MessageCircle size={32} />
              </div>
              <h3>Still Have Questions?</h3>
              <p>Our energy experts are ready to help. Get personalized answers about your home and situation.</p>
              <a href="tel:+12544104104" className="cta-phone">
                <Phone size={20} />
                <span>(254) 410-4104</span>
              </a>
              <span className="cta-hours">Mon-Fri: 8am-8pm | Sat: 9am-5pm</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
