'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'

const offices = [
  { area: 'Braeside', address: '17 Citrus Street Braeside, VIC 3195' },
  { area: 'Traralgon', address: '8 Baystone Court Traralgon, VIC 3844' },
  { area: 'Red Cliffs', address: '6 Ella-mae Court Red Cliffs, VIC 3496' },
  { area: 'Wodonga', address: '203 Mckoy Street Wodonga, VIC 3690' },
]

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Wire to Supabase in admin step — simulate for now
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          label="Contact Us"
          title="Get In Touch"
          subtitle="Have a question or ready to get started? Reach out and our friendly team will get back to you within one business day."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={20} className="text-[#F97316]" />
              </div>
              <div>
                <div className="font-bold text-[#1E3A5F] text-sm mb-1">Phone</div>
                <a href="tel:1300565576" className="text-gray-500 hover:text-[#F97316] transition-colors text-sm">
                  1300 565 576
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={20} className="text-[#F97316]" />
              </div>
              <div>
                <div className="font-bold text-[#1E3A5F] text-sm mb-1">Email</div>
                <a href="mailto:info@cleanpro.com.au" className="text-gray-500 hover:text-[#F97316] transition-colors text-sm">
                  info@cleanpro.com.au
                </a>
              </div>
            </div>

            {/* Offices */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0 mt-1">
                <MapPin size={20} className="text-[#F97316]" />
              </div>
              <div>
                <div className="font-bold text-[#1E3A5F] text-sm mb-3">Our Offices</div>
                <ul className="space-y-2">
                  {offices.map((o) => (
                    <li key={o.area}>
                      <span className="text-[#F97316] font-semibold text-xs">{o.area} — </span>
                      <span className="text-gray-500 text-xs">{o.address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-[#1E3A5F] text-sm mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '7:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '8:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'By Appointment' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-500">{day}</span>
                    <span className="font-semibold text-[#1E3A5F]">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thanks for reaching out. Our team will get back to you within one business day.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }}
                  className="mt-6 text-[#F97316] text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-2xl p-8 space-y-5"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A5F] mb-1.5">
                      Full Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A5F] mb-1.5">
                      Email Address <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com.au"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A5F] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="04XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A5F] mb-1.5">
                      Service Required
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all"
                    >
                      <option value="">Select a service...</option>
                      <option>Office Cleaning</option>
                      <option>School & Education</option>
                      <option>Medical & Healthcare</option>
                      <option>Gym & Fitness</option>
                      <option>Council & Government</option>
                      <option>Retail & Commercial</option>
                      <option>Industrial</option>
                      <option>Window Cleaning</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A5F] mb-1.5">
                    Message <span className="text-[#F97316]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your facility and cleaning requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#F97316] text-white py-4 rounded-xl font-bold hover:bg-[#EA6C0A] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
