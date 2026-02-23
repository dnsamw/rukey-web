"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminShell from "@/components/admin/layout/AdminShell";
import PageHeader from "@/components/admin/ui/PageHeader";
import Toast from "@/components/admin/ui/Toast";
import { Plus, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [theme, setTheme] = useState({
    primary: "#00ABC2",
    primary_dark: "#EA6C0A",
    secondary: "#1E3A5F",
    secondary_dark: "#162d4a",
  });

  const [general, setGeneral] = useState({
    company_name: "",
    tagline: "",
    phone: "",
    email: "",
    abn: "",
  });

  const [addresses, setAddresses] = useState<
    { area: string; address: string }[]
  >([]);
  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (!data) return;

      data.forEach((row) => {
        if (row.key === "theme") setTheme(row.value);
        if (row.key === "general") setGeneral(row.value);
        if (row.key === "addresses") setAddresses(row.value);
        if (row.key === "social") setSocial(row.value);
      });
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const updates = [
      { key: "general", value: general },
      { key: "addresses", value: addresses },
      { key: "social", value: social },
      { key: "theme", value: theme },
    ];

    const errors = await Promise.all(
      updates.map(({ key, value }) =>
        supabase
          .from("site_settings")
          .update({ value, updated_at: new Date().toISOString() })
          .eq("key", key),
      ),
    );

    const hasError = errors.some((r) => r.error);
    // Trigger ISR revalidation so public site updates immediately
    if (!hasError) {
      await fetch("/api/revalidate", { method: "POST" });
    }
    setSaving(false);
    setToast(
      hasError
        ? { message: "Failed to save some settings.", type: "error" }
        : { message: "Settings saved successfully!", type: "success" },
    );
  };

  const addAddress = () =>
    setAddresses((p) => [...p, { area: "", address: "" }]);
  const removeAddress = (i: number) =>
    setAddresses((p) => p.filter((_, idx) => idx !== i));
  const updateAddress = (i: number, field: "area" | "address", value: string) =>
    setAddresses((p) =>
      p.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    );

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all";
  const labelClass =
    "block text-xs font-semibold text-[var(--color-secondary)] mb-1.5";
  const sectionClass =
    "bg-white rounded-2xl border border-gray-100 shadow-sm p-6";

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Site Settings"
          subtitle="Update your business information displayed across the website."
          action={
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          }
        />

        {/* General */}
        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">
            General Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={labelClass}>Company Name</label>
              <input
                className={inputClass}
                value={general.company_name}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, company_name: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Tagline</label>
              <input
                className={inputClass}
                value={general.tagline}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, tagline: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                className={inputClass}
                value={general.phone}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                className={inputClass}
                type="email"
                value={general.email}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>ABN</label>
              <input
                className={inputClass}
                value={general.abn}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, abn: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Office Addresses */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">
              Office Locations
            </h2>
            <button
              onClick={addAddress}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={14} /> Add Location
            </button>
          </div>
          <div className="space-y-4">
            {addresses.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className={labelClass}>Area Name</label>
                    <input
                      className={inputClass}
                      placeholder="e.g. Braeside"
                      value={a.area}
                      onChange={(e) => updateAddress(i, "area", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Full Address</label>
                    <input
                      className={inputClass}
                      placeholder="17 Example St, VIC 3000"
                      value={a.address}
                      onChange={(e) =>
                        updateAddress(i, "address", e.target.value)
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeAddress(i)}
                  className="mt-6 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {!addresses.length && (
              <p className="text-gray-400 text-sm text-center py-4">
                No office locations yet.
              </p>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">
            Social Media Links
          </h2>
          <div className="space-y-4">
            {[
              { key: "facebook", label: "Facebook URL" },
              { key: "instagram", label: "Instagram URL" },
              { key: "linkedin", label: "LinkedIn URL" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={inputClass}
                  placeholder={`https://${key}.com/...`}
                  value={social[key as keyof typeof social]}
                  onChange={(e) =>
                    setSocial((p) => ({ ...p, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Brand Colors */}
<div className={sectionClass}>
  <div className="flex items-start justify-between mb-2">
    <div>
      <h2 className="font-bold text-[#1E3A5F]">Brand Colors</h2>
      <p className="text-gray-400 text-xs mt-1">
        Changes apply to the entire site instantly after saving.
      </p>
    </div>
    {/* Mini live preview badge */}
    <div className="flex gap-2 shrink-0">
      {[theme.secondary, theme.primary, theme.primary_dark].map((color, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full border-2 border-white shadow"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
    {[
      {
        key: 'primary',
        label: 'Primary Color',
        hint: 'Buttons, accents, icons, highlights',
      },
      {
        key: 'primary_dark',
        label: 'Primary Hover',
        hint: 'Hover/active state — slightly darker than primary',
      },
      {
        key: 'secondary',
        label: 'Secondary Color',
        hint: 'Navbar, footer, headings, dark backgrounds',
      },
      {
        key: 'secondary_dark',
        label: 'Secondary Hover',
        hint: 'Hover state for secondary elements',
      },
    ].map(({ key, label, hint }) => (
      <div key={key}>
        <label className={labelClass}>{label}</label>
        <p className="text-gray-400 text-xs mb-3">{hint}</p>
        <div className="flex items-center gap-3">
          {/* Color wheel picker */}
          <label className="relative cursor-pointer shrink-0">
            <div
              className="w-12 h-12 rounded-xl border-2 border-gray-200 shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: theme[key as keyof typeof theme] }}
            />
            <input
              type="color"
              value={theme[key as keyof typeof theme]}
              onChange={(e) =>
                setTheme((p) => ({ ...p, [key]: e.target.value }))
              }
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Hex text input */}
          <input
            type="text"
            value={theme[key as keyof typeof theme].toUpperCase()}
            onChange={(e) => {
              const val = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                setTheme((p) => ({ ...p, [key]: val }))
              }
            }}
            className={`${inputClass} font-mono text-sm w-36`}
            placeholder="#000000"
            maxLength={7}
          />

          {/* Reset to default */}
          <button
            type="button"
            onClick={() => {
              const defaults: Record<string, string> = {
                primary: '#00ABC2',
                primary_dark: '#EA6C0A',
                secondary: '#1E3A5F',
                secondary_dark: '#162d4a',
              }
              setTheme((p) => ({ ...p, [key]: defaults[key] }))
            }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Live preview bar */}
  <div className="mt-8 space-y-2">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Live Preview
    </p>
    <div className="flex rounded-xl overflow-hidden shadow-md h-14">
      <div
        className="flex-1 flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: theme.secondary }}
      >
        Navbar / Footer
      </div>
      <div
        className="flex-1 flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: theme.primary }}
      >
        Buttons / Icons
      </div>
      <div
        className="flex-1 flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: theme.primary_dark }}
      >
        Hover States
      </div>
      <div
        className="flex-1 flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: theme.secondary_dark }}
      >
        Dark Accents
      </div>
    </div>

    {/* Sample button preview */}
    <div className="flex items-center gap-3 pt-3">
      <button
        className="px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-md transition-all"
        style={{ backgroundColor: theme.primary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.primary_dark)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.primary)}
      >
        Sample Button
      </button>
      <button
        className="px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-md"
        style={{ backgroundColor: theme.secondary }}
      >
        Sample Nav Item
      </button>
      <div
        className="px-3 py-1 rounded-full text-white text-xs font-bold"
        style={{ backgroundColor: theme.primary }}
      >
        Badge
      </div>
    </div>
  </div>
</div>

        {/* Save button (bottom) */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminShell>
  );
}
