import { useState } from 'react'
import { submitLead } from '../services/firebase'
import { checkVPPEligibility, getUtilityFromZip } from '../services/utilityService'
import {
  DollarSign, Zap, Shield, Phone, ArrowRight, ArrowLeft,
  CheckCircle, User, Mail, MapPin, Home, Receipt, MessageSquare,
  ClipboardCheck, Calendar, Clock, Loader2
} from 'lucide-react'
import './ContactForm.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    homeType: '',
    electricBill: '',
    message: ''
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Extract zip code from address field
    if (name === 'address') {
      const zipMatch = value.match(/\b\d{5}\b/)
      if (zipMatch) {
        setFormData(prev => ({ ...prev, address: value, zipCode: zipMatch[0] }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check eligibility using utility service
      const eligibility = checkVPPEligibility({
        formattedAddress: formData.address,
        zipCode: formData.zipCode,
        state: 'TX'
      })
      setEligibilityResult(eligibility)

      // Submit lead to Firebase
      const result = await submitLead({
        ...formData,
        formType: 'contact',
        eligible: eligibility.eligible,
        provider: eligibility.utility?.name
      })

      if (result.success) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (submitted) {
    return (
      <section className="contact-form" id="contact">
        <div className="container">
          <div className="success-container">
            <div className="success-animation">
              <div className="checkmark-circle">
                <CheckCircle size={48} />
              </div>
            </div>
            <h2>
              {eligibilityResult?.eligible
                ? "You're Eligible!"
                : "Thanks for Your Interest!"}
            </h2>
            <p>
              {eligibilityResult?.eligible
                ? `Great news! Your area (${eligibilityResult.utility?.name}) qualifies for VPP Texas. One of our energy specialists will call you within 24 hours to discuss your options.`
                : "We're not yet available in your area, but we're expanding quickly! We've saved your information and will notify you as soon as we reach your neighborhood."}
            </p>

            {eligibilityResult?.utility && (
              <div className="utility-info-badge">
                <span>Utility: {eligibilityResult.utility.name}</span>
                {eligibilityResult.utility.deregulated && (
                  <span className="deregulated-badge">Deregulated Market</span>
                )}
              </div>
            )}

            <div className="next-steps">
              <h4>What Happens Next?</h4>
              <div className="steps-preview">
                <div className="step-item">
                  <span className="step-num">
                    <ClipboardCheck size={16} />
                  </span>
                  <span>We'll verify your eligibility</span>
                </div>
                <div className="step-item">
                  <span className="step-num">
                    <Calendar size={16} />
                  </span>
                  <span>Schedule your free home assessment</span>
                </div>
                <div className="step-item">
                  <span className="step-num">
                    <DollarSign size={16} />
                  </span>
                  <span>Get your custom savings estimate</span>
                </div>
              </div>
            </div>
            <a href="tel:+12544104104" className="immediate-call">
              <Phone size={18} />
              Need Immediate Assistance? Call (254) 410-4104
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="contact-form" id="contact">
      <div className="contact-bg">
        <img src="/images/family-comfort.jpg" alt="Family enjoying home comfort" />
        <div className="bg-overlay"></div>
      </div>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-tag">Get Started Today</span>
            <h2>Ready to Take Control of Your <span className="highlight">Energy Future?</span></h2>
            <p>Complete the form and we'll get back to you within 24 hours with your personalized savings estimate.</p>

            <div className="contact-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <DollarSign size={24} />
                </div>
                <div>
                  <strong>No Cost Consultation</strong>
                  <span>Free home assessment, no obligation</span>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Zap size={24} />
                </div>
                <div>
                  <strong>Quick Response</strong>
                  <span>We'll contact you within 24 hours</span>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Shield size={24} />
                </div>
                <div>
                  <strong>Privacy Protected</strong>
                  <span>Your information is secure</span>
                </div>
              </div>
            </div>

            <div className="contact-direct">
              <h4>Prefer to Talk Now?</h4>
              <a href="tel:+12544104104" className="phone-link">
                <Phone size={24} />
                (254) 410-4104
              </a>
              <span className="hours">
                <Clock size={14} />
                Mon-Fri: 8am-8pm | Sat: 9am-5pm
              </span>
            </div>
          </div>

          <div className="form-container">
            <div className="form-progress">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Contact</span>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Property</span>
              </div>
              <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Confirm</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-step">
                  <h3>Contact Information</h3>
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <Phone size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  <button type="button" className="next-btn" onClick={nextStep}>
                    Continue
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <h3>Property Details</h3>
                  <div className="form-group">
                    <label>
                      <MapPin size={16} />
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Houston, TX 77001"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <MapPin size={16} />
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="77001"
                        pattern="[0-9]{5}"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <Home size={16} />
                        Home Type
                      </label>
                      <select name="homeType" value={formData.homeType} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="single">Single Family</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="condo">Condo</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <Receipt size={16} />
                      Average Monthly Electric Bill
                    </label>
                    <select name="electricBill" value={formData.electricBill} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="under100">Under $100</option>
                      <option value="100-200">$100 - $200</option>
                      <option value="200-300">$200 - $300</option>
                      <option value="300-400">$300 - $400</option>
                      <option value="over400">Over $400</option>
                    </select>
                  </div>
                  <div className="button-group">
                    <button type="button" className="back-btn" onClick={prevStep}>
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button type="button" className="next-btn" onClick={nextStep}>
                      Continue
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <h3>Confirm & Submit</h3>
                  <div className="summary">
                    <div className="summary-item">
                      <span className="label">
                        <User size={14} />
                        Name:
                      </span>
                      <span className="value">{formData.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">
                        <Mail size={14} />
                        Email:
                      </span>
                      <span className="value">{formData.email}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">
                        <Phone size={14} />
                        Phone:
                      </span>
                      <span className="value">{formData.phone}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">
                        <MapPin size={14} />
                        Address:
                      </span>
                      <span className="value">{formData.address}, {formData.zipCode}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <MessageSquare size={16} />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any questions or special requirements?"
                      rows="3"
                    />
                  </div>
                  <div className="consent">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>I agree to receive communications from VPP Texas about my energy consultation.</span>
                    </label>
                  </div>
                  <div className="button-group">
                    <button type="button" className="back-btn" onClick={prevStep}>
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Get My Free Quote
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
