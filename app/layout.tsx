import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://rukey.com.au'),
  title: {
    default: 'Rukey Facility Services | Professional Cleaning Australia',
    template: '%s | Rukey Facility Services',
  },
  description:
    'Professional facility cleaning services across Australia. Office, school, medical, gym, retail and industrial cleaning. Get a free quote today.',
  keywords: [
    'cleaning services australia',
    'commercial cleaning melbourne',
    'facility management victoria',
    'office cleaning',
    'school cleaning',
    'medical cleaning',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Rukey Facility Services',
    title: 'Rukey Facility Services | Professional Cleaning Australia',
    description: 'Professional facility cleaning services across Australia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukey Facility Services',
    description: 'Professional facility cleaning services across Australia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}