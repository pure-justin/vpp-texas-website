import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Zap, MessageCircle, X, Send, Sparkles, CheckCircle } from 'lucide-react'
import './StickyBottomCTA.css'

function StickyBottomCTA() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 Quick question - do you own a home in Texas? If so, you might qualify for a FREE $60,000 Sonnen battery system. Takes 30 seconds to check!", showCTA: true }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const scrollToForm = () => {
    // Dispatch event to tell Hero to show the form
    window.dispatchEvent(new CustomEvent('showEligibilityForm'))

    // Scroll to the form after a brief delay to let it render
    setTimeout(() => {
      const form = document.getElementById('hero-form')
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Knowledge base for the AI assistant
  const knowledgeBase = `
# VPP Texas - Free Battery Program Knowledge Base

## Program Overview
- Texas homeowners can receive a $60,000 Sonnen battery system for $0 out of pocket
- This is made possible through a federal tax credit program (Section 48 Investment Tax Credit)
- The program is 100% legitimate and backed by federal energy incentives
- We partner with Solrite, a top-rated solar and battery installer in Texas

## How It Works
1. **Check Eligibility** - Enter your address to see if your zip code qualifies
2. **Quick Consultation** - A Solrite energy expert calls to verify your home qualifies
3. **Professional Installation** - Licensed installers set up your battery system
4. **Start Saving** - Enjoy backup power and reduced electricity bills

## Eligibility Requirements
- Must be a Texas homeowner (not renter)
- Home must be in a qualifying zip code
- Must have adequate sun exposure for solar (if adding solar)
- Must meet basic credit requirements for the tax credit transfer
- Single-family homes, townhomes, and some condos qualify

## The Battery System
- **Brand**: Sonnen - German-engineered, premium quality
- **Value**: $60,000 retail value
- **Capacity**: Whole-home backup power
- **Warranty**: 10-year manufacturer warranty
- **Features**: Smart energy management, app control, grid independence

## Why It's Free
- The federal government offers a 30% Investment Tax Credit for energy storage
- Through tax credit transfer programs, Solrite can claim this credit
- This allows them to install the system at no cost to qualifying homeowners
- You get the battery, they get the tax credit - everyone wins

## About Solrite
- 4.9 star rating on Google (500+ reviews)
- Licensed and insured in Texas
- Thousands of installations completed
- BBB accredited business
- Local Texas company

## Service Areas
- Dallas-Fort Worth metroplex
- Houston area
- Austin area
- San Antonio area
- Other major Texas metros

## Common Questions

**Is this really free?**
Yes! Qualifying homeowners pay $0 out of pocket. The program is funded through federal tax credits.

**What's the catch?**
There's no catch. You get a free battery, Solrite gets the tax credit. The federal government subsidizes clean energy adoption.

**How long does installation take?**
Typically 1-2 days for the battery installation.

**Do I need solar panels?**
Not necessarily. The battery can work with or without solar panels.

**Will this increase my property taxes?**
In Texas, renewable energy installations are exempt from property tax increases.

**What happens during a power outage?**
Your battery automatically kicks in, providing seamless backup power to your home.

**How do I maintain the battery?**
Sonnen batteries require minimal maintenance. The system is monitored remotely.

## Contact
- Website: vpptexas.com
- Available 7 days a week
- Quick response times
- No-pressure consultations
`

  const getAIResponse = async (userMessage) => {
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const lowerMessage = userMessage.toLowerCase()
    let response = ''

    let showCTA = true // Always show CTA to close the deal

    // Sales-focused responses - always closing
    if (lowerMessage.includes('free') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('pay')) {
      response = "100% free - $0 out of pocket! 💰\n\nThe $60,000 Sonnen battery is yours at no cost. Federal tax credits cover everything.\n\nSeriously, the only thing you need to do is check if your address qualifies. Most Texas homeowners are shocked when they find out they're eligible!"
    } else if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('requirement')) {
      response = "Super simple requirements:\n\n✓ Own a home in Texas\n✓ Live in a qualifying zip code\n✓ That's basically it!\n\n90% of Texas homeowners who check end up qualifying. It literally takes 30 seconds to find out - just pop in your address!"
    } else if (lowerMessage.includes('sonnen') || lowerMessage.includes('battery') || lowerMessage.includes('system')) {
      response = "You're getting the Rolls Royce of batteries! 🔋\n\n• German-engineered Sonnen system\n• $60,000 retail value\n• Whole-home backup power\n• 10-year warranty\n• Smart app control\n\nThis is the same battery celebrities install in their homes - except you're getting it FREE. Want to see if you qualify?"
    } else if (lowerMessage.includes('solrite') || lowerMessage.includes('installer') || lowerMessage.includes('company')) {
      response = "Solrite is legit - 4.9 stars from 500+ Google reviews! ⭐\n\nThey're the top battery installer in Texas. Licensed, insured, BBB accredited. They've done thousands of these installs.\n\nThey handle everything - you just enjoy the free battery. Ready to get connected with them?"
    } else if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('process'))) {
      response = "Dead simple:\n\n1️⃣ Check your address (30 sec)\n2️⃣ Quick call with Solrite\n3️⃣ They install your battery\n4️⃣ Enjoy free backup power!\n\nMost people go from 'just checking' to having a $60K battery installed within 2-3 weeks. The hardest part is believing it's real 😄"
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('credit') || lowerMessage.includes('government')) {
      response = "Here's the deal - the federal government WANTS you to have this battery! 🏛️\n\nThey offer a 30% tax credit for energy storage. Solrite claims that credit, and in exchange, they give YOU the battery for free.\n\nIt's a win-win that most people don't know about. But the program won't last forever - want to lock in your spot?"
    } else if (lowerMessage.includes('catch') || lowerMessage.includes('scam') || lowerMessage.includes('legit') || lowerMessage.includes('real')) {
      response = "I get it - sounds too good to be true! 🤔\n\nBut here's the reality: This is a federal program. Solrite is BBB accredited with hundreds of 5-star reviews. They've installed thousands of these.\n\nThe 'catch' is they get a tax credit, you get a $60K battery. The government subsidizes it because they want more clean energy.\n\nStill skeptical? Just check your address - no commitment, no credit card. See for yourself!"
    } else if (lowerMessage.includes('outage') || lowerMessage.includes('power') || lowerMessage.includes('backup') || lowerMessage.includes('storm')) {
      response = "Remember the last Texas blackout? ❄️⚡\n\nWith a Sonnen battery, your lights stay ON. AC keeps running. Fridge stays cold. No more:\n\n• Spoiled food\n• Freezing nights\n• Scrambling for generators\n\nAnd you can get this protection for FREE. Why wouldn't you at least check if you qualify?"
    } else if (lowerMessage.includes('solar') || lowerMessage.includes('panel')) {
      response = "Good news - you DON'T need solar! ☀️\n\nThe battery works standalone. It charges from the grid during cheap off-peak hours and powers your home during expensive peak times.\n\nWant solar too? You can add it later. But the free battery is available RIGHT NOW. Check your eligibility!"
    } else if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('dallas') || lowerMessage.includes('houston') || lowerMessage.includes('austin') || lowerMessage.includes('san antonio')) {
      response = "We're all over Texas! 🤠\n\n• Dallas-Fort Worth ✓\n• Houston ✓\n• Austin ✓\n• San Antonio ✓\n• And more!\n\nThe fastest way to know if YOUR specific address qualifies is to just check. Takes 30 seconds!"
    } else if (lowerMessage.includes('install') || lowerMessage.includes('long') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      response = "Fast! ⚡\n\n• Eligibility check: 30 seconds\n• Consultation call: Same week\n• Installation: 1-2 days\n• Total timeline: 2-3 weeks\n\nPeople who checked their address last month already have their batteries installed. Don't wait - spots fill up fast in each zip code!"
    } else if (lowerMessage.includes('yes') || lowerMessage.includes('sure') || lowerMessage.includes('ok') || lowerMessage.includes('let') || lowerMessage.includes('ready') || lowerMessage.includes('check')) {
      response = "Let's go! 🚀\n\nTap the button below to check your address. It takes literally 30 seconds and there's zero obligation.\n\nIf you qualify, you're looking at a FREE $60,000 battery. If not, no worries - at least you'll know!"
    } else if (lowerMessage.includes('no') || lowerMessage.includes('not sure') || lowerMessage.includes('maybe') || lowerMessage.includes('think')) {
      response = "No pressure at all! But consider this... 🤔\n\n• It's completely FREE\n• Takes 30 seconds to check\n• No commitment required\n• No credit card needed\n\nWorst case? You find out you don't qualify. Best case? You get a $60,000 battery for $0.\n\nWhat's stopping you from at least checking?"
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage.includes('yo')) {
      response = "Hey! 👋\n\nQuick question - do you own a home in Texas?\n\nIf yes, you might be sitting on a FREE $60,000 battery system right now. Federal program, totally legit, and it takes 30 seconds to check.\n\nWant to see if your address qualifies?"
    } else {
      response = "Here's what you need to know: 💡\n\nTexas homeowners are getting $60,000 Sonnen battery systems installed for FREE through a federal tax credit program.\n\n• Premium German battery\n• Whole-home backup power\n• $0 out of pocket\n• Professional installation\n\nThe only question is: does YOUR address qualify? Let's find out!"
    }

    setIsTyping(false)
    return { content: response, showCTA }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    const response = await getAIResponse(userMessage)
    setMessages(prev => [...prev, { role: 'assistant', content: response.content, showCTA: response.showCTA }])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Window */}
      <div className={`chat-window ${chatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="chat-title">VPP Assistant</span>
              <span className="chat-status">Online • Instant replies</span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setChatOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="message-bubble">
                <div className="message-content">
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
                {msg.role === 'assistant' && msg.showCTA && (
                  <button
                    className="chat-cta-btn"
                    onClick={() => {
                      setChatOpen(false)
                      setTimeout(() => scrollToForm(), 300)
                    }}
                  >
                    <CheckCircle size={18} />
                    <span>Check My Address</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message assistant">
              <div className="message-avatar">
                <Sparkles size={14} />
              </div>
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the free battery program..."
            className="chat-input"
          />
          <button className="chat-send" onClick={handleSend} disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky-bottom-cta">
        <div className="sticky-bar-inner">
          <button onClick={scrollToForm} className="sticky-cta-btn">
            <Zap size={18} />
            <span>Check Eligibility</span>
            <ArrowRight size={18} />
          </button>

          <button onClick={() => setChatOpen(true)} className="sticky-chat-btn">
            <MessageCircle size={22} />
            <span className="chat-pulse"></span>
          </button>
        </div>
      </div>
    </>
  )
}

export default StickyBottomCTA
