import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { submitLead } from '../services/firebase'
import { checkVPPEligibility, parseGoogleAddress } from '../services/utilityService'
import useGoogleMaps from '../hooks/useGoogleMaps'
import { Zap, DollarSign, Calendar, Lock, CheckCircle, Phone, ArrowRight, Loader2, Home, Clock, Battery, Shield, Star, Users, Sparkles } from 'lucide-react'
import './Hero.css'

// Sound effects using Web Audio API
const useSound = () => {
  const audioContextRef = useRef(null)

  const getContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playTap = () => {
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 600
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {}
  }

  const playSuccess = () => {
    try {
      const ctx = getContext()
      const notes = [523, 659, 784] // C5, E5, G5 chord
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3)
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.3)
      })
    } catch (e) {}
  }

  const playWhoosh = () => {
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
      filter.type = 'lowpass'
      filter.frequency.value = 1000
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) {}
  }

  return { playTap, playSuccess, playWhoosh }
}

// Haptic feedback
const haptic = (style = 'light') => {
  if ('vibrate' in navigator) {
    navigator.vibrate(style === 'heavy' ? 20 : 10)
  }
}

function Hero() {
  const { isLoaded: mapsLoaded } = useGoogleMaps()
  const { playTap, playSuccess, playWhoosh } = useSound()
  const [journeyPath, setJourneyPath] = useState(null) // null = choosing, 'savings' | 'protection' | 'freedom'
  const [step, setStep] = useState(1) // 1 = qualification, 2 = contact, 3 = schedule, 4 = success
  const [questionStep, setQuestionStep] = useState(1) // 1 = address, 2 = homeowner, 3 = solar, 4 = credit
  const [contactStep, setContactStep] = useState(1) // 1 = name, 2 = phone, 3 = email
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    zipCode: '',
    county: '',
    isHomeowner: null,
    hasSolar: null,
    creditComfort: null,
    appointmentDay: null,
    appointmentTime: null,
    journeyPath: null
  })

  // Journey path messaging
  const journeyContent = {
    savings: {
      badge: 'SAVINGS PATH',
      headline: 'Stop Overpaying for Electricity',
      subtext: 'Texas homeowners are saving $200+/month',
      formTitle: 'Calculate Your Savings',
      formSubtitle: 'See how much you could save with a free battery system'
    },
    protection: {
      badge: 'PROTECTION PATH',
      headline: 'Never Lose Power Again',
      subtext: 'Blackouts don\'t have to leave you in the dark',
      formTitle: 'Get Protected',
      formSubtitle: 'Check if your home qualifies for free backup power'
    },
    freedom: {
      badge: 'FREEDOM PATH',
      headline: 'Own Your Energy Future',
      subtext: 'Break free from the grid\'s control',
      formTitle: 'Claim Your Independence',
      formSubtitle: 'See if you qualify for a free home battery'
    }
  }

  const selectJourney = (path) => {
    playWhoosh()
    haptic('heavy')
    setJourneyPath(path)
    setFormData(prev => ({ ...prev, journeyPath: path }))
  }
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [detectedAddress, setDetectedAddress] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [addressSelected, setAddressSelected] = useState(false) // Track if address was selected from autocomplete
  const [skipGeolocation, setSkipGeolocation] = useState(false) // Skip geolocation after user interaction
  const addressInputRef = useRef(null)
  const autocompleteRef = useRef(null)

  // Listen for showEligibilityForm event from StickyBottomCTA
  useEffect(() => {
    const handleShowForm = () => {
      if (!journeyPath) {
        playWhoosh()
        haptic('heavy')
        setJourneyPath('check')
      }
    }

    window.addEventListener('showEligibilityForm', handleShowForm)
    return () => window.removeEventListener('showEligibilityForm', handleShowForm)
  }, [journeyPath, playWhoosh])

  // Detect user's location on mount - only show prompt if we get a valid residential address
  useEffect(() => {
    if (!mapsLoaded || detectedAddress || skipGeolocation) return

    // Only try geolocation if available
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const geocoder = new window.google.maps.Geocoder()

            const response = await geocoder.geocode({
              location: { lat: latitude, lng: longitude }
            })

            if (response.results && response.results[0]) {
              const place = response.results[0]

              // Check if this looks like a residential address (has street number)
              const hasStreetNumber = place.address_components?.some(
                c => c.types.includes('street_number')
              )

              // Only proceed if it looks like a real residential address
              if (!hasStreetNumber) {
                setIsDetectingLocation(false)
                return
              }

              const addressData = parseGoogleAddress({
                address_components: place.address_components,
                formatted_address: place.formatted_address
              })

              // Only show if it's a valid Texas address with zip
              if (addressData.state === 'TX' && addressData.zipCode) {
                setDetectedAddress({
                  formatted: place.formatted_address,
                  zipCode: addressData.zipCode,
                  county: addressData.county
                })
              }
            }
          } catch (err) {
            // Any error - just show manual input
            console.warn('Geocoding failed:', err)
          } finally {
            setIsDetectingLocation(false)
          }
        },
        () => {
          // Permission denied or error - show manual input
          setIsDetectingLocation(false)
        },
        { timeout: 3000, maximumAge: 300000 } // Shorter timeout
      )
    }
  }, [mapsLoaded, detectedAddress, skipGeolocation])

  // Use detected address and check eligibility immediately
  const useDetectedAddress = () => {
    if (!detectedAddress) return

    setFormData(prev => ({
      ...prev,
      address: detectedAddress.formatted,
      zipCode: detectedAddress.zipCode,
      county: detectedAddress.county || ''
    }))
    setAddressSelected(true) // Detected address is validated

    // Check eligibility immediately
    setIsChecking(true)
    try {
      const eligibility = checkVPPEligibility({
        formattedAddress: detectedAddress.formatted,
        zipCode: detectedAddress.zipCode,
        county: detectedAddress.county,
        state: 'TX'
      })
      setEligibilityResult(eligibility)

      if (eligibility.eligible) {
        setQuestionStep(2)
      } else {
        setQuestionStep('not-eligible')
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
    } finally {
      setIsChecking(false)
      setDetectedAddress(null)
    }
  }

  // Handle place selection from Google autocomplete
  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) return

    const place = autocompleteRef.current.getPlace()
    if (!place.geometry) {
      setAddressError('Please select an address from the suggestions')
      setAddressSelected(false)
      return
    }

    const addressData = parseGoogleAddress(place)
    setFormData(prev => ({
      ...prev,
      address: addressData.formattedAddress,
      zipCode: addressData.zipCode || '',
      county: addressData.county || ''
    }))
    setAddressError(null)
    setAddressSelected(true) // Mark that user properly selected from dropdown
  }, [])

  // Handle Enter key - select first autocomplete suggestion and check eligibility
  const handleAddressKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const inputValue = e.target.value
    if (!inputValue || !window.google?.maps?.places) return

    // If already selected a valid address, proceed to check
    if (addressSelected && formData.zipCode) {
      // Check eligibility inline
      const eligibility = checkVPPEligibility({
        formattedAddress: formData.address,
        zipCode: formData.zipCode,
        county: formData.county,
        state: 'TX'
      })
      setEligibilityResult(eligibility)
      if (eligibility.eligible) {
        setQuestionStep(2)
      } else {
        setQuestionStep('not-eligible')
      }
      return
    }

    setIsChecking(true)

    // Get predictions and select the first one
    const service = new window.google.maps.places.AutocompleteService()
    const texasBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(25.84, -106.65),
      new window.google.maps.LatLng(36.50, -93.51)
    )

    service.getPlacePredictions(
      {
        input: inputValue,
        bounds: texasBounds,
        componentRestrictions: { country: 'us' },
        types: ['address']
      },
      (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions?.length) {
          setAddressError('No matching addresses found. Try a different address.')
          setIsChecking(false)
          return
        }

        // Get details for the first prediction
        const placesService = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )

        placesService.getDetails(
          {
            placeId: predictions[0].place_id,
            fields: ['address_components', 'formatted_address', 'geometry']
          },
          (place, detailStatus) => {
            if (detailStatus !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
              setAddressError('Could not verify address. Please select from suggestions.')
              setIsChecking(false)
              return
            }

            const addressData = parseGoogleAddress(place)
            const zipCode = addressData.zipCode || ''

            // Update form data
            setFormData(prev => ({
              ...prev,
              address: addressData.formattedAddress,
              zipCode,
              county: addressData.county || ''
            }))
            setAddressError(null)
            setAddressSelected(true)

            // Immediately check eligibility
            if (zipCode) {
              const eligibility = checkVPPEligibility({
                formattedAddress: addressData.formattedAddress,
                zipCode,
                county: addressData.county,
                state: 'TX'
              })
              setEligibilityResult(eligibility)
              if (eligibility.eligible) {
                setQuestionStep(2)
              } else {
                setQuestionStep('not-eligible')
              }
            }
            setIsChecking(false)
          }
        )
      }
    )
  }, [addressSelected, formData.zipCode, formData.address, formData.county])

  // Initialize Google Places Autocomplete
  // Re-runs when input becomes visible (questionStep 1 and no detectedAddress)
  useEffect(() => {
    // Only initialize when the input is actually visible (journeyPath set on mobile, or always on desktop)
    if (!mapsLoaded || detectedAddress || questionStep !== 1) return

    // On mobile, wait for journeyPath to be set before initializing
    const isMobile = window.innerWidth <= 768
    if (isMobile && !journeyPath) return

    // Small delay to ensure DOM is ready after state change
    const timer = setTimeout(() => {
      if (!addressInputRef.current) return

      try {
        // Clean up any existing autocomplete first
        if (autocompleteRef.current && window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        }

        // Texas bounds: SW corner (25.84, -106.65) to NE corner (36.50, -93.51)
        const texasBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(25.84, -106.65), // Southwest
          new window.google.maps.LatLng(36.50, -93.51)   // Northeast
        )

        const options = {
          componentRestrictions: { country: 'us' },
          bounds: texasBounds,
          strictBounds: true, // Only show results within Texas
          fields: ['address_components', 'formatted_address', 'geometry'],
          types: ['address']
        }

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          options
        )

        autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
      } catch (err) {
        console.warn('Failed to initialize autocomplete:', err)
      }
    }, 100) // Slightly longer delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [mapsLoaded, handlePlaceSelect, detectedAddress, questionStep, journeyPath])

  // Step 1: Check eligibility with just address
  const handleCheckEligibility = async (e) => {
    e.preventDefault()

    let zipCode = formData.zipCode
    if (!zipCode && formData.address) {
      const zipMatch = formData.address.match(/\b\d{5}\b/)
      if (zipMatch) {
        zipCode = zipMatch[0]
      }
    }

    if (!zipCode) {
      setAddressError('Please enter a valid address with a zip code')
      return
    }

    setIsChecking(true)
    setAddressError(null)

    try {
      const eligibility = checkVPPEligibility({
        formattedAddress: formData.address,
        zipCode,
        county: formData.county,
        state: 'TX'
      })
      setEligibilityResult(eligibility)
      setFormData(prev => ({ ...prev, zipCode }))
      setStep(2) // Move to contact info step
    } catch (error) {
      console.error('Error checking eligibility:', error)
      setAddressError('Unable to check eligibility. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  // Step 2: Save contact info and go to scheduling
  const handleSubmitContact = (e) => {
    e.preventDefault()
    setStep(3) // Go to scheduling
  }

  // Step 3: Submit with appointment
  const handleSubmitAppointment = async () => {
    setIsSubmitting(true)

    try {
      const result = await submitLead({
        ...formData,
        formType: 'hero',
        eligible: eligibilityResult?.eligible,
        provider: eligibilityResult?.utility?.name
      })

      if (result.success) {
        playSuccess()
        haptic('heavy')
        setStep(4) // Success
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate next available days
  const availableDays = useMemo(() => {
    const days = []
    const today = new Date()

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip Sundays (optional - if they don't work Sundays)
      if (date.getDay() === 0) continue

      days.push({
        date: date,
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        value: date.toISOString().split('T')[0]
      })

      if (days.length >= 5) break
    }

    return days
  }, [])

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) {
      return numbers.length ? `(${numbers}` : ''
    }
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    }
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  // Capitalize first letter of each word
  const formatName = (value) => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'address') {
      const zipMatch = value.match(/\b\d{5}\b/)
      if (zipMatch) {
        setFormData(prev => ({ ...prev, address: value, zipCode: zipMatch[0] }))
      } else {
        setFormData(prev => ({ ...prev, address: value, zipCode: '' }))
      }
      setAddressError(null)
      setAddressSelected(false) // Reset when user types manually - must select from dropdown
    } else if (name === 'phone') {
      const formatted = formatPhoneNumber(value)
      setFormData({ ...formData, phone: formatted })
      // Auto-advance if phone is complete (likely autofill)
      if (formatted.replace(/\D/g, '').length >= 10 && step === 2 && contactStep === 2) {
        setTimeout(() => setContactStep(3), 300)
      }
    } else if (name === 'name') {
      const formatted = formatName(value)
      setFormData({ ...formData, name: formatted })
      // Auto-advance if name looks complete (likely autofill - has space or 3+ chars)
      if (formatted.trim().length >= 3 && step === 2 && contactStep === 1) {
        setTimeout(() => setContactStep(2), 300)
      }
    } else if (name === 'email') {
      setFormData({ ...formData, email: value })
      // Auto-advance if email looks valid (likely autofill)
      if (value.includes('@') && value.includes('.') && step === 2 && contactStep === 3) {
        setTimeout(() => setStep(3), 300)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle advancing to next question
  const handleNextQuestion = (field, value) => {
    playTap()
    haptic()
    setFormData(prev => ({ ...prev, [field]: value }))
    if (questionStep < 4) {
      setQuestionStep(questionStep + 1)
    }
  }

  // Reset to address step (within qualification wizard)
  const resetToAddressStep = () => {
    setFormData(prev => ({
      ...prev,
      address: '',
      zipCode: '',
      county: '',
      isHomeowner: null,
      hasSolar: null,
      creditComfort: null
    }))
    setAddressSelected(false)
    setAddressError(null)
    setDetectedAddress(null)
    setSkipGeolocation(true) // Don't re-detect after going back
    setQuestionStep(1)

    // Focus the input after state updates
    setTimeout(() => {
      addressInputRef.current?.focus()
    }, 100)
  }

  // Full reset - back to very beginning
  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      zipCode: '',
      county: '',
      isHomeowner: null,
      hasSolar: null,
      creditComfort: null,
      appointmentDay: null,
      appointmentTime: null
    })
    setAddressSelected(false)
    setAddressError(null)
    setDetectedAddress(null)
    setSkipGeolocation(true) // Don't re-detect after going back
    setEligibilityResult(null)
    setQuestionStep(1)
    setContactStep(1)
    setStep(1)

    // Focus the input after state updates
    setTimeout(() => {
      addressInputRef.current?.focus()
    }, 100)
  }

  // Check address eligibility before proceeding
  const handleAddressCheck = () => {
    // Require user to select from Google autocomplete
    if (!addressSelected) {
      setAddressError('Please select your address from the dropdown suggestions')
      return
    }

    let zipCode = formData.zipCode
    if (!zipCode && formData.address) {
      const zipMatch = formData.address.match(/\b\d{5}\b/)
      if (zipMatch) {
        zipCode = zipMatch[0]
      }
    }

    if (!zipCode) {
      setAddressError('Please select a valid address from the suggestions')
      return
    }

    setIsChecking(true)
    setAddressError(null)

    try {
      const eligibility = checkVPPEligibility({
        formattedAddress: formData.address,
        zipCode,
        county: formData.county,
        state: 'TX'
      })
      setEligibilityResult(eligibility)
      setFormData(prev => ({ ...prev, zipCode }))

      if (eligibility.eligible) {
        setQuestionStep(2) // Continue to homeowner question
      } else {
        setQuestionStep('not-eligible') // Show rejection
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
      setAddressError('Unable to check eligibility. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  // Step 1: Qualification questions (wizard style)
  const renderAddressStep = () => (
    <div className="hero-form">
      {/* Progress bar - hide on not-eligible */}
      {questionStep !== 'not-eligible' && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(questionStep / 4) * 100}%` }}></div>
          </div>
          <div className="progress-text">Step {questionStep} of 4</div>
        </>
      )}

      {/* Question 1: Address */}
      {questionStep === 1 && (
        <div className="question-slide">
          <div className="form-header">
            <h3>Check Your Eligibility</h3>
            <p>Enter your address to see if you qualify</p>
          </div>

          {/* Detected location - subtle inline suggestion */}
          {detectedAddress && (
            <div className="detected-address-inline">
              <button type="button" className="address-suggestion" onClick={useDetectedAddress}>
                <span className="suggestion-address">{detectedAddress.formatted}</span>
                <span className="suggestion-cta">Check eligibility →</span>
              </button>
              <button type="button" className="different-address" onClick={() => {
                setDetectedAddress(null)
                setSkipGeolocation(true)
                setTimeout(() => addressInputRef.current?.focus(), 100)
              }}>
                Different address
              </button>
            </div>
          )}

          {/* Only show input if no detected address or user clicked No */}
          {!detectedAddress && (
            <>
              <div className="form-group">
                <input
                  ref={addressInputRef}
                  type="text"
                  name="address"
                  placeholder="Enter your Texas address..."
                  value={formData.address}
                  onChange={handleChange}
                  onKeyDown={handleAddressKeyDown}
                  className={addressError ? 'has-error' : ''}
                  autoFocus
                />
                {addressError && (
                  <span className="field-error">{addressError}</span>
                )}
              </div>

              <button
                type="button"
                className="submit-btn"
                disabled={!formData.address || isChecking}
                onClick={handleAddressCheck}
              >
                {isChecking ? (
                  <span className="btn-loading">
                    <Loader2 size={20} className="spin" />
                    Checking...
                  </span>
                ) : (
                  <>
                    Check Address
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      {/* Not Eligible - show after address or homeowner check fails */}
      {questionStep === 'not-eligible' && (
        <div className="question-slide not-eligible-slide">
          <div className="not-eligible-icon">
            <Home size={32} />
          </div>

          <div className="form-header">
            <h3>We Wish We Could Help</h3>
            <p>
              {eligibilityResult?.reason === 'not_homeowner'
                ? "This program is only available to homeowners."
                : eligibilityResult?.reason === 'credit_unlikely'
                ? "This program has credit requirements."
                : "Your area isn't currently in a qualifying energy community zone."}
            </p>
          </div>

          <div className="not-eligible-info">
            <p>
              {eligibilityResult?.reason === 'not_homeowner'
                ? "The free battery program requires home ownership for installation. If you're planning to buy a home in Texas, we'd love to help you then!"
                : eligibilityResult?.reason === 'credit_unlikely'
                ? "The program requires a 650+ credit score to qualify. If your credit improves, we'd love to help you then!"
                : "The federal tax credit that funds this program is only available in specific zip codes. We're working to expand coverage."}
            </p>
          </div>

          <div className="not-eligible-form">
            <p className="notify-label">
              {eligibilityResult?.reason === 'not_homeowner'
                ? "Planning to buy? Leave your email and we'll reach out."
                : eligibilityResult?.reason === 'credit_unlikely'
                ? "Working on your credit? We'll check back in a few months."
                : "Want us to let you know if your area becomes eligible?"}
            </p>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={async () => {
                if (formData.email) {
                  await submitLead({
                    ...formData,
                    formType: 'hero-waitlist',
                    eligible: false
                  })
                  setStep(4)
                }
              }}
              disabled={!formData.email}
            >
              Keep Me Updated
            </button>
          </div>

          <button type="button" className="back-btn" onClick={resetToAddressStep}>
            ← Check a different address
          </button>
        </div>
      )}

      {/* Question 2: Homeowner */}
      {questionStep === 2 && (
        <div className="question-slide">
          <div className="form-header">
            <h3>Do you own this home?</h3>
          </div>

          <div className="toggle-options-large">
            <button
              type="button"
              className={`toggle-btn-large ${formData.isHomeowner === true ? 'active' : ''}`}
              onClick={() => handleNextQuestion('isHomeowner', true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn-large ${formData.isHomeowner === false ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({ ...prev, isHomeowner: false }))
                setEligibilityResult(prev => ({ ...prev, eligible: false, reason: 'not_homeowner' }))
                setQuestionStep('not-eligible')
              }}
            >
              No
            </button>
          </div>

          <button type="button" className="back-btn" onClick={resetToAddressStep}>
            ← Back
          </button>
        </div>
      )}

      {/* Question 3: Solar */}
      {questionStep === 3 && (
        <div className="question-slide">
          <div className="form-header">
            <h3>Do you have solar panels?</h3>
          </div>

          <div className="toggle-options-large">
            <button
              type="button"
              className={`toggle-btn-large ${formData.hasSolar === true ? 'active' : ''}`}
              onClick={() => handleNextQuestion('hasSolar', true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn-large ${formData.hasSolar === false ? 'active' : ''}`}
              onClick={() => handleNextQuestion('hasSolar', false)}
            >
              No
            </button>
          </div>

          <button type="button" className="back-btn" onClick={() => setQuestionStep(2)}>
            ← Back
          </button>
        </div>
      )}

      {/* Question 4: Credit */}
      {questionStep === 4 && (
        <form className="question-slide" onSubmit={handleCheckEligibility}>
          <div className="form-header">
            <h3>Credit score 650+?</h3>
            <p className="credit-disclaimer">No credit check right now</p>
          </div>

          {/* Initial Yes/Not sure options */}
          {formData.creditComfort !== 'unsure' && (
            <div className="toggle-options-large">
              <button
                type="button"
                className="toggle-btn-large"
                onClick={() => {
                  setFormData(prev => ({ ...prev, creditComfort: true }))
                  // Proceed directly to next step
                  const eligibility = checkVPPEligibility({
                    formattedAddress: formData.address,
                    zipCode: formData.zipCode,
                    county: formData.county,
                    state: 'TX'
                  })
                  setEligibilityResult(eligibility)
                  setStep(2)
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="toggle-btn-large"
                onClick={() => setFormData(prev => ({ ...prev, creditComfort: 'unsure' }))}
              >
                Not sure
              </button>
            </div>
          )}

          {/* Follow-up for unsure - replaces initial options */}
          {formData.creditComfort === 'unsure' && (
            <div className="question-slide">
              <p className="followup-question">Would you say it's close?</p>
              <div className="toggle-options-large">
                <button
                  type="button"
                  className="toggle-btn-large"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, creditComfort: 'close' }))
                    // Proceed directly to next step
                    const eligibility = checkVPPEligibility({
                      formattedAddress: formData.address,
                      zipCode: formData.zipCode,
                      county: formData.county,
                      state: 'TX'
                    })
                    setEligibilityResult(eligibility)
                    setStep(2)
                  }}
                >
                  Probably
                </button>
                <button
                  type="button"
                  className="toggle-btn-large"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, creditComfort: 'unlikely' }))
                    setEligibilityResult(prev => ({ ...prev, eligible: false, reason: 'credit_unlikely' }))
                    setQuestionStep('not-eligible')
                  }}
                >
                  Probably not
                </button>
              </div>
              <button type="button" className="back-btn" onClick={() => setFormData(prev => ({ ...prev, creditComfort: null }))}>
                ← Back
              </button>
            </div>
          )}

          {formData.creditComfort !== 'unsure' && (
            <button type="button" className="back-btn" onClick={() => setQuestionStep(3)}>
              ← Back
            </button>
          )}
        </form>
      )}

      <div className="form-note">
        <Lock size={14} />
        <span>Your information is secure and never shared</span>
      </div>
    </div>
  )

  // Step 2: Contact info (multi-step with soft sells)
  const renderContactStep = () => (
    <div className="hero-form">
      {/* Progress indicator */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(contactStep / 3) * 100}%` }}></div>
      </div>
      <div className="progress-text">Step {contactStep} of 3</div>

      {/* Step 1: Name */}
      {contactStep === 1 && (
        <div className="question-slide">
          <div className="form-header">
            <div className="eligible-badge">
              <CheckCircle size={18} />
              <span>You Qualify!</span>
            </div>
            <h3>Who should we reserve this for?</h3>
            <p className="soft-sell">Your $60,000 system is waiting</p>
          </div>

          <div className="urgency-banner">
            <span className="urgency-dot"></span>
            <span>Federal funding is limited — claim your spot</span>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            disabled={!formData.name.trim()}
            onClick={() => setContactStep(2)}
          >
            Continue
            <ArrowRight size={20} />
          </button>

          <button type="button" className="back-btn" onClick={resetForm}>
            ← Start over
          </button>
        </div>
      )}

      {/* Step 2: Phone */}
      {contactStep === 2 && (
        <div className="question-slide">
          <div className="form-header">
            <h3>Great, {formData.name.split(' ')[0]}!</h3>
            <p>Where can we reach you?</p>
            <p className="soft-sell">We'll text you appointment reminders</p>
          </div>

          <div className="urgency-banner">
            <span className="urgency-dot"></span>
            <span>12 homeowners in Texas signed up today</span>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              autoFocus
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            disabled={formData.phone.replace(/\D/g, '').length < 10}
            onClick={() => setContactStep(3)}
          >
            Continue
            <ArrowRight size={20} />
          </button>

          <button type="button" className="back-btn" onClick={() => setContactStep(1)}>
            ← Back
          </button>
        </div>
      )}

      {/* Step 3: Email */}
      {contactStep === 3 && (
        <div className="question-slide">
          <div className="form-header">
            <h3>Almost done!</h3>
            <p>Where should we send your confirmation?</p>
            <p className="soft-sell">We'll email details about your system</p>
          </div>

          <div className="urgency-banner">
            <span className="urgency-dot"></span>
            <span>Spots are filling fast in {formData.county || 'your area'}</span>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            disabled={!formData.email.includes('@')}
            onClick={() => setStep(3)}
          >
            Continue
            <ArrowRight size={20} />
          </button>

          <button type="button" className="back-btn" onClick={() => setContactStep(2)}>
            ← Back
          </button>
        </div>
      )}

      <div className="form-note">
        <Lock size={14} />
        <span>Your information is secure and never shared</span>
      </div>
    </div>
  )

  // Step 3: Schedule appointment
  const renderScheduleStep = () => (
    <div className="hero-form schedule-form">
      <div className="form-header">
        <h3>{formData.name.split(' ')[0]}, here's what you're getting</h3>
      </div>

      {/* Value Summary - Show them what's reserved */}
      <div className="value-summary">
        <div className="value-item">
          <div className="value-icon"><Battery size={18} /></div>
          <div className="value-text">
            <span className="value-label">Sonnen Battery System</span>
            <span className="value-detail">$60,000 value — fully covered</span>
          </div>
        </div>
        <div className="value-item">
          <div className="value-icon"><Zap size={18} /></div>
          <div className="value-text">
            <span className="value-label">Whole-Home Backup</span>
            <span className="value-detail">Power through any outage</span>
          </div>
        </div>
        <div className="value-item">
          <div className="value-icon"><DollarSign size={18} /></div>
          <div className="value-text">
            <span className="value-label">Grid Revenue Credits</span>
            <span className="value-detail">Earn money from your battery</span>
          </div>
        </div>
        <div className="value-item">
          <div className="value-icon"><Shield size={18} /></div>
          <div className="value-text">
            <span className="value-label">10-Year Warranty</span>
            <span className="value-detail">Complete peace of mind</span>
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div className="schedule-social-proof">
        <div className="social-proof-stars">
          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
        </div>
        <span>Join 800+ Texas families who've switched</span>
      </div>

      {/* What happens next */}
      <div className="next-steps">
        <h4>What happens next:</h4>
        <div className="next-step">
          <span className="step-num">1</span>
          <span>Quick call — we answer your questions</span>
        </div>
        <div className="next-step">
          <span className="step-num">2</span>
          <span>Site check — we confirm your home qualifies</span>
        </div>
        <div className="next-step">
          <span className="step-num">3</span>
          <span>Installation — professional 1-day setup</span>
        </div>
      </div>

      <div className="schedule-divider"></div>

      <div className="schedule-section">
        <label className="schedule-label">Pick a day for your 15-min call</label>
        <div className="day-options">
          {availableDays.map((day) => (
            <button
              key={day.value}
              type="button"
              className={`day-btn ${formData.appointmentDay === day.value ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, appointmentDay: day.value }))}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {formData.appointmentDay && (
        <div className="schedule-section">
          <label className="schedule-label">What time works?</label>
          <div className="time-options">
            <button
              type="button"
              className={`time-btn ${formData.appointmentTime === 'morning' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, appointmentTime: 'morning' }))}
            >
              <Clock size={18} />
              <span>Morning</span>
              <small>9am - 12pm</small>
            </button>
            <button
              type="button"
              className={`time-btn ${formData.appointmentTime === 'afternoon' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, appointmentTime: 'afternoon' }))}
            >
              <Clock size={18} />
              <span>Afternoon</span>
              <small>12pm - 5pm</small>
            </button>
            <button
              type="button"
              className={`time-btn ${formData.appointmentTime === 'evening' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, appointmentTime: 'evening' }))}
            >
              <Clock size={18} />
              <span>Evening</span>
              <small>5pm - 8pm</small>
            </button>
          </div>
        </div>
      )}

      {formData.appointmentDay && formData.appointmentTime && (
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmitAppointment}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="btn-loading">
              <Loader2 size={20} className="spin" />
              Scheduling...
            </span>
          ) : (
            <>
              Lock In My Spot
              <ArrowRight size={20} />
            </>
          )}
        </button>
      )}

      <button type="button" className="skip-link" onClick={handleSubmitAppointment}>
        Skip for now, I'll call you
      </button>

      {/* Solrite branding */}
      <div className="schedule-trust">
        <div className="solrite-badge">
          <Star size={12} fill="#00D4AA" stroke="#00D4AA" />
          <span>4.9</span>
        </div>
        <span>Solrite Energy • 500+ 5-Star Reviews</span>
      </div>

      <button type="button" className="back-btn" onClick={() => setStep(2)}>
        ← Back
      </button>
    </div>
  )

  // Step 4: Success
  const renderSuccess = () => {
    // Format appointment date for display
    const getAppointmentDisplay = () => {
      if (!formData.appointmentDay) return null

      const date = new Date(formData.appointmentDay + 'T12:00:00')
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

      const timeMap = {
        morning: '9am - 12pm',
        afternoon: '12pm - 5pm',
        evening: '5pm - 8pm'
      }

      return `${dayStr}, ${timeMap[formData.appointmentTime] || ''}`
    }

    return (
      <div className="hero-success">
        <div className="success-icon">
          <CheckCircle size={48} />
        </div>
        <h3>{eligibilityResult?.eligible ? "You're All Set!" : "Thanks!"}</h3>
        <p>
          {eligibilityResult?.eligible
            ? formData.appointmentDay
              ? "Your consultation is scheduled. We'll call you to confirm."
              : "We'll call you within 24 hours to schedule your free consultation."
            : "We'll notify you if eligibility expands to your area."}
        </p>

        {formData.appointmentDay && formData.appointmentTime && (
          <div className="appointment-confirmation">
            <Calendar size={18} />
            <span>{getAppointmentDisplay()}</span>
          </div>
        )}

        <a href="tel:+12544104104" className="call-link">
          <Phone size={18} />
          <span>Call: (254) 410-4104</span>
        </a>
      </div>
    )
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/images/hero-home.jpg" alt="Beautiful Texas home with battery backup" />
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <div className="hero-grid">
          {/* Desktop: Original content */}
          <div className="hero-content hero-content-desktop" onClick={() => scrollToSection('hero-form')} role="button" tabIndex={0}>
            <div className="hero-badge">
              <Zap size={16} />
              <span>Federal Energy Community Program</span>
            </div>

            <h1>
              Free Battery Backup
              <span className="highlight">For Qualifying Texas Homes</span>
            </h1>

            <p className="hero-subtitle">
              A federal tax credit covers the full cost of a Sonnen battery system
              for homes in qualifying zip codes. Most don't qualify, but yours might.
            </p>

            <div className="hero-features">
              <div className="feature">
                <div className="feature-icon">
                  <DollarSign size={20} />
                </div>
                <span>$0 Out of Pocket</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Zap size={20} />
                </div>
                <span>Backup Power</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Calendar size={20} />
                </div>
                <span>2-3 Week Install</span>
              </div>
            </div>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => scrollToSection('hero-form')}>
                Check If I Qualify
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Mobile: EPIC Hero - Shouting from the mountain */}
          <div className="hero-content hero-content-mobile">
            {/* Animated shapes */}
            <div className="hero-shape-1"></div>
            <div className="hero-shape-2"></div>
            <div className="hero-accent-line"></div>

            {!journeyPath ? (
              // Epic Landing - The Mountain Top
              <div className="epic-hero">
                <div className="epic-eyebrow">
                  <Zap size={14} />
                  <span>FEDERAL ENERGY PROGRAM</span>
                </div>

                <div className="epic-value">
                  <span className="epic-amount">$60,000</span>
                  <span className="epic-label">Battery System</span>
                </div>

                <h1 className="epic-headline">
                  Yours for <span>$0</span><br />
                  if you qualify
                </h1>

                <p className="epic-subtitle">
                  Texas homeowners in qualifying zip codes get a Sonnen battery installed free through a federal tax credit program.
                </p>

                <div className="epic-cta">
                  <button
                    className="epic-btn"
                    onClick={() => { playWhoosh(); haptic('heavy'); setJourneyPath('check'); }}
                  >
                    <span>Check My Address</span>
                    <ArrowRight size={22} />
                  </button>
                </div>

                <div className="epic-features">
                  <div className="epic-feature">
                    <div className="epic-feature-icon">
                      <Zap size={22} />
                    </div>
                    <div className="epic-feature-text">
                      <span className="epic-feature-title">Whole-Home Backup</span>
                      <span className="epic-feature-desc">Power through any outage</span>
                    </div>
                  </div>
                  <div className="epic-feature">
                    <div className="epic-feature-icon">
                      <DollarSign size={22} />
                    </div>
                    <div className="epic-feature-text">
                      <span className="epic-feature-title">$0 Out of Pocket</span>
                      <span className="epic-feature-desc">Federal tax credit covers it</span>
                    </div>
                  </div>
                  <div className="epic-feature">
                    <div className="epic-feature-icon">
                      <Shield size={22} />
                    </div>
                    <div className="epic-feature-text">
                      <span className="epic-feature-title">10-Year Warranty</span>
                      <span className="epic-feature-desc">Premium Sonnen system</span>
                    </div>
                  </div>
                </div>

                <p className="epic-trust">
                  <strong>2,847</strong> Texas homes enrolled this month
                </p>
              </div>
            ) : (
              // Form appears after CTA click
              <div className="epic-form-intro">
                <button className="epic-back" onClick={() => { playTap(); haptic(); setJourneyPath(null); }}>
                  ← Back
                </button>
              </div>
            )}
          </div>

          <div className="hero-form-container" id="hero-form">
            {/* Show form only after journey selection on mobile, or always on desktop */}
            <div className={`hero-form-wrapper ${!journeyPath ? 'mobile-hidden' : ''}`}>
              {step === 1 && renderAddressStep()}
              {step === 2 && renderContactStep()}
              {step === 3 && renderScheduleStep()}
              {step === 4 && renderSuccess()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
