import nodemailer from 'nodemailer'

// Netlify Function to send lead notification emails via Gmail
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const lead = JSON.parse(event.body)

    const formatAppointment = () => {
      if (!lead.appointmentDay) return 'Not scheduled - requested callback'

      const date = new Date(lead.appointmentDay + 'T12:00:00')
      const dayStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

      const timeMap = {
        morning: '9:00 AM - 12:00 PM',
        afternoon: '12:00 PM - 5:00 PM',
        evening: '5:00 PM - 8:00 PM'
      }

      return `${dayStr}, ${timeMap[lead.appointmentTime] || lead.appointmentTime}`
    }

    const formatAppointmentShort = () => {
      if (!lead.appointmentDay) return 'We will call you soon'

      const date = new Date(lead.appointmentDay + 'T12:00:00')
      const dayStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      const timeMap = {
        morning: '9AM-12PM',
        afternoon: '12-5PM',
        evening: '5-8PM'
      }

      return `${dayStr}, ${timeMap[lead.appointmentTime] || lead.appointmentTime}`
    }

    // Email to sales team
    const salesEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00D4AA, #00B894); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                ⚡ New VPP Lead
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                ${lead.appointmentDay ? 'Appointment Scheduled' : 'Callback Requested'}
              </p>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <h2 style="margin: 0 0 20px; color: #1A1A2E; font-size: 18px; font-weight: 600; border-bottom: 2px solid #00D4AA; padding-bottom: 10px;">
                Contact Information
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">
                    <a href="tel:${lead.phone}" style="color: #00B894; text-decoration: none;">${lead.phone || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">
                    <a href="mailto:${lead.email}" style="color: #00B894; text-decoration: none;">${lead.email || 'N/A'}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Property Info -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <h2 style="margin: 0 0 20px; color: #1A1A2E; font-size: 18px; font-weight: 600; border-bottom: 2px solid #00D4AA; padding-bottom: 10px;">
                Property Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px; width: 120px;">Address:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Zip Code:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.zipCode || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">County:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.county || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Provider:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.provider || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Qualification -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <h2 style="margin: 0 0 20px; color: #1A1A2E; font-size: 18px; font-weight: 600; border-bottom: 2px solid #00D4AA; padding-bottom: 10px;">
                Qualification
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px; width: 120px;">Homeowner:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.isHomeowner ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Has Solar:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.hasSolar ? '☀️ Yes' : '🏠 No'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Credit 650+:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.creditComfort === true ? '✅ Yes' : lead.creditComfort === 'close' ? '🤔 Probably' : '❓ Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777; font-size: 14px;">Eligible:</td>
                  <td style="padding: 8px 0; color: #1A1A2E; font-size: 14px; font-weight: 600;">${lead.eligible ? '✅ Qualified' : '⚠️ Needs Review'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Appointment -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.05)); border: 1px solid rgba(0,212,170,0.3); border-radius: 10px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 5px; color: #777; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Appointment</p>
                <p style="margin: 0; color: #1A1A2E; font-size: 16px; font-weight: 700;">${formatAppointment()}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1A1A2E; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                VPP Texas Lead Notification • ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Customer confirmation email
    const customerEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00D4AA, #00B894); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                You're All Set! ⚡
              </h1>
              <p style="margin: 12px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">
                Your free battery consultation is confirmed
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <p style="margin: 0; font-size: 18px; color: #1A1A2E;">
                Hi ${lead.name ? lead.name.split(' ')[0] : 'there'}! 👋
              </p>
              <p style="margin: 16px 0 0; font-size: 15px; color: #555; line-height: 1.6;">
                Thank you for your interest in the Texas VPP Program. We've received your information and a solar specialist will be calling you soon.
              </p>
            </td>
          </tr>

          <!-- Appointment Box -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #1A1A2E, #2a2a4a); border-radius: 16px; padding: 30px; text-align: center;">
                <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">
                  Your Appointment
                </p>
                <p style="margin: 0; color: #00D4AA; font-size: 22px; font-weight: 700;">
                  ${formatAppointment()}
                </p>
              </div>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1A1A2E; font-size: 18px; font-weight: 600;">
                What to Expect
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 28px; height: 28px; background: rgba(0,212,170,0.15); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px;">
                            📞
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1A1A2E;">Quick Phone Consultation</p>
                          <p style="margin: 4px 0 0; font-size: 13px; color: #777;">15-minute call to verify eligibility and answer questions</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 28px; height: 28px; background: rgba(0,212,170,0.15); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px;">
                            🏠
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1A1A2E;">Custom System Design</p>
                          <p style="margin: 4px 0 0; font-size: 13px; color: #777;">We'll design a battery system tailored to your home</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 28px; height: 28px; background: rgba(0,212,170,0.15); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px;">
                            💰
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1A1A2E;">No Cost to You</p>
                          <p style="margin: 4px 0 0; font-size: 13px; color: #777;">100% covered by the VPP program - no hidden fees</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Your Property -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Property Address</p>
                <p style="margin: 0; font-size: 15px; color: #1A1A2E; font-weight: 600;">${lead.address || 'To be confirmed'}</p>
              </div>
            </td>
          </tr>

          <!-- Questions -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #777;">
                Have questions before your call?
              </p>
              <a href="tel:+12544104104" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00D4AA, #00B894); color: white; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Call (254) 410-4104
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1A1A2E; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #00D4AA; font-size: 18px; font-weight: 700;">
                VPP Texas
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                Powering Texas homes with free battery storage
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    // Send email to sales team
    const salesResult = await transporter.sendMail({
      from: `"VPP Texas Leads" <${process.env.GMAIL_USER}>`,
      to: 'justin@pure.solar, tevita@pure.solar',
      subject: `🔋 New Lead: ${lead.name} - ${lead.address?.split(',')[0] || 'VPP Texas'}`,
      html: salesEmail
    })

    // Send confirmation email to customer
    let customerResult = null
    if (lead.email) {
      customerResult = await transporter.sendMail({
        from: `"VPP Texas" <${process.env.GMAIL_USER}>`,
        to: lead.email,
        subject: `Your VPP Texas Consultation is Confirmed! ⚡`,
        html: customerEmail
      })
    }

    // Send SMS to customer via Twilio (if configured)
    let smsResult = null
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && lead.phone) {
      try {
        const twilioClient = (await import('twilio')).default
        const client = twilioClient(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        )

        // Format phone number for Twilio (must be E.164 format)
        let phoneNumber = lead.phone.replace(/\D/g, '')
        if (phoneNumber.length === 10) {
          phoneNumber = '+1' + phoneNumber
        } else if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+' + phoneNumber
        }

        smsResult = await client.messages.create({
          body: `Hi ${lead.name ? lead.name.split(' ')[0] : 'there'}! Your VPP Texas consultation is confirmed for ${formatAppointmentShort()}. A solar specialist will call you then. Questions? Call (254) 410-4104. - VPP Texas`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        })
      } catch (smsError) {
        console.error('SMS error:', smsError)
        // Don't fail the whole function if SMS fails
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        salesEmailId: salesResult.messageId,
        customerEmailId: customerResult?.messageId,
        smsId: smsResult?.sid
      })
    }

  } catch (error) {
    console.error('Email function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
