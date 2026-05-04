import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { quoteAdminEmail, quoteConfirmationEmail, type QuoteData } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Rukey Cleaning <noreply@rukeycleaning.com.au>'
const ADMIN = process.env.ADMIN_EMAIL ?? 'rukey.cleaning@gmail.com'

export async function POST(req: Request) {
  try {
    const data: QuoteData = await req.json()

    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New Quote Request from ${data.name}`,
      html: quoteAdminEmail(data),
    })

    if (data.email) {
      await resend.emails.send({
        from: FROM,
        replyTo: 'info@rukeycleaning.com.au',
        to: data.email,
        subject: "We've received your quote request — Rukey Cleaning",
        html: quoteConfirmationEmail(data),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-quote-email error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
