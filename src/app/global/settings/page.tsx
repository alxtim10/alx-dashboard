"use client"

import * as React from "react"
import { Save, Upload, X, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type SiteSettings = {
  // General
  companyName: string
  tagline: string
  email: string
  phone: string
  address: string

  // Branding
  logo: string
  favicon: string
  primaryColor: string

  // SEO
  metaTitle: string
  metaDescription: string
  ogImage: string

  // Analytics
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  headScripts: string
  bodyScripts: string

  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage: string
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialSettings: SiteSettings = {
  companyName: "PT Solusi Digital Indonesia",
  tagline: "We Build Solutions That Matter",
  email: "hello@company.com",
  phone: "+62 21 1234 5678",
  address: "Jl. Sudirman No. 123, Jakarta Pusat, 10220",

  logo: "/images/logo.png",
  favicon: "/images/favicon.png",
  primaryColor: "#1a56db",

  metaTitle: "PT Solusi Digital Indonesia - We Build Solutions That Matter",
  metaDescription: "Delivering innovative technology and consulting services to help your business grow across Southeast Asia.",
  ogImage: "/images/og-image.jpg",

  googleAnalyticsId: "",
  googleTagManagerId: "",
  facebookPixelId: "",
  headScripts: "",
  bodyScripts: "",

  maintenanceMode: false,
  maintenanceMessage: "We're currently performing scheduled maintenance. We'll be back shortly.",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ImageUploader({ label, hint, value, onChange, aspect = "wide" }: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  aspect?: "wide" | "square"
}) {
  return (
    <Field label={label} hint={hint}>
      <div className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border",
        "bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer",
        value ? "p-2" : "p-6"
      )}>
        {value ? (
          <div className="relative w-full">
            <div className={cn(
              "relative w-full overflow-hidden rounded-md bg-muted",
              aspect === "square" ? "h-20 w-20 mx-auto" : "h-24"
            )}>
              <Image src={value} alt="Preview" fill className="object-contain p-2" />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">Click to upload</p>
          </>
        )}
      </div>
    </Field>
  )
}

function ColorInput({ label, hint, value, onChange }: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#1a56db"
          className="font-mono text-sm"
        />
      </div>
    </Field>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const count = value.length
  const over = count > max
  return (
    <span className={cn("text-xs tabular-nums", over ? "text-destructive" : "text-muted-foreground")}>
      {count}/{max}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  const [settings, setSettings] = React.useState<SiteSettings>(initialSettings)

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    console.log("save settings", settings)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Site Settings</h1>
          <p className="text-xs text-muted-foreground">Global &rsaquo; Site Settings</p>
        </div>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full space-y-6">

        {/* Maintenance banner */}
        {settings.maintenanceMode && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Maintenance mode is active</p>
              <p className="text-xs text-amber-700 mt-0.5">Your site is currently hidden from visitors and showing the maintenance page.</p>
            </div>
          </div>
        )}

        {/* 1. General */}
        <Section title="General" description="Basic information about your company.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name" required>
              <Input
                placeholder="PT Solusi Digital Indonesia"
                value={settings.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
            </Field>
            <Field label="Tagline">
              <Input
                placeholder="We Build Solutions That Matter"
                value={settings.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                placeholder="hello@company.com"
                value={settings.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <Input
                placeholder="+62 21 1234 5678"
                value={settings.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Address">
            <Textarea
              placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
              value={settings.address}
              onChange={(e) => set("address", e.target.value)}
              rows={2}
            />
          </Field>
        </Section>

        {/* 2. Branding */}
        <Section title="Branding" description="Logo, favicon, and brand color used across the site.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ImageUploader
              label="Logo"
              hint="Recommended: SVG or PNG with transparent background."
              value={settings.logo}
              onChange={(v) => set("logo", v)}
              aspect="wide"
            />
            <ImageUploader
              label="Favicon"
              hint="Recommended: 32×32px or 64×64px PNG or ICO."
              value={settings.favicon}
              onChange={(v) => set("favicon", v)}
              aspect="square"
            />
          </div>
          <ColorInput
            label="Primary Color"
            hint="Used for buttons, links, and accents across the site."
            value={settings.primaryColor}
            onChange={(v) => set("primaryColor", v)}
          />
        </Section>

        {/* 3. SEO */}
        <Section
          title="SEO & Metadata"
          description="Default meta tags used when a page doesn't have its own SEO settings."
        >
          <Field label="Meta Title" hint="Recommended: 50–60 characters.">
            <Input
              placeholder="Company Name - Tagline"
              value={settings.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <CharCount value={settings.metaTitle} max={60} />
            </div>
          </Field>
          <Field label="Meta Description" hint="Recommended: 120–160 characters.">
            <Textarea
              placeholder="Delivering innovative technology and consulting services..."
              value={settings.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              rows={3}
            />
            <div className="flex justify-end mt-1">
              <CharCount value={settings.metaDescription} max={160} />
            </div>
          </Field>
          <ImageUploader
            label="OG Image"
            hint="Shown when sharing on social media. Recommended: 1200×630px."
            value={settings.ogImage}
            onChange={(v) => set("ogImage", v)}
            aspect="wide"
          />
        </Section>

        {/* 4. Analytics */}
        <Section
          title="Analytics & Scripts"
          description="Tracking IDs and custom scripts injected into the site."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Google Analytics" hint="Starts with G-">
              <Input
                placeholder="G-XXXXXXXXXX"
                value={settings.googleAnalyticsId}
                onChange={(e) => set("googleAnalyticsId", e.target.value)}
                className="font-mono text-sm"
              />
            </Field>
            <Field label="Google Tag Manager" hint="Starts with GTM-">
              <Input
                placeholder="GTM-XXXXXXX"
                value={settings.googleTagManagerId}
                onChange={(e) => set("googleTagManagerId", e.target.value)}
                className="font-mono text-sm"
              />
            </Field>
            <Field label="Facebook Pixel" hint="Numeric ID">
              <Input
                placeholder="XXXXXXXXXXXXXXXXXX"
                value={settings.facebookPixelId}
                onChange={(e) => set("facebookPixelId", e.target.value)}
                className="font-mono text-sm"
              />
            </Field>
          </div>

          <Separator />

          <Field
            label="Head Scripts"
            hint="Injected inside <head>. Use for custom tracking or font scripts."
          >
            <Textarea
              placeholder={"<script>\n  // your script here\n</script>"}
              value={settings.headScripts}
              onChange={(e) => set("headScripts", e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          </Field>
          <Field
            label="Body Scripts"
            hint="Injected before </body>. Use for chat widgets or third-party embeds."
          >
            <Textarea
              placeholder={"<script>\n  // your script here\n</script>"}
              value={settings.bodyScripts}
              onChange={(e) => set("bodyScripts", e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          </Field>
        </Section>

        {/* 5. Maintenance */}
        <Section
          title="Maintenance"
          description="When enabled, visitors see a maintenance page instead of your site."
        >
          <div className={cn(
            "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
            settings.maintenanceMode
              ? "border-amber-200 bg-amber-50"
              : "border-border bg-muted/30"
          )}>
            <div>
              <p className={cn(
                "text-sm font-medium",
                settings.maintenanceMode ? "text-amber-800" : "text-foreground"
              )}>
                Maintenance Mode
              </p>
              <p className={cn(
                "text-xs mt-0.5",
                settings.maintenanceMode ? "text-amber-700" : "text-muted-foreground"
              )}>
                {settings.maintenanceMode
                  ? "Your site is hidden from visitors."
                  : "Your site is live and accessible to visitors."}
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => set("maintenanceMode", v)}
            />
          </div>

          <Field
            label="Maintenance Message"
            hint="Shown to visitors while maintenance mode is active."
          >
            <Textarea
              placeholder="We're currently performing scheduled maintenance. We'll be back shortly."
              value={settings.maintenanceMessage}
              onChange={(e) => set("maintenanceMessage", e.target.value)}
              rows={2}
            />
          </Field>
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <Button onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  )
}