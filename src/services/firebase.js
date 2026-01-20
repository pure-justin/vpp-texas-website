import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAnalytics, logEvent } from 'firebase/analytics'

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Initialize Analytics (only in browser)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

// Lead submission service
export async function submitLead(leadData) {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      createdAt: serverTimestamp(),
      status: 'new',
      source: 'website',
      utmSource: getUTMParam('utm_source'),
      utmMedium: getUTMParam('utm_medium'),
      utmCampaign: getUTMParam('utm_campaign'),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })

    // Track conversion in analytics
    if (analytics) {
      logEvent(analytics, 'generate_lead', {
        lead_id: docRef.id,
        source: leadData.formType || 'main'
      })
    }

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error submitting lead:', error)
    return { success: false, error: error.message }
  }
}

// Quick eligibility check
export async function checkEligibility(zipCode) {
  const eligibleZips = {
    // Houston Metro (Centerpoint)
    '77001': true, '77002': true, '77003': true, '77004': true, '77005': true,
    '77006': true, '77007': true, '77008': true, '77009': true, '77010': true,
    '77019': true, '77024': true, '77025': true, '77027': true, '77030': true,
    '77040': true, '77041': true, '77042': true, '77043': true, '77044': true,
    '77045': true, '77046': true, '77047': true, '77048': true, '77049': true,
    '77050': true, '77051': true, '77053': true, '77054': true, '77055': true,
    '77056': true, '77057': true, '77058': true, '77059': true, '77060': true,
    '77061': true, '77062': true, '77063': true, '77064': true, '77065': true,
    '77066': true, '77067': true, '77068': true, '77069': true, '77070': true,
    '77071': true, '77072': true, '77073': true, '77074': true, '77075': true,
    '77076': true, '77077': true, '77078': true, '77079': true, '77080': true,
    '77081': true, '77082': true, '77083': true, '77084': true, '77085': true,
    '77086': true, '77087': true, '77088': true, '77089': true, '77090': true,
    '77091': true, '77092': true, '77093': true, '77094': true, '77095': true,
    '77096': true, '77098': true, '77099': true,
    // Katy
    '77449': true, '77450': true, '77493': true, '77494': true,
    // Sugar Land
    '77478': true, '77479': true, '77498': true,
    // The Woodlands
    '77380': true, '77381': true, '77382': true, '77384': true, '77385': true,
    '77386': true, '77387': true, '77389': true,
    // Pearland
    '77581': true, '77584': true, '77588': true,
    // League City
    '77573': true, '77598': true,
    // Dallas Metro (Oncor)
    '75001': true, '75002': true, '75006': true, '75007': true, '75010': true,
    '75013': true, '75019': true, '75023': true, '75024': true, '75025': true,
    '75028': true, '75034': true, '75035': true, '75038': true, '75039': true,
    '75040': true, '75041': true, '75042': true, '75043': true, '75044': true,
    '75048': true, '75050': true, '75051': true, '75052': true, '75054': true,
    '75056': true, '75060': true, '75061': true, '75062': true, '75063': true,
    '75067': true, '75068': true, '75069': true, '75070': true, '75071': true,
    '75074': true, '75075': true, '75078': true, '75080': true, '75081': true,
    '75082': true, '75083': true, '75085': true, '75086': true, '75087': true,
    '75088': true, '75089': true, '75093': true, '75094': true, '75098': true,
    '75104': true, '75115': true, '75116': true, '75126': true, '75134': true,
    '75137': true, '75141': true, '75149': true, '75150': true, '75154': true,
    '75159': true, '75166': true, '75180': true, '75181': true, '75182': true,
    '75201': true, '75202': true, '75203': true, '75204': true, '75205': true,
    '75206': true, '75207': true, '75208': true, '75209': true, '75210': true,
    '75211': true, '75212': true, '75214': true, '75215': true, '75216': true,
    '75217': true, '75218': true, '75219': true, '75220': true, '75223': true,
    '75224': true, '75225': true, '75226': true, '75227': true, '75228': true,
    '75229': true, '75230': true, '75231': true, '75232': true, '75233': true,
    '75234': true, '75235': true, '75236': true, '75237': true, '75238': true,
    '75240': true, '75241': true, '75243': true, '75244': true, '75246': true,
    '75247': true, '75248': true, '75249': true, '75252': true, '75253': true,
    '75254': true, '75287': true,
    // Fort Worth
    '76101': true, '76102': true, '76103': true, '76104': true, '76105': true,
    '76106': true, '76107': true, '76108': true, '76109': true, '76110': true,
    '76111': true, '76112': true, '76114': true, '76115': true, '76116': true,
    '76117': true, '76118': true, '76119': true, '76120': true, '76123': true,
    '76126': true, '76127': true, '76129': true, '76131': true, '76132': true,
    '76133': true, '76134': true, '76135': true, '76137': true, '76140': true,
    '76148': true, '76155': true, '76177': true, '76179': true, '76180': true,
    '76182': true, '76244': true, '76248': true,
    // Plano
    '75023': true, '75024': true, '75025': true, '75074': true, '75075': true,
    '75093': true, '75094': true,
    // Arlington
    '76001': true, '76002': true, '76006': true, '76010': true, '76011': true,
    '76012': true, '76013': true, '76014': true, '76015': true, '76016': true,
    '76017': true, '76018': true, '76019': true,
    // Frisco
    '75033': true, '75034': true, '75035': true,
    // McKinney
    '75069': true, '75070': true, '75071': true
  }

  const isEligible = eligibleZips[zipCode] || false
  const provider = getProvider(zipCode)

  return {
    eligible: isEligible,
    provider: provider,
    message: isEligible
      ? `Great news! Your area (${provider}) is eligible for VPP Texas.`
      : 'We\'re not yet available in your area, but we\'re expanding! Leave your info and we\'ll notify you when we arrive.'
  }
}

function getProvider(zipCode) {
  const zip = parseInt(zipCode)
  if (zip >= 77000 && zip <= 77599) return 'Centerpoint'
  if (zip >= 75000 && zip <= 75599) return 'Oncor'
  if (zip >= 76000 && zip <= 76299) return 'Oncor'
  return 'Unknown'
}

function getUTMParam(param) {
  if (typeof window === 'undefined') return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

// Schedule consultation
export async function scheduleConsultation(consultationData) {
  try {
    const docRef = await addDoc(collection(db, 'consultations'), {
      ...consultationData,
      createdAt: serverTimestamp(),
      status: 'scheduled'
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error scheduling consultation:', error)
    return { success: false, error: error.message }
  }
}

export { db, analytics }
