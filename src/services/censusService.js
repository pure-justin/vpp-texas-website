// Census Bureau Geocoder API Service
// Converts addresses/coordinates to census tract and county FIPS codes
// API Docs: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

const CENSUS_GEOCODER_BASE = 'https://geocoding.geo.census.gov/geocoder'

/**
 * Get census geography (tract, county) from latitude/longitude coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Census geography data including tract and county FIPS
 */
export async function getCensusGeographyFromCoords(lat, lng) {
  const url = new URL(`${CENSUS_GEOCODER_BASE}/geographies/coordinates`)
  url.searchParams.append('x', lng.toString())
  url.searchParams.append('y', lat.toString())
  url.searchParams.append('benchmark', 'Public_AR_Current')
  url.searchParams.append('vintage', 'Current_Current')
  url.searchParams.append('layers', 'all')
  url.searchParams.append('format', 'json')

  try {
    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Census API error: ${response.status}`)
    }

    const data = await response.json()
    return parseCensusResponse(data)
  } catch (error) {
    console.error('Census Geocoder API error:', error)
    throw new Error('Unable to determine census tract. Please try again.')
  }
}

/**
 * Get census geography from a street address
 * @param {string} address - Full street address
 * @returns {Promise<Object>} Census geography data including tract and county FIPS
 */
export async function getCensusGeographyFromAddress(address) {
  const url = new URL(`${CENSUS_GEOCODER_BASE}/geographies/onelineaddress`)
  url.searchParams.append('address', address)
  url.searchParams.append('benchmark', 'Public_AR_Current')
  url.searchParams.append('vintage', 'Current_Current')
  url.searchParams.append('layers', 'all')
  url.searchParams.append('format', 'json')

  try {
    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Census API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if we got a match
    if (!data.result?.addressMatches || data.result.addressMatches.length === 0) {
      throw new Error('Address not found. Please verify and try again.')
    }

    return parseCensusResponse(data)
  } catch (error) {
    console.error('Census Geocoder API error:', error)
    throw error
  }
}

/**
 * Parse Census API response to extract geography data
 * @param {Object} data - Raw Census API response
 * @returns {Object} Parsed geography data
 */
function parseCensusResponse(data) {
  const result = {
    stateFips: null,
    countyFips: null,
    tractFips: null,
    fullTractFips: null, // 11-digit GEOID
    fullCountyFips: null, // 5-digit state+county
    blockFips: null,
    stateName: null,
    countyName: null,
    coordinates: null,
    matchedAddress: null
  }

  // Handle coordinate lookup response
  if (data.result?.geographies) {
    const geographies = data.result.geographies

    // Get Census Tract info
    const tracts = geographies['Census Tracts']
    if (tracts && tracts.length > 0) {
      const tract = tracts[0]
      result.stateFips = tract.STATE
      result.countyFips = tract.COUNTY
      result.tractFips = tract.TRACT
      result.fullTractFips = tract.GEOID // Full 11-digit tract FIPS
      result.fullCountyFips = tract.STATE + tract.COUNTY // 5-digit county FIPS
    }

    // Get County info
    const counties = geographies['Counties']
    if (counties && counties.length > 0) {
      result.countyName = counties[0].NAME
    }

    // Get State info
    const states = geographies['States']
    if (states && states.length > 0) {
      result.stateName = states[0].NAME
    }

    // Get Block info if available
    const blocks = geographies['2020 Census Blocks']
    if (blocks && blocks.length > 0) {
      result.blockFips = blocks[0].GEOID
    }
  }

  // Handle address lookup response (includes matched address)
  if (data.result?.addressMatches && data.result.addressMatches.length > 0) {
    const match = data.result.addressMatches[0]

    result.matchedAddress = match.matchedAddress
    result.coordinates = {
      lat: match.coordinates.y,
      lng: match.coordinates.x
    }

    // Get geographies from the match
    if (match.geographies) {
      const geographies = match.geographies

      const tracts = geographies['Census Tracts']
      if (tracts && tracts.length > 0) {
        const tract = tracts[0]
        result.stateFips = tract.STATE
        result.countyFips = tract.COUNTY
        result.tractFips = tract.TRACT
        result.fullTractFips = tract.GEOID
        result.fullCountyFips = tract.STATE + tract.COUNTY
      }

      const counties = geographies['Counties']
      if (counties && counties.length > 0) {
        result.countyName = counties[0].NAME
      }

      const states = geographies['States']
      if (states && states.length > 0) {
        result.stateName = states[0].NAME
      }
    }
  }

  return result
}

/**
 * Validate that we have the necessary FIPS codes
 * @param {Object} censusData - Parsed census data
 * @returns {boolean} Whether we have valid FIPS codes
 */
export function hasValidFipsCodes(censusData) {
  return !!(censusData.fullCountyFips && censusData.fullTractFips)
}
