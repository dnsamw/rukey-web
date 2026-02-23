"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = { onMenuClick: () => void };

export default function AdminHeader({ onMenuClick }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-sm font-bold text-gray-800">Content Manager</h1>
          <p className="text-xs text-gray-400">Manage your website content</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#F97316] transition-colors font-medium"
        >
          <ExternalLink size={13} />
          View Site
        </a>
        <div className="h-5 w-px bg-gray-200" />
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
