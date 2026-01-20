// Test script for Energy Community Verification
// Run with: node test-verification.mjs

const CENSUS_GEOCODER_BASE = 'https://geocoding.geo.census.gov/geocoder'

// Texas qualifying counties (subset for testing)
const QUALIFYING_COUNTIES_TX = {
  '48201': { name: 'Harris', msa: 'Houston-The Woodlands-Sugar Land' },
  '48113': { name: 'Dallas', msa: 'Dallas-Fort Worth-Arlington' },
  '48439': { name: 'Tarrant', msa: 'Dallas-Fort Worth-Arlington' },
  '48329': { name: 'Midland', msa: 'Midland' },
  '48135': { name: 'Ector', msa: 'Odessa' },
}

// Test addresses
const TEST_ADDRESSES = [
  { name: 'Houston (Harris County - should qualify)', address: '1000 Main St, Houston, TX 77002' },
  { name: 'Dallas (Dallas County - should qualify)', address: '500 Commerce St, Dallas, TX 75201' },
  { name: 'Midland (Permian Basin - should qualify)', address: '200 N Main St, Midland, TX 79701' },
  { name: 'Austin (Travis County - may NOT qualify)', address: '100 Congress Ave, Austin, TX 78701' },
]

async function getCensusGeography(address) {
  const url = new URL(`${CENSUS_GEOCODER_BASE}/geographies/onelineaddress`)
  url.searchParams.append('address', address)
  url.searchParams.append('benchmark', 'Public_AR_Current')
  url.searchParams.append('vintage', 'Current_Current')
  url.searchParams.append('layers', 'all')
  url.searchParams.append('format', 'json')

  const response = await fetch(url.toString())
  const data = await response.json()
  
  if (!data.result?.addressMatches?.length) {
    return { error: 'Address not found' }
  }

  const match = data.result.addressMatches[0]
  const geographies = match.geographies
  
  let result = {
    matchedAddress: match.matchedAddress,
    coordinates: match.coordinates,
  }

  // Get tract info
  const tracts = geographies?.['Census Tracts']
  if (tracts?.length) {
    result.stateFips = tracts[0].STATE
    result.countyFips = tracts[0].COUNTY
    result.tractFips = tracts[0].TRACT
    result.fullTractFips = tracts[0].GEOID
    result.fullCountyFips = tracts[0].STATE + tracts[0].COUNTY
  }

  // Get county name
  const counties = geographies?.['Counties']
  if (counties?.length) {
    result.countyName = counties[0].NAME
  }

  // Get state name
  const states = geographies?.['States']
  if (states?.length) {
    result.stateName = states[0].NAME
  }

  return result
}

function checkEligibility(censusData) {
  if (!censusData.fullCountyFips) return { eligible: false, reason: 'No FIPS code' }
  
  if (censusData.stateFips !== '48') {
    return { eligible: false, reason: 'Not in Texas' }
  }

  if (QUALIFYING_COUNTIES_TX[censusData.fullCountyFips]) {
    const county = QUALIFYING_COUNTIES_TX[censusData.fullCountyFips]
    return { 
      eligible: true, 
      reason: `${county.name} County qualifies (${county.msa} MSA)`,
      category: 'statistical_area'
    }
  }

  return { eligible: false, reason: `${censusData.countyName} County not in qualifying list` }
}

async function runTests() {
  console.log('='.repeat(60))
  console.log('ENERGY COMMUNITY VERIFICATION TEST')
  console.log('='.repeat(60))
  console.log('')

  for (const test of TEST_ADDRESSES) {
    console.log(`\n📍 ${test.name}`)
    console.log(`   Address: ${test.address}`)
    
    try {
      const census = await getCensusGeography(test.address)
      
      if (census.error) {
        console.log(`   ❌ Error: ${census.error}`)
        continue
      }

      console.log(`   Matched: ${census.matchedAddress}`)
      console.log(`   County: ${census.countyName} (FIPS: ${census.fullCountyFips})`)
      console.log(`   Tract: ${census.fullTractFips}`)
      console.log(`   State: ${census.stateName} (FIPS: ${census.stateFips})`)

      const eligibility = checkEligibility(census)
      if (eligibility.eligible) {
        console.log(`   ✅ ELIGIBLE: ${eligibility.reason}`)
      } else {
        console.log(`   ⚠️  NOT ELIGIBLE: ${eligibility.reason}`)
      }

    } catch (error) {
      console.log(`   ❌ API Error: ${error.message}`)
    }

    // Rate limit - Census API is free but be polite
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('TEST COMPLETE')
  console.log('='.repeat(60))
}

runTests()
