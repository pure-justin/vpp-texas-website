// Texas Utility Service - Determines utility provider and VPP eligibility
// Based on zip codes, coordinates, and energy community status

import { QUALIFYING_COUNTIES_TX } from '../data/energyCommunities'

// Build a county name lookup from the FIPS data for fast matching
const COUNTY_NAME_TO_FIPS = Object.entries(QUALIFYING_COUNTIES_TX).reduce((acc, [fips, data]) => {
  acc[data.name.toLowerCase()] = fips
  return acc
}, {})

// Check if a county qualifies as an energy community
// Based on IRS Notice 2025-31 Appendix 3
export function isEnergyCommunity(countyName) {
  if (!countyName) return { isEnergyCommunity: false, reason: 'no_county' }

  const normalizedCounty = countyName.toLowerCase().replace(/ county$/i, '')
  const fips = COUNTY_NAME_TO_FIPS[normalizedCounty]

  if (fips) {
    const countyData = QUALIFYING_COUNTIES_TX[fips]
    // County qualifies if it's in either Vintage 1 or Vintage 2
    const qualifies = countyData.vintage1 || countyData.vintage2
    return {
      isEnergyCommunity: qualifies,
      countyName: countyData.name,
      vintage1: countyData.vintage1,
      vintage2: countyData.vintage2,
      fips
    }
  }

  return { isEnergyCommunity: false, reason: 'not_qualifying_county' }
}

// Texas deregulated market utility territories
const UTILITY_TERRITORIES = {
  CENTERPOINT: {
    name: 'Centerpoint',
    region: 'Houston Metro',
    deregulated: true,
    energyCommunity: true,
    zipPrefixes: ['770', '771', '773', '774', '775', '776', '777'],
    coverageAreas: [
      'Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Pearland',
      'League City', 'Pasadena', 'Baytown', 'Missouri City', 'Humble',
      'Cypress', 'Spring', 'Tomball', 'Friendswood', 'Clear Lake'
    ]
  },
  ONCOR: {
    name: 'Oncor',
    region: 'Dallas-Fort Worth',
    deregulated: true,
    energyCommunity: false,
    zipPrefixes: ['750', '751', '752', '753', '754', '755', '760', '761', '762'],
    coverageAreas: [
      'Dallas', 'Fort Worth', 'Plano', 'Arlington', 'Irving', 'Frisco',
      'McKinney', 'Carrollton', 'Richardson', 'Denton', 'Garland',
      'Grand Prairie', 'Mesquite', 'Lewisville', 'Allen', 'Flower Mound'
    ]
  },
  TNMP: {
    name: 'TNMP',
    region: 'Multiple Areas',
    deregulated: true,
    energyCommunity: true,
    zipPrefixes: ['763', '764', '765'],
    coverageAreas: [
      'Waco', 'Killeen', 'Temple', 'Round Rock', 'Georgetown',
      'Pflugerville', 'Cedar Park'
    ]
  },
  AEP_TEXAS: {
    name: 'AEP Texas',
    region: 'South/West Texas',
    deregulated: true,
    energyCommunity: false,
    zipPrefixes: ['783', '784', '785', '786', '787', '788'],
    coverageAreas: ['Corpus Christi', 'Victoria', 'Laredo', 'McAllen']
  }
}

// Detailed zip code to utility mapping for accurate lookups
const ZIP_TO_UTILITY = {
  // Houston Metro - Centerpoint
  '77001': 'CENTERPOINT', '77002': 'CENTERPOINT', '77003': 'CENTERPOINT',
  '77004': 'CENTERPOINT', '77005': 'CENTERPOINT', '77006': 'CENTERPOINT',
  '77007': 'CENTERPOINT', '77008': 'CENTERPOINT', '77009': 'CENTERPOINT',
  '77010': 'CENTERPOINT', '77019': 'CENTERPOINT', '77024': 'CENTERPOINT',
  '77025': 'CENTERPOINT', '77027': 'CENTERPOINT', '77030': 'CENTERPOINT',
  '77040': 'CENTERPOINT', '77041': 'CENTERPOINT', '77042': 'CENTERPOINT',
  '77043': 'CENTERPOINT', '77044': 'CENTERPOINT', '77045': 'CENTERPOINT',
  '77046': 'CENTERPOINT', '77047': 'CENTERPOINT', '77048': 'CENTERPOINT',
  '77049': 'CENTERPOINT', '77050': 'CENTERPOINT', '77051': 'CENTERPOINT',
  '77053': 'CENTERPOINT', '77054': 'CENTERPOINT', '77055': 'CENTERPOINT',
  '77056': 'CENTERPOINT', '77057': 'CENTERPOINT', '77058': 'CENTERPOINT',
  '77059': 'CENTERPOINT', '77060': 'CENTERPOINT', '77061': 'CENTERPOINT',
  '77062': 'CENTERPOINT', '77063': 'CENTERPOINT', '77064': 'CENTERPOINT',
  '77065': 'CENTERPOINT', '77066': 'CENTERPOINT', '77067': 'CENTERPOINT',
  '77068': 'CENTERPOINT', '77069': 'CENTERPOINT', '77070': 'CENTERPOINT',
  '77071': 'CENTERPOINT', '77072': 'CENTERPOINT', '77073': 'CENTERPOINT',
  '77074': 'CENTERPOINT', '77075': 'CENTERPOINT', '77076': 'CENTERPOINT',
  '77077': 'CENTERPOINT', '77078': 'CENTERPOINT', '77079': 'CENTERPOINT',
  '77080': 'CENTERPOINT', '77081': 'CENTERPOINT', '77082': 'CENTERPOINT',
  '77083': 'CENTERPOINT', '77084': 'CENTERPOINT', '77085': 'CENTERPOINT',
  '77086': 'CENTERPOINT', '77087': 'CENTERPOINT', '77088': 'CENTERPOINT',
  '77089': 'CENTERPOINT', '77090': 'CENTERPOINT', '77091': 'CENTERPOINT',
  '77092': 'CENTERPOINT', '77093': 'CENTERPOINT', '77094': 'CENTERPOINT',
  '77095': 'CENTERPOINT', '77096': 'CENTERPOINT', '77098': 'CENTERPOINT',
  '77099': 'CENTERPOINT',
  // Katy
  '77449': 'CENTERPOINT', '77450': 'CENTERPOINT', '77493': 'CENTERPOINT',
  '77494': 'CENTERPOINT',
  // Sugar Land
  '77478': 'CENTERPOINT', '77479': 'CENTERPOINT', '77498': 'CENTERPOINT',
  // The Woodlands
  '77380': 'CENTERPOINT', '77381': 'CENTERPOINT', '77382': 'CENTERPOINT',
  '77384': 'CENTERPOINT', '77385': 'CENTERPOINT', '77386': 'CENTERPOINT',
  '77387': 'CENTERPOINT', '77389': 'CENTERPOINT',
  // Pearland
  '77581': 'CENTERPOINT', '77584': 'CENTERPOINT', '77588': 'CENTERPOINT',
  // League City
  '77573': 'CENTERPOINT', '77598': 'CENTERPOINT',

  // Dallas Metro - Oncor
  '75001': 'ONCOR', '75002': 'ONCOR', '75006': 'ONCOR', '75007': 'ONCOR',
  '75010': 'ONCOR', '75013': 'ONCOR', '75019': 'ONCOR', '75023': 'ONCOR',
  '75024': 'ONCOR', '75025': 'ONCOR', '75028': 'ONCOR', '75033': 'ONCOR',
  '75034': 'ONCOR', '75035': 'ONCOR', '75038': 'ONCOR', '75039': 'ONCOR',
  '75040': 'ONCOR', '75041': 'ONCOR', '75042': 'ONCOR', '75043': 'ONCOR',
  '75044': 'ONCOR', '75048': 'ONCOR', '75050': 'ONCOR', '75051': 'ONCOR',
  '75052': 'ONCOR', '75054': 'ONCOR', '75056': 'ONCOR', '75060': 'ONCOR',
  '75061': 'ONCOR', '75062': 'ONCOR', '75063': 'ONCOR', '75067': 'ONCOR',
  '75068': 'ONCOR', '75069': 'ONCOR', '75070': 'ONCOR', '75071': 'ONCOR',
  '75074': 'ONCOR', '75075': 'ONCOR', '75078': 'ONCOR', '75080': 'ONCOR',
  '75081': 'ONCOR', '75082': 'ONCOR', '75083': 'ONCOR', '75085': 'ONCOR',
  '75086': 'ONCOR', '75087': 'ONCOR', '75088': 'ONCOR', '75089': 'ONCOR',
  '75093': 'ONCOR', '75094': 'ONCOR', '75098': 'ONCOR', '75104': 'ONCOR',
  '75115': 'ONCOR', '75116': 'ONCOR', '75126': 'ONCOR', '75134': 'ONCOR',
  '75137': 'ONCOR', '75141': 'ONCOR', '75149': 'ONCOR', '75150': 'ONCOR',
  '75154': 'ONCOR', '75159': 'ONCOR', '75166': 'ONCOR', '75180': 'ONCOR',
  '75181': 'ONCOR', '75182': 'ONCOR', '75201': 'ONCOR', '75202': 'ONCOR',
  '75203': 'ONCOR', '75204': 'ONCOR', '75205': 'ONCOR', '75206': 'ONCOR',
  '75207': 'ONCOR', '75208': 'ONCOR', '75209': 'ONCOR', '75210': 'ONCOR',
  '75211': 'ONCOR', '75212': 'ONCOR', '75214': 'ONCOR', '75215': 'ONCOR',
  '75216': 'ONCOR', '75217': 'ONCOR', '75218': 'ONCOR', '75219': 'ONCOR',
  '75220': 'ONCOR', '75223': 'ONCOR', '75224': 'ONCOR', '75225': 'ONCOR',
  '75226': 'ONCOR', '75227': 'ONCOR', '75228': 'ONCOR', '75229': 'ONCOR',
  '75230': 'ONCOR', '75231': 'ONCOR', '75232': 'ONCOR', '75233': 'ONCOR',
  '75234': 'ONCOR', '75235': 'ONCOR', '75236': 'ONCOR', '75237': 'ONCOR',
  '75238': 'ONCOR', '75240': 'ONCOR', '75241': 'ONCOR', '75243': 'ONCOR',
  '75244': 'ONCOR', '75246': 'ONCOR', '75247': 'ONCOR', '75248': 'ONCOR',
  '75249': 'ONCOR', '75252': 'ONCOR', '75253': 'ONCOR', '75254': 'ONCOR',
  '75287': 'ONCOR',
  // Fort Worth
  '76001': 'ONCOR', '76002': 'ONCOR', '76006': 'ONCOR', '76010': 'ONCOR',
  '76011': 'ONCOR', '76012': 'ONCOR', '76013': 'ONCOR', '76014': 'ONCOR',
  '76015': 'ONCOR', '76016': 'ONCOR', '76017': 'ONCOR', '76018': 'ONCOR',
  '76019': 'ONCOR', '76101': 'ONCOR', '76102': 'ONCOR', '76103': 'ONCOR',
  '76104': 'ONCOR', '76105': 'ONCOR', '76106': 'ONCOR', '76107': 'ONCOR',
  '76108': 'ONCOR', '76109': 'ONCOR', '76110': 'ONCOR', '76111': 'ONCOR',
  '76112': 'ONCOR', '76114': 'ONCOR', '76115': 'ONCOR', '76116': 'ONCOR',
  '76117': 'ONCOR', '76118': 'ONCOR', '76119': 'ONCOR', '76120': 'ONCOR',
  '76123': 'ONCOR', '76126': 'ONCOR', '76127': 'ONCOR', '76129': 'ONCOR',
  '76131': 'ONCOR', '76132': 'ONCOR', '76133': 'ONCOR', '76134': 'ONCOR',
  '76135': 'ONCOR', '76137': 'ONCOR', '76140': 'ONCOR', '76148': 'ONCOR',
  '76155': 'ONCOR', '76177': 'ONCOR', '76179': 'ONCOR', '76180': 'ONCOR',
  '76182': 'ONCOR', '76244': 'ONCOR', '76248': 'ONCOR'
}

// Get utility info from zip code
export function getUtilityFromZip(zipCode) {
  const utilityKey = ZIP_TO_UTILITY[zipCode]

  if (utilityKey) {
    return {
      found: true,
      ...UTILITY_TERRITORIES[utilityKey],
      key: utilityKey
    }
  }

  // Try prefix matching for broader coverage
  const prefix = zipCode.substring(0, 3)
  for (const [key, territory] of Object.entries(UTILITY_TERRITORIES)) {
    if (territory.zipPrefixes.includes(prefix)) {
      return {
        found: true,
        ...territory,
        key,
        matchedByPrefix: true
      }
    }
  }

  return {
    found: false,
    name: 'Unknown',
    deregulated: false,
    energyCommunity: false
  }
}

// Texas zip codes start with 75, 76, 77, 78, or 79
function isTexasZipCode(zipCode) {
  if (!zipCode || zipCode.length < 5) return false
  const prefix = zipCode.substring(0, 2)
  return ['75', '76', '77', '78', '79'].includes(prefix)
}

// Check full VPP eligibility - Energy Community is the primary qualifier
export function checkVPPEligibility(addressData) {
  const { zipCode, county, state } = addressData

  // Must be in Texas - check both state and zip code
  const stateIsTexas = state && (state.toLowerCase() === 'texas' || state.toLowerCase() === 'tx')
  const zipIsTexas = isTexasZipCode(zipCode)

  // Reject if state is explicitly NOT Texas
  if (state && !stateIsTexas) {
    return {
      eligible: false,
      reason: 'out_of_state',
      message: 'The energy community rebate is currently only available for Texas residents.',
      utility: null,
      energyCommunity: false
    }
  }

  // Reject if zip code is clearly not Texas (and state wasn't confirmed as Texas)
  if (!zipIsTexas && !stateIsTexas) {
    return {
      eligible: false,
      reason: 'out_of_state',
      message: 'The energy community rebate is currently only available for Texas residents.',
      utility: null,
      energyCommunity: false
    }
  }

  const utility = getUtilityFromZip(zipCode)

  // Primary check: Energy Community status based on actual county
  const energyCommunityResult = isEnergyCommunity(county)

  if (!utility.found) {
    // Even if utility unknown, we can still check energy community by county
    if (energyCommunityResult.isEnergyCommunity) {
      return {
        eligible: true,
        reason: 'energy_community_eligible',
        message: `${energyCommunityResult.countyName} County is a federal energy community! Contact us to verify your utility provider.`,
        utility: null,
        energyCommunity: true,
        county: energyCommunityResult.countyName,
        benefits: [
          'Federal energy community rebate',
          'Free Sonnen battery installation',
          'Lower electricity rates',
          'Backup power protection'
        ]
      }
    }
    return {
      eligible: false,
      reason: 'unknown_utility',
      message: 'We couldn\'t verify your address. Please check the zip code or contact us directly.',
      utility: null,
      energyCommunity: false
    }
  }

  // Check if NOT an energy community
  if (!energyCommunityResult.isEnergyCommunity) {
    return {
      eligible: false,
      reason: 'not_energy_community',
      message: `${county || 'Your'} County is not currently designated as a federal energy community.`,
      utility,
      energyCommunity: false
    }
  }

  // Secondary check: Deregulated market (required for VPP participation)
  if (!utility.deregulated) {
    return {
      eligible: false,
      reason: 'regulated_market',
      message: `Your area is served by ${utility.name}, which operates in a regulated market. Energy community status confirmed for ${energyCommunityResult.countyName} County.`,
      utility,
      energyCommunity: true,
      county: energyCommunityResult.countyName
    }
  }

  // All checks passed - qualifies for energy community rebate
  return {
    eligible: true,
    reason: 'energy_community_eligible',
    message: `Great news! ${energyCommunityResult.countyName} County qualifies as a federal energy community.`,
    energyCommunity: true,
    county: energyCommunityResult.countyName,
    utility,
    benefits: [
      'Federal energy community rebate',
      'Free Sonnen battery installation',
      'Lower electricity rates',
      'Backup power protection'
    ]
  }
}

// Get current location and reverse geocode
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use Google Geocoding API to get address from coordinates
          const response = await reverseGeocode(latitude, longitude)
          resolve(response)
        } catch (error) {
          reject(error)
        }
      },
      (error) => {
        let message = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access or enter your address manually.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable. Please enter your address manually.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again or enter your address manually.'
            break
        }
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Reverse geocode coordinates to address
async function reverseGeocode(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error('Location service requires Google Maps API key. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.')
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  )

  const data = await response.json()

  if (data.status !== 'OK' || !data.results[0]) {
    // Provide detailed error messages based on Google's status codes
    const errorMessages = {
      'REQUEST_DENIED': 'Geocoding API not enabled. Please enable it in Google Cloud Console.',
      'OVER_QUERY_LIMIT': 'API quota exceeded. Please try again later.',
      'INVALID_REQUEST': 'Invalid location coordinates.',
      'ZERO_RESULTS': 'No address found for this location.',
      'UNKNOWN_ERROR': 'Server error. Please try again.'
    }
    const message = errorMessages[data.status] || `Geocoding failed: ${data.status}`
    console.error('Google Geocoding Error:', data.status, data.error_message || '')
    throw new Error(message)
  }

  return parseGoogleAddress(data.results[0])
}

// Parse Google Places/Geocoding address components
export function parseGoogleAddress(place) {
  const result = {
    formattedAddress: place.formatted_address || '',
    streetNumber: '',
    street: '',
    city: '',
    county: '',
    state: '',
    zipCode: '',
    country: '',
    lat: place.geometry?.location?.lat?.() || place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng?.() || place.geometry?.location?.lng
  }

  const components = place.address_components || []

  for (const component of components) {
    const types = component.types

    if (types.includes('street_number')) {
      result.streetNumber = component.long_name
    }
    if (types.includes('route')) {
      result.street = component.long_name
    }
    if (types.includes('locality')) {
      result.city = component.long_name
    }
    if (types.includes('administrative_area_level_2')) {
      // County - Google returns "Harris County" so we strip " County" suffix
      result.county = component.long_name.replace(/ County$/i, '')
    }
    if (types.includes('administrative_area_level_1')) {
      result.state = component.short_name
    }
    if (types.includes('postal_code')) {
      result.zipCode = component.long_name
    }
    if (types.includes('country')) {
      result.country = component.short_name
    }
  }

  // Combine street address
  result.streetAddress = [result.streetNumber, result.street].filter(Boolean).join(' ')

  return result
}

export { UTILITY_TERRITORIES }
