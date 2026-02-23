import Navbar from '@/components/public/layout/Navbar'
import Footer from '@/components/public/layout/Footer'
import { getSiteSettings } from '@/lib/data/fetchers'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  )
}