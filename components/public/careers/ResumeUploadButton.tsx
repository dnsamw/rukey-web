'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Upload, CheckCircle, AlertCircle, ArrowRight, Paperclip } from 'lucide-react'

type Props = {
  jobTitle?: string
  toEmail: string
  label: string
  variant?: 'primary' | 'secondary'
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ResumeUploadButton({ jobTitle, toEmail, label, variant = 'primary' }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleClose = () => {
    if (status === 'submitting') return
    setOpen(false)
    setStatus('idle')
    setErrorMsg('')
    setFile(null)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setErrorMsg('Please attach your resume.'); return }

    setStatus('submitting')
    setErrorMsg('')

    const data = new FormData()
    data.append('name', form.name)
    data.append('email', form.email)
    data.append('phone', form.phone)
    data.append('message', form.message)
    data.append('job_title', jobTitle ?? '')
    data.append('to_email', toEmail)
    data.append('resume', file)

    try {
      const res = await fetch('/api/send-resume', { method: 'POST', body: data })
      const json = await res.json()
      if (json.ok) {
        setStatus('success')
      } else {
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  const btnClass =
    variant === 'secondary'
      ? 'inline-flex items-center gap-2 bg-[var(--color-secondary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-primary)] transition-colors shrink-0'
      : 'inline-block bg-[var(--color-primary)] text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors'

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all'
  const labelClass = 'block text-xs font-semibold text-[var(--color-secondary)] mb-1.5'

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnClass}>
        {label} {variant === 'secondary' && <ArrowRight size={14} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-bold text-[var(--color-secondary)] text-base">
                  {jobTitle ? `Apply — ${jobTitle}` : 'Send Your Resume'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">PDF or Word document, max 10 MB</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <CheckCircle size={48} className="text-emerald-500" />
                  <h4 className="font-bold text-[var(--color-secondary)] text-lg">Resume Sent!</h4>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Thanks, we&apos;ll review your application and be in touch soon.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                      <input
                        required
                        className={inputClass}
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                      <input
                        required
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone (optional)</label>
                    <input
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+61 4xx xxx xxx"
                    />
                  </div>

                  {/* File drop zone */}
                  <div>
                    <label className={labelClass}>Resume <span className="text-red-400">*</span></label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                        file
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                          : 'border-gray-200 hover:border-[var(--color-primary)]/50 hover:bg-gray-50'
                      }`}
                    >
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-secondary)] font-semibold">
                          <Paperclip size={16} className="text-[var(--color-primary)]" />
                          {file.name}
                          <span className="text-gray-400 font-normal">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Upload size={24} />
                          <span className="text-sm">Drop your file here or <span className="text-[var(--color-primary)] font-semibold">browse</span></span>
                          <span className="text-xs">PDF, DOC, DOCX — max 10 MB</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Message (optional)</label>
                    <textarea
                      rows={3}
                      className={`${inputClass} resize-none`}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  {(status === 'error' || errorMsg) && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
                      <AlertCircle size={16} className="shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60 transition-colors"
                    >
                      {status === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
