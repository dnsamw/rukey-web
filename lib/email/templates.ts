const PRIMARY    = '#00ABC2'
const SECONDARY  = '#0C1E27'
const ACCENT     = '#225067'
const TEXT       = '#111827'
const MUTED      = '#6B7280'
const BORDER     = '#E5E7EB'
const LIGHT_BG   = '#F3F4F6'
const LOGO_WHITE = 'https://rukeycleaning.com.au/rukey-logo-white.png'

// ─── Shared layout ────────────────────────────────────────────────────────────

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Rukey Cleaning</title>
</head>
<body style="margin:0;padding:0;background:${LIGHT_BG};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
        ${content}
        <!-- Footer -->
        <tr>
          <td style="background:${SECONDARY};border-radius:0 0 16px 16px;padding:28px 32px;text-align:center;">
            <img src="${LOGO_WHITE}" alt="Rukey Cleaning" width="130" height="auto" style="display:block;margin:0 auto 16px;border:0;" />
            <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 6px;letter-spacing:0.5px;">Professional Cleaning and Facility Services · Australia</p>
            <p style="margin:0;">
              <a href="https://rukeycleaning.com.au" style="color:${PRIMARY};font-size:11px;text-decoration:none;">rukeycleaning.com.au</a>
              <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
              <a href="tel:1300565576" style="color:rgba(255,255,255,0.4);font-size:11px;text-decoration:none;">1300 565 576</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Shared header (dark with white logo + teal stripe) ───────────────────────

function darkHeader(): string {
  return `<tr>
    <td style="background:${SECONDARY};border-radius:16px 16px 0 0;padding:28px 32px 0;text-align:center;">
      <img src="${LOGO_WHITE}" alt="Rukey Cleaning" width="160" height="auto" style="display:block;margin:0 auto;border:0;" />
    </td>
  </tr>
  <tr>
    <td style="background:${SECONDARY};padding:0 0 0;">
      <div style="height:4px;background:${PRIMARY};"></div>
    </td>
  </tr>`
}

// ─── Field row ────────────────────────────────────────────────────────────────

function field(label: string, value: string | null | undefined): string {
  if (!value) return ''
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:130px;vertical-align:top;padding-top:1px;">
            <span style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${label}</span>
          </td>
          <td>
            <span style="color:${TEXT};font-size:14px;font-weight:500;line-height:1.5;">${value}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

function sectionLabel(text: string): string {
  return `<tr>
    <td style="padding:20px 0 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-bottom:2px solid ${PRIMARY};padding-bottom:6px;">
            <span style="color:${ACCENT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">${text}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

function ctaButton(text: string, href: string): string {
  return `<tr>
    <td style="padding-top:28px;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${PRIMARY};border-radius:8px;">
            <a href="${href}" style="display:inline-block;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 28px;letter-spacing:0.3px;">
              ${text} →
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ─── Quote: Admin Notification ────────────────────────────────────────────────

export type QuoteData = {
  name: string
  phone: string
  email?: string | null
  service?: string | null
  facilitySize?: string | null
  frequency?: string | null
  address?: string | null
  message?: string | null
}

export function quoteAdminEmail(data: QuoteData): string {
  const body = `
    <!-- Alert banner -->
    <tr>
      <td style="background:white;padding:28px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:${PRIMARY}15;border-left:4px solid ${PRIMARY};border-radius:0 8px 8px 0;padding:14px 18px;">
              <p style="color:${PRIMARY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 3px;">New Quote Request</p>
              <p style="color:${TEXT};font-size:16px;font-weight:700;margin:0;">From: ${data.name}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Fields -->
    <tr>
      <td style="background:white;padding:0 32px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${sectionLabel('Contact Details')}
          ${field('Name', data.name)}
          ${field('Phone', data.phone)}
          ${field('Email', data.email)}
          ${sectionLabel('Facility Details')}
          ${field('Service', data.service)}
          ${field('Facility Size', data.facilitySize)}
          ${field('Frequency', data.frequency)}
          ${field('Address', data.address)}
          ${data.message ? `${sectionLabel('Additional Notes')}
          <tr><td style="padding:10px 0;">
            <div style="background:${LIGHT_BG};border-radius:8px;padding:14px 16px;color:${TEXT};font-size:14px;line-height:1.7;">${data.message}</div>
          </td></tr>` : ''}
          ${ctaButton('View in Admin Panel', 'https://rukeycleaning.com.au/admin/quotes')}
        </table>
      </td>
    </tr>`

  return layout(`${darkHeader()}${body}`)
}

// ─── Quote: Customer Confirmation ─────────────────────────────────────────────

export function quoteConfirmationEmail(data: QuoteData): string {
  const summaryFields = [
    data.service       ? `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:130px;"><span style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Service</span></td><td><span style="color:${TEXT};font-size:13px;font-weight:500;">${data.service}</span></td></tr></table></td></tr>` : '',
    data.facilitySize  ? `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:130px;"><span style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Facility Size</span></td><td><span style="color:${TEXT};font-size:13px;font-weight:500;">${data.facilitySize}</span></td></tr></table></td></tr>` : '',
    data.frequency     ? `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:130px;"><span style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Frequency</span></td><td><span style="color:${TEXT};font-size:13px;font-weight:500;">${data.frequency}</span></td></tr></table></td></tr>` : '',
    data.address       ? `<tr><td style="padding:8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:130px;"><span style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Address</span></td><td><span style="color:${TEXT};font-size:13px;font-weight:500;">${data.address}</span></td></tr></table></td></tr>` : '',
  ].filter(Boolean).join('')

  const body = `
    <!-- Success icon -->
    <tr>
      <td style="background:white;padding:36px 32px 24px;text-align:center;">
        <div style="display:inline-block;width:64px;height:64px;background:${PRIMARY};border-radius:50%;">
          <table role="presentation" width="64" height="64" cellpadding="0" cellspacing="0">
            <tr><td align="center" valign="middle">
              <span style="color:white;font-size:28px;font-weight:900;line-height:1;">&#10003;</span>
            </td></tr>
          </table>
        </div>
        <h1 style="color:${SECONDARY};font-size:22px;font-weight:900;margin:16px 0 6px;">Request Received!</h1>
        <p style="color:${MUTED};font-size:14px;margin:0;">We'll be in touch within one business day.</p>
      </td>
    </tr>
    <!-- Message -->
    <tr>
      <td style="background:white;padding:0 32px 24px;">
        <p style="color:${TEXT};font-size:15px;margin:0 0 6px;">Hi <strong>${data.name}</strong>,</p>
        <p style="color:${MUTED};font-size:14px;line-height:1.75;margin:0;">
          Thank you for reaching out to Rukey Cleaning. We've received your quote request and our team will review your requirements and prepare a tailored proposal for you.
        </p>
      </td>
    </tr>
    ${summaryFields ? `<!-- Summary card -->
    <tr>
      <td style="background:white;padding:0 32px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};border-radius:10px;border-left:4px solid ${PRIMARY};overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="color:${ACCENT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 12px;">Your Request Summary</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${summaryFields}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''}
    <!-- Contact info -->
    <tr>
      <td style="background:white;padding:0 32px 36px;">
        <p style="color:${MUTED};font-size:13px;line-height:1.7;margin:0 0 16px;">If you need to reach us in the meantime, we're always happy to help:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-right:1px solid ${BORDER};width:50%;">
              <p style="color:${MUTED};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px;">Phone</p>
              <a href="tel:1300565576" style="color:${SECONDARY};font-size:15px;font-weight:700;text-decoration:none;">1300 565 576</a>
            </td>
            <td style="padding:16px 20px;width:50%;">
              <p style="color:${MUTED};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px;">Email</p>
              <a href="mailto:info@rukeycleaning.com.au" style="color:${PRIMARY};font-size:14px;font-weight:700;text-decoration:none;">info@rukeycleaning.com.au</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`

  return layout(`${darkHeader()}${body}`)
}

// ─── Contact: Admin Notification ──────────────────────────────────────────────

export type ContactData = {
  name: string
  phone: string
  email?: string | null
  service?: string | null
  message?: string | null
}

export function contactAdminEmail(data: ContactData): string {
  const body = `
    <!-- Alert banner -->
    <tr>
      <td style="background:white;padding:28px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:${PRIMARY}15;border-left:4px solid ${PRIMARY};border-radius:0 8px 8px 0;padding:14px 18px;">
              <p style="color:${PRIMARY};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 3px;">New Contact Message</p>
              <p style="color:${TEXT};font-size:16px;font-weight:700;margin:0;">From: ${data.name}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Fields -->
    <tr>
      <td style="background:white;padding:0 32px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${sectionLabel('Contact Details')}
          ${field('Name', data.name)}
          ${field('Phone', data.phone)}
          ${field('Email', data.email)}
          ${field('Service', data.service)}
          ${data.message ? `${sectionLabel('Message')}
          <tr><td style="padding:10px 0;">
            <div style="background:${LIGHT_BG};border-radius:8px;padding:14px 16px;color:${TEXT};font-size:14px;line-height:1.7;">${data.message}</div>
          </td></tr>` : ''}
          ${ctaButton('View in Admin Panel', 'https://rukeycleaning.com.au/admin/messages')}
        </table>
      </td>
    </tr>`

  return layout(`${darkHeader()}${body}`)
}

// ─── Contact: Customer Confirmation ───────────────────────────────────────────

export function contactConfirmationEmail(data: ContactData): string {
  const body = `
    <!-- Success icon -->
    <tr>
      <td style="background:white;padding:36px 32px 24px;text-align:center;">
        <div style="display:inline-block;width:64px;height:64px;background:${PRIMARY};border-radius:50%;">
          <table role="presentation" width="64" height="64" cellpadding="0" cellspacing="0">
            <tr><td align="center" valign="middle">
              <span style="color:white;font-size:28px;font-weight:900;line-height:1;">&#10003;</span>
            </td></tr>
          </table>
        </div>
        <h1 style="color:${SECONDARY};font-size:22px;font-weight:900;margin:16px 0 6px;">Message Sent!</h1>
        <p style="color:${MUTED};font-size:14px;margin:0;">We'll get back to you within one business day.</p>
      </td>
    </tr>
    <!-- Message -->
    <tr>
      <td style="background:white;padding:0 32px 24px;">
        <p style="color:${TEXT};font-size:15px;margin:0 0 6px;">Hi <strong>${data.name}</strong>,</p>
        <p style="color:${MUTED};font-size:14px;line-height:1.75;margin:0;">
          Thank you for contacting Rukey Cleaning. We've received your message and a member of our team will be in touch with you shortly.
        </p>
      </td>
    </tr>
    ${data.message ? `<!-- Their message -->
    <tr>
      <td style="background:white;padding:0 32px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};border-radius:10px;border-left:4px solid ${PRIMARY};overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="color:${ACCENT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px;">Your Message</p>
              <p style="color:${TEXT};font-size:14px;line-height:1.7;margin:0;">${data.message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''}
    <!-- Contact info -->
    <tr>
      <td style="background:white;padding:0 32px 36px;">
        <p style="color:${MUTED};font-size:13px;line-height:1.7;margin:0 0 16px;">For urgent enquiries, don't hesitate to reach us directly:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-right:1px solid ${BORDER};width:50%;">
              <p style="color:${MUTED};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px;">Phone</p>
              <a href="tel:1300565576" style="color:${SECONDARY};font-size:15px;font-weight:700;text-decoration:none;">1300 565 576</a>
            </td>
            <td style="padding:16px 20px;width:50%;">
              <p style="color:${MUTED};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px;">Email</p>
              <a href="mailto:info@rukeycleaning.com.au" style="color:${PRIMARY};font-size:14px;font-weight:700;text-decoration:none;">info@rukeycleaning.com.au</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`

  return layout(`${darkHeader()}${body}`)
}
