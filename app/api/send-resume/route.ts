import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Rukey Cleaning <noreply@rukeycleaning.com.au>'
const ADMIN = process.env.ADMIN_EMAIL ?? 'rukey.cleaning@gmail.com'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const name = (form.get('name') as string | null)?.trim() ?? ''
    const email = (form.get('email') as string | null)?.trim() ?? ''
    const phone = (form.get('phone') as string | null)?.trim() ?? ''
    const jobTitle = (form.get('job_title') as string | null)?.trim() ?? ''
    const message = (form.get('message') as string | null)?.trim() ?? ''
    const file = form.get('resume') as File | null

    if (!name || !email || !file) {
      return NextResponse.json({ ok: false, error: 'Name, email and resume are required.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ ok: false, error: 'Only PDF and Word documents are accepted.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: 'File must be under 10 MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const toEmail = (form.get('to_email') as string | null)?.trim() || ADMIN

    await resend.emails.send({
      from: FROM,
      to: toEmail,
      replyTo: email,
      subject: jobTitle
        ? `Resume Application — ${jobTitle} — ${name}`
        : `Resume Submission from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#1E3A5F;margin-bottom:4px">New Resume Submission</h2>
          ${jobTitle ? `<p style="color:#F97316;font-weight:600;margin:0 0 20px">Applying for: ${jobTitle}</p>` : ''}
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#555;width:120px">Name</td><td style="padding:8px 0;font-weight:600;color:#1E3A5F">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555">Email</td><td style="padding:8px 0;color:#1E3A5F">${email}</td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#555">Phone</td><td style="padding:8px 0;color:#1E3A5F">${phone}</td></tr>` : ''}
            ${message ? `<tr><td style="padding:8px 0;color:#555;vertical-align:top">Message</td><td style="padding:8px 0;color:#1E3A5F">${message}</td></tr>` : ''}
          </table>
          <p style="font-size:12px;color:#888;margin-top:24px">Resume attached. Reply to this email to respond to the applicant.</p>
        </div>
      `,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-resume error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send. Please try again.' }, { status: 500 })
  }
}
