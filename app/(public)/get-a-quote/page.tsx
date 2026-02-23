"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const steps = ["Your Details", "Facility Info", "Confirm"];

export default function GetAQuotePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    facilitySize: "",
    frequency: "",
    address: "",
    message: "",
  });

  const update = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all";
  const labelClass = "block text-xs font-semibold text-[#1E3A5F] mb-1.5";

  const handleSubmit = async () => {
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("quote_requests").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      service: form.service || null,
      facility_size: form.facilitySize || null,
      frequency: form.frequency || null,
      address: form.address || null,
      message: form.message || null,
    });

    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      console.error("Quote form error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 shadow-md text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-[#1E3A5F] mb-3">
            Quote Request Received!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thanks {form.name}! Our team will review your requirements and get
            back to you within one business day with a tailored quote.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#F97316] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#EA6C0A] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1E3A5F] py-20 relative overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#F97316]/20 text-[#F97316] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Free & No Obligation
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get a Free Quote
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-base">
            Tell us about your facility and we'll build a custom cleaning
            program that fits your needs and budget.
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#F97316]">Get a Quote</span>
          </nav>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= step
                        ? "bg-[#F97316] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${i <= step ? "text-[#F97316]" : "text-gray-400"}`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-16 sm:w-24 mx-2 mb-4 transition-all ${i < step ? "bg-[#F97316]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Step 0 */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">
                  Your Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Full Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={update}
                      placeholder="John Smith"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={update}
                      placeholder="Acme Pty Ltd"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update}
                      placeholder="john@company.com.au"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={update}
                      placeholder="04XX XXX XXX"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(1)}
                    disabled={!form.name || !form.email}
                    className="bg-[#F97316] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#EA6C0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">
                  Facility Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Service Required <span className="text-[#F97316]">*</span>
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={update}
                      className={inputClass}
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
                  <div>
                    <label className={labelClass}>Facility Size</label>
                    <select
                      name="facilitySize"
                      value={form.facilitySize}
                      onChange={update}
                      className={inputClass}
                    >
                      <option value="">Select size...</option>
                      <option>Under 200 sqm</option>
                      <option>200 – 500 sqm</option>
                      <option>500 – 1000 sqm</option>
                      <option>1000 – 5000 sqm</option>
                      <option>5000+ sqm</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cleaning Frequency</label>
                    <select
                      name="frequency"
                      value={form.frequency}
                      onChange={update}
                      className={inputClass}
                    >
                      <option value="">Select frequency...</option>
                      <option>Daily</option>
                      <option>3x per week</option>
                      <option>Weekly</option>
                      <option>Fortnightly</option>
                      <option>One-off / Ad hoc</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Facility Address</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={update}
                      placeholder="123 Main St, Melbourne VIC"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update}
                    placeholder="Any specific requirements, access instructions, or questions..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(0)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!form.service}
                    className="bg-[#F97316] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#EA6C0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Quote →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Confirm */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">
                  Review & Submit
                </h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-8">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: form.phone || "—" },
                    { label: "Company", value: form.company || "—" },
                    { label: "Service", value: form.service || "—" },
                    { label: "Facility Size", value: form.facilitySize || "—" },
                    { label: "Frequency", value: form.frequency || "—" },
                    { label: "Address", value: form.address || "—" },
                    { label: "Notes", value: form.message || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-sm">
                      <span className="font-semibold text-[#1E3A5F] w-32 shrink-0">
                        {label}
                      </span>
                      <span className="text-gray-500">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-3 rounded-full font-bold hover:bg-[#EA6C0A] transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Submit Quote Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact fallback */}
          <div className="mt-8 text-center text-sm text-gray-400">
            Prefer to talk directly?{" "}
            <a
              href="tel:1300565576"
              className="text-[#F97316] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Phone size={13} /> 1300 565 576
            </a>{" "}
            or{" "}
            <a
              href="mailto:info@cleanpro.com.au"
              className="text-[#F97316] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Mail size={13} /> Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
