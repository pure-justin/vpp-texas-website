import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Loader2, X, Check, AlertCircle, Search } from 'lucide-react'
import { parseGoogleAddress, getCurrentLocation, checkVPPEligibility, getUtilityFromZip } from '../services/utilityService'
import useGoogleMaps from '../hooks/useGoogleMaps'
import './AddressAutocomplete.css'

function AddressAutocomplete({
  onAddressSelect,
  onEligibilityCheck,
  showEligibility = true,
  compact = false,
  placeholder = 'Enter your home address'
}) {
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps()
  const [inputValue, setInputValue] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [eligibility, setEligibility] = useState(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize Google Places Autocomplete when maps are loaded
  useEffect(() => {
    if (!mapsLoaded || !inputRef.current) {
      return
    }

    if (mapsError) {
      setFallbackMode(true)
      return
    }

    try {
      const options = {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
        types: ['address']
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      )

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    } catch (err) {
      console.warn('Failed to initialize autocomplete:', err)
      setFallbackMode(true)
    }

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [mapsLoaded, mapsError])

  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) return

    const place = autocompleteRef.current.getPlace()

    if (!place.geometry) {
      setError('Please select an address from the suggestions')
      return
    }

    const addressData = parseGoogleAddress(place)
    processAddress(addressData)
  }, [])

  const processAddress = (addressData) => {
    setSelectedAddress(addressData)
    setInputValue(addressData.formattedAddress)
    setError(null)

    // Notify parent of address selection
    if (onAddressSelect) {
      onAddressSelect(addressData)
    }

    // Check eligibility if enabled
    if (showEligibility) {
      const result = checkVPPEligibility(addressData)
      setEligibility(result)

      if (onEligibilityCheck) {
        onEligibilityCheck(result)
      }
    }
  }

  const handleCurrentLocation = async () => {
    setIsLocating(true)
    setError(null)

    try {
      const addressData = await getCurrentLocation()
      processAddress(addressData)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLocating(false)
    }
  }

  // Fallback: manual zip code check
  const handleManualCheck = () => {
    // Extract zip code from input
    const zipMatch = inputValue.match(/\b\d{5}\b/)
    if (zipMatch) {
      const zipCode = zipMatch[0]
      const utility = getUtilityFromZip(zipCode)

      const addressData = {
        formattedAddress: inputValue,
        zipCode,
        state: 'TX'
      }

      processAddress(addressData)
    } else {
      setError('Please enter a valid Texas address with a 5-digit zip code')
    }
  }

  const handleClear = () => {
    setInputValue('')
    setSelectedAddress(null)
    setEligibility(null)
    setError(null)

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (onAddressSelect) {
      onAddressSelect(null)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setSelectedAddress(null)
    setEligibility(null)
    setError(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && fallbackMode) {
      e.preventDefault()
      handleManualCheck()
    }
  }

  return (
    <div className={`address-autocomplete ${compact ? 'compact' : ''}`}>
      <div className="address-input-wrapper">
        <div className="address-input-container">
          <MapPin className="input-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`address-input ${selectedAddress ? 'has-value' : ''} ${error ? 'has-error' : ''}`}
            autoComplete="off"
          />
          {inputValue && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear address"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="address-actions">
          {fallbackMode && inputValue && (
            <button
              type="button"
              className="check-btn"
              onClick={handleManualCheck}
              title="Check eligibility"
            >
              <Search size={20} />
              <span className="btn-text">Check</span>
            </button>
          )}

          <button
            type="button"
            className="location-btn"
            onClick={handleCurrentLocation}
            disabled={isLocating}
            title="Use my current location"
          >
            {isLocating ? (
              <Loader2 size={20} className="spin" />
            ) : (
              <Navigation size={20} />
            )}
            <span className="location-text">Current Location</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="address-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {showEligibility && eligibility && (
        <div className={`eligibility-result ${eligibility.eligible ? 'eligible' : 'not-eligible'}`}>
          <div className="result-header">
            {eligibility.eligible ? (
              <Check size={24} className="result-icon success" />
            ) : (
              <AlertCircle size={24} className="result-icon warning" />
            )}
            <div className="result-content">
              <h4 className="result-title">
                {eligibility.eligible ? 'You Qualify!' : 'Not Available Yet'}
              </h4>
              <p className="result-message">{eligibility.message}</p>
            </div>
          </div>

          {eligibility.utility && (
            <div className="utility-info">
              <span className="utility-label">Your Utility Provider:</span>
              <span className="utility-name">{eligibility.utility.name}</span>
              {eligibility.utility.deregulated && (
                <span className="utility-badge">Deregulated Market</span>
              )}
            </div>
          )}

          {eligibility.eligible && eligibility.benefits && !compact && (
            <div className="benefits-preview">
              <span className="benefits-title">Your Benefits Include:</span>
              <ul className="benefits-list">
                {eligibility.benefits.map((benefit, index) => (
                  <li key={index}>
                    <Check size={14} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddressAutocomplete
