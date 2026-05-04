const PRIMARY = '#F97316'
const SECONDARY = '#1E3A5F'
const LIGHT_BG = '#f3f4f6'
const BORDER = '#e5e7eb'
const TEXT_GRAY = '#6b7280'
const TEXT_DARK = '#111827'

function baseLayout(header: string, body: string, footer?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:${LIGHT_BG};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};padding:40px 16px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        ${header}
        ${body}
        <tr>
          <td style="background:#f8fafc;padding:24px 32px;text-align:center;border-top:1px solid ${BORDER};">
            ${footer ?? `<p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">© ${new Date().getFullYear()} Rukey Cleaning · rukeycleaning.com.au</p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">ABN available on request · Professional Facility Services</p>`}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function orangeHeader(tag: string, title: string) {
  return `<tr>
    <td style="background:${PRIMARY};padding:28px 32px;">
      <p style="color:rgba(255,255,255,0.75);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">${tag}</p>
      <h1 style="color:white;font-size:22px;font-weight:900;margin:0;">${title}</h1>
    </td>
  </tr>`
}

function navyHeader(title: string, subtitle: string) {
  return `<tr>
    <td style="background:${SECONDARY};padding:32px;text-align:center;">
      <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 6px;">Rukey Cleaning</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">Professional Facility Services</p>
      <div style="width:48px;height:3px;background:${PRIMARY};margin:16px auto 0;border-radius:2px;"></div>
      <h2 style="color:white;font-size:18px;font-weight:700;margin:16px 0 0;">${title}</h2>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">${subtitle}</p>
    </td>
  </tr>`
}

function fieldRow(label: string, value: string | null | undefined) {
  if (!value) return ''
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:${TEXT_GRAY};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:140px;vertical-align:top;padding-top:1px;">${label}</td>
          <td style="color:${TEXT_DARK};font-size:14px;font-weight:500;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`
}

function ctaButton(text: string, href: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin-top:24px;">
    <tr>
      <td style="background:${PRIMARY};border-radius:8px;padding:12px 28px;">
        <a href="${href}" style="color:white;font-size:14px;font-weight:700;text-decoration:none;">${text}</a>
      </td>
    </tr>
  </table>`
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
  const header = orangeHeader('New Enquiry', `Quote Request from ${data.name}`)

  const body = `<tr>
    <td style="background:white;padding:32px;">
      <p style="color:${TEXT_GRAY};font-size:14px;margin:0 0 20px;">A new quote request has been submitted via the website. Review the details below and follow up within one business day.</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:8px;"><p style="color:${SECONDARY};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0;">Contact Details</p></td></tr>
        ${fieldRow('Name', data.name)}
        ${fieldRow('Phone', data.phone)}
        ${fieldRow('Email', data.email)}
        <tr><td style="padding-top:20px;padding-bottom:8px;"><p style="color:${SECONDARY};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0;">Facility Details</p></td></tr>
        ${fieldRow('Service', data.service)}
        ${fieldRow('Facility Size', data.facilitySize)}
        ${fieldRow('Frequency', data.frequency)}
        ${fieldRow('Address', data.address)}
        ${data.message ? fieldRow('Notes', data.message) : ''}
      </table>
      ${ctaButton('View in Admin Panel', 'https://rukeycleaning.com.au/admin/quotes')}
    </td>
  </tr>`

  return baseLayout(header, body)
}

// ─── Quote: Customer Confirmation ─────────────────────────────────────────────

export function quoteConfirmationEmail(data: QuoteData): string {
  const header = navyHeader('Quote Request Received', "We'll be in touch within one business day")

  const body = `<tr>
    <td style="background:white;padding:32px;">
      <p style="color:${TEXT_DARK};font-size:15px;margin:0 0 8px;">Hi <strong>${data.name}</strong>,</p>
      <p style="color:${TEXT_GRAY};font-size:14px;line-height:1.7;margin:0 0 24px;">
        Thank you for reaching out to Rukey Cleaning. We've received your quote request and our team will review your requirements and get back to you with a tailored proposal.
      </p>

      <div style="background:#f8fafc;border-left:4px solid ${PRIMARY};border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:24px;">
        <p style="color:${SECONDARY};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Your Request Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${fieldRow('Service', data.service)}
          ${fieldRow('Facility Size', data.facilitySize)}
          ${fieldRow('Frequency', data.frequency)}
          ${fieldRow('Address', data.address)}
        </table>
      </div>

      <p style="color:${TEXT_GRAY};font-size:14px;line-height:1.7;margin:0 0 24px;">
        In the meantime, if you have any questions or need to update your requirements, don't hesitate to reach out directly.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:8px 16px;">
            <p style="color:${TEXT_GRAY};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Phone</p>
            <p style="color:${SECONDARY};font-size:14px;font-weight:600;margin:0;">1300 565 576</p>
          </td>
          <td style="padding:8px 16px;border-left:1px solid ${BORDER};">
            <p style="color:${TEXT_GRAY};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Email</p>
            <p style="color:${PRIMARY};font-size:14px;font-weight:600;margin:0;">info@rukeycleaning.com.au</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`

  return baseLayout(header, body)
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
  const header = orangeHeader('New Message', `Contact Message from ${data.name}`)

  const body = `<tr>
    <td style="background:white;padding:32px;">
      <p style="color:${TEXT_GRAY};font-size:14px;margin:0 0 20px;">A new contact message has been submitted via the website homepage.</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${fieldRow('Name', data.name)}
        ${fieldRow('Phone', data.phone)}
        ${fieldRow('Email', data.email)}
        ${fieldRow('Service', data.service)}
        ${data.message ? `<tr><td style="padding-top:16px;">
          <p style="color:${SECONDARY};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Message</p>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;color:${TEXT_DARK};font-size:14px;line-height:1.7;">${data.message}</div>
        </td></tr>` : ''}
      </table>
      ${ctaButton('View in Admin Panel', 'https://rukeycleaning.com.au/admin/messages')}
    </td>
  </tr>`

  return baseLayout(header, body)
}

// ─── Contact: Customer Confirmation ───────────────────────────────────────────

export function contactConfirmationEmail(data: ContactData): string {
  const header = navyHeader('Message Received', "We'll get back to you within one business day")

  const body = `<tr>
    <td style="background:white;padding:32px;">
      <p style="color:${TEXT_DARK};font-size:15px;margin:0 0 8px;">Hi <strong>${data.name}</strong>,</p>
      <p style="color:${TEXT_GRAY};font-size:14px;line-height:1.7;margin:0 0 24px;">
        Thank you for contacting Rukey Cleaning. We've received your message and a member of our team will be in touch shortly.
      </p>

      ${data.message ? `<div style="background:#f8fafc;border-left:4px solid ${PRIMARY};border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:24px;">
        <p style="color:${SECONDARY};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Message</p>
        <p style="color:${TEXT_DARK};font-size:14px;line-height:1.7;margin:0;">${data.message}</p>
      </div>` : ''}

      <p style="color:${TEXT_GRAY};font-size:14px;line-height:1.7;margin:0 0 24px;">
        If your enquiry is urgent, please don't hesitate to call us directly.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:8px 16px;">
            <p style="color:${TEXT_GRAY};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Phone</p>
            <p style="color:${SECONDARY};font-size:14px;font-weight:600;margin:0;">1300 565 576</p>
          </td>
          <td style="padding:8px 16px;border-left:1px solid ${BORDER};">
            <p style="color:${TEXT_GRAY};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Email</p>
            <p style="color:${PRIMARY};font-size:14px;font-weight:600;margin:0;">info@rukeycleaning.com.au</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`

  return baseLayout(header, body)
}
