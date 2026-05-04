import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactAdminEmail, contactConfirmationEmail, type ContactData } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Rukey Cleaning <noreply@rukeycleaning.com.au>'
const ADMIN = process.env.ADMIN_EMAIL ?? 'rukey.cleaning@gmail.com'

export async function POST(req: Request) {
  try {
    const data: ContactData = await req.json()

    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New Contact Message from ${data.name}`,
      html: contactAdminEmail(data),
    })

    if (data.email) {
      await resend.emails.send({
        from: FROM,
        replyTo: 'info@rukeycleaning.com.au',
        to: data.email,
        subject: 'Thanks for contacting Rukey Cleaning',
        html: contactConfirmationEmail(data),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-contact-email error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
