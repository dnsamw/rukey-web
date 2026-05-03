// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import AdminShell from '@/components/admin/layout/AdminShell'

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) redirect('/admin/login')

//   return <AdminShell>{children}</AdminShell>
// }

import ThemeInjector from "@/components/ThemeInjector";
import { getSiteSettings } from "@/lib/data/fetchers";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <ThemeInjector theme={settings.theme} />
      {children}
    </>
  );
}