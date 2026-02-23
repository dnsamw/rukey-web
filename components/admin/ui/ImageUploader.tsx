'use client'

import { useState, useRef } from 'react'
import { Upload, X, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Image' }: Props) {
  const [tab, setTab] = useState<'url' | 'upload'>('url')
  const [urlInput, setUrlInput] = useState(value)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUrlApply = () => onChange(urlInput)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await res.json()
      onChange(url)
      setUrlInput(url)
    } catch {
      alert('Upload failed. Please try a URL instead.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-[#1E3A5F] mb-2">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-gray-100">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            onClick={() => { onChange(''); setUrlInput('') }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-3">
        {[
          { key: 'url', label: 'URL', icon: LinkIcon },
          { key: 'upload', label: 'Upload File', icon: Upload },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key as 'url' | 'upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === key ? 'bg-white text-[#1E3A5F] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === 'url' ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="px-4 py-2.5 bg-[#1E3A5F] text-white text-xs font-semibold rounded-xl hover:bg-[#F97316] transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#F97316] hover:bg-orange-50 transition-all text-gray-400 hover:text-[#F97316] disabled:opacity-60"
          >
            <Upload size={22} />
            <span className="text-xs font-medium">
              {uploading ? 'Uploading...' : 'Click to upload an image'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}