// Energy Community Data for IRA Tax Credit Bonus Eligibility
// Source: IRS Notice 2025-31, Appendix 3
// Last Updated: June 2025
//
// Counties listed qualify as Energy Communities under the Statistical Area Category:
// - Meet 0.17%+ direct fossil fuel employment (FFE) threshold
// - Have unemployment rate at or above national average for calendar year 2024
//
// Vintage 1 = Based on 2020 MSA/non-MSA delineations
// Vintage 2 = Based on 2023 MSA/non-MSA delineations (OMB Bulletin 23-01)

export const QUALIFYING_COUNTIES_TX = {
  // IRS Notice 2025-31 Appendix 3 - Texas Counties
  // Format: FIPS code -> { name, vintage1 (2020), vintage2 (2023) }

  '48001': { name: 'Anderson', vintage1: true, vintage2: true },
  '48005': { name: 'Angelina', vintage1: true, vintage2: true },
  '48007': { name: 'Aransas', vintage1: true, vintage2: true },
  '48015': { name: 'Austin', vintage1: true, vintage2: true },
  '48025': { name: 'Bee', vintage1: true, vintage2: true },
  '48037': { name: 'Bowie', vintage1: true, vintage2: true },
  '48039': { name: 'Brazoria', vintage1: true, vintage2: true },
  '48047': { name: 'Brooks', vintage1: true, vintage2: true },
  '48057': { name: 'Calhoun', vintage1: true, vintage2: true },
  '48063': { name: 'Camp', vintage1: true, vintage2: true },
  '48067': { name: 'Cass', vintage1: true, vintage2: true },
  '48071': { name: 'Chambers', vintage1: true, vintage2: true },
  '48073': { name: 'Cherokee', vintage1: true, vintage2: true },
  '48089': { name: 'Colorado', vintage1: true, vintage2: true },
  '48093': { name: 'Comanche', vintage1: true, vintage2: true },
  '48097': { name: 'Cooke', vintage1: true, vintage2: true },
  '48119': { name: 'Delta', vintage1: true, vintage2: true },
  '48123': { name: 'DeWitt', vintage1: true, vintage2: true },
  '48127': { name: 'Dimmit', vintage1: true, vintage2: true },
  '48131': { name: 'Duval', vintage1: true, vintage2: true },
  '48133': { name: 'Eastland', vintage1: true, vintage2: true },
  '48137': { name: 'Edwards', vintage1: true, vintage2: true },
  '48141': { name: 'El Paso', vintage1: true, vintage2: true },
  '48143': { name: 'Erath', vintage1: true, vintage2: true },
  '48147': { name: 'Fannin', vintage1: true, vintage2: true },
  '48157': { name: 'Fort Bend', vintage1: true, vintage2: true },
  '48159': { name: 'Franklin', vintage1: true, vintage2: true },
  '48163': { name: 'Frio', vintage1: false, vintage2: true },
  '48167': { name: 'Galveston', vintage1: true, vintage2: true },
  '48175': { name: 'Goliad', vintage1: true, vintage2: true },
  '48177': { name: 'Gonzales', vintage1: true, vintage2: true },
  '48183': { name: 'Gregg', vintage1: true, vintage2: true },
  '48199': { name: 'Hardin', vintage1: true, vintage2: true },
  '48201': { name: 'Harris', vintage1: true, vintage2: true },
  '48203': { name: 'Harrison', vintage1: true, vintage2: true },
  '48213': { name: 'Henderson', vintage1: true, vintage2: true },
  '48215': { name: 'Hidalgo', vintage1: true, vintage2: true },
  '48221': { name: 'Hood', vintage1: false, vintage2: true },
  '48223': { name: 'Hopkins', vintage1: true, vintage2: true },
  '48225': { name: 'Houston', vintage1: true, vintage2: true },
  '48229': { name: 'Hudspeth', vintage1: true, vintage2: true },
  '48237': { name: 'Jack', vintage1: true, vintage2: true },
  '48239': { name: 'Jackson', vintage1: true, vintage2: true },
  '48241': { name: 'Jasper', vintage1: true, vintage2: true },
  '48245': { name: 'Jefferson', vintage1: true, vintage2: true },
  '48247': { name: 'Jim Hogg', vintage1: true, vintage2: true },
  '48249': { name: 'Jim Wells', vintage1: true, vintage2: true },
  '48255': { name: 'Karnes', vintage1: true, vintage2: true },
  '48261': { name: 'Kenedy', vintage1: true, vintage2: true },
  '48271': { name: 'Kinney', vintage1: true, vintage2: true },
  '48273': { name: 'Kleberg', vintage1: true, vintage2: true },
  '48277': { name: 'Lamar', vintage1: true, vintage2: true },
  '48283': { name: 'La Salle', vintage1: true, vintage2: true },
  '48285': { name: 'Lavaca', vintage1: true, vintage2: true },
  '48291': { name: 'Liberty', vintage1: true, vintage2: true },
  '48297': { name: 'Live Oak', vintage1: true, vintage2: true },
  '48311': { name: 'McMullen', vintage1: true, vintage2: true },
  '48315': { name: 'Marion', vintage1: true, vintage2: true },
  '48321': { name: 'Matagorda', vintage1: true, vintage2: true },
  '48323': { name: 'Maverick', vintage1: true, vintage2: true },
  '48337': { name: 'Montague', vintage1: true, vintage2: true },
  '48339': { name: 'Montgomery', vintage1: true, vintage2: true },
  '48343': { name: 'Morris', vintage1: true, vintage2: true },
  '48347': { name: 'Nacogdoches', vintage1: true, vintage2: true },
  '48349': { name: 'Navarro', vintage1: true, vintage2: true },
  '48351': { name: 'Newton', vintage1: true, vintage2: true },
  '48355': { name: 'Nueces', vintage1: true, vintage2: true },
  '48361': { name: 'Orange', vintage1: true, vintage2: true },
  '48363': { name: 'Palo Pinto', vintage1: true, vintage2: true },
  '48365': { name: 'Panola', vintage1: true, vintage2: true },
  '48373': { name: 'Polk', vintage1: true, vintage2: true },
  '48379': { name: 'Rains', vintage1: true, vintage2: true },
  '48385': { name: 'Real', vintage1: true, vintage2: true },
  '48387': { name: 'Red River', vintage1: true, vintage2: true },
  '48391': { name: 'Refugio', vintage1: true, vintage2: true },
  '48401': { name: 'Rusk', vintage1: true, vintage2: true },
  '48403': { name: 'Sabine', vintage1: true, vintage2: true },
  '48405': { name: 'San Augustine', vintage1: true, vintage2: true },
  '48407': { name: 'San Jacinto', vintage1: true, vintage2: true },
  '48409': { name: 'San Patricio', vintage1: true, vintage2: true },
  '48419': { name: 'Shelby', vintage1: true, vintage2: true },
  '48425': { name: 'Somervell', vintage1: false, vintage2: true },
  '48427': { name: 'Starr', vintage1: true, vintage2: true },
  '48429': { name: 'Stephens', vintage1: true, vintage2: true },
  '48449': { name: 'Titus', vintage1: true, vintage2: true },
  '48455': { name: 'Trinity', vintage1: true, vintage2: true },
  '48457': { name: 'Tyler', vintage1: true, vintage2: true },
  '48459': { name: 'Upshur', vintage1: true, vintage2: true },
  '48463': { name: 'Uvalde', vintage1: true, vintage2: true },
  '48465': { name: 'Val Verde', vintage1: true, vintage2: true },
  '48467': { name: 'Van Zandt', vintage1: true, vintage2: true },
  '48469': { name: 'Victoria', vintage1: true, vintage2: true },
  '48473': { name: 'Waller', vintage1: true, vintage2: true },
  '48479': { name: 'Webb', vintage1: true, vintage2: true },
  '48481': { name: 'Wharton', vintage1: true, vintage2: true },
  '48489': { name: 'Willacy', vintage1: true, vintage2: true },
  '48499': { name: 'Wood', vintage1: true, vintage2: true },
  '48503': { name: 'Young', vintage1: true, vintage2: true },
  '48505': { name: 'Zapata', vintage1: true, vintage2: true },
  '48507': { name: 'Zavala', vintage1: true, vintage2: true },
}

// Metadata about the data
export const ENERGY_COMMUNITY_METADATA = {
  lastUpdated: '2025-06-23',
  irsNotice: '2025-31',
  effectiveDate: '2025-06-23',
  nextUpdate: '2026-06',
  dataSource: 'IRS Notice 2025-31, Appendix 3',
  totalTexasCounties: 100,
  categories: {
    statisticalArea: 'Counties meeting fossil fuel employment (0.17%+) and unemployment (at/above national avg) thresholds'
  }
}

// Helper function to check if a county qualifies
export function isQualifyingCounty(countyFips) {
  return QUALIFYING_COUNTIES_TX.hasOwnProperty(countyFips)
}

// Get county info if qualifying
export function getQualifyingCountyInfo(countyFips) {
  return QUALIFYING_COUNTIES_TX[countyFips] || null
}
