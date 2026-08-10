"use client"

import * as React from "react"
import Image from "next/image"
import { Save, Upload, X, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type PageSEO = {
  // Basic
  metaTitle: string
  metaDescription: string
  ogImage: string

  // Advanced
  canonicalUrl: string
  noIndex: boolean
  noFollow: boolean

  // OG / Social
  ogTitle: string
  ogDescription: string

  // Twitter
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialSEO: PageSEO = {
  metaTitle: "PT Solusi Digital Indonesia - We Build Solutions That Matter",
  metaDescription: "Delivering innovative technology and consulting services to help your business grow across Southeast Asia.",
  ogImage: "https://images.unsplash.com/photo-1758035453658-9268bbaf8e29?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  canonicalUrl: "",
  noIndex: false,
  noFollow: false,

  ogTitle: "",
  ogDescription: "",

  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, description, icon: Icon, children }: {
  title: string
  description?: string
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const count = value.length
  const over = count > max
  const warn = count > max * 0.9
  return (
    <span className={cn(
      "text-xs tabular-nums",
      over ? "text-destructive" : warn ? "text-amber-500" : "text-muted-foreground"
    )}>
      {count}/{max}
    </span>
  )
}

function ImageUploader({ label, hint, value, onChange }: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
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
            <div className="relative w-full h-32 overflow-hidden rounded-md bg-muted">
              <Image src={value} alt="OG Preview" fill className="object-cover" />
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

// ─── SERP Preview ─────────────────────────────────────────────────────────────

function SERPPreview({ title, description, url }: {
  title: string
  description: string
  url: string
}) {
  const displayTitle = title || "Page Title"
  const displayDesc = description || "Page description will appear here when you fill in the meta description field above."
  const displayUrl = url || "yoursite.com › home"

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
        Google Preview
      </p>
      <p className="text-[13px] text-blue-600 font-medium leading-snug line-clamp-1">
        {displayTitle}
      </p>
      <p className="text-[11px] text-green-700">{displayUrl}</p>
      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
        {displayDesc}
      </p>
    </div>
  )
}

// ─── OG Preview ──────────────────────────────────────────────────────────────

function OGPreview({ title, description, image, site }: {
  title: string
  description: string
  image: string
  site: string
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-muted/20">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-4 pt-3 pb-2">
        Social Preview
      </p>
      {image ? (
        <div className="relative w-full h-32 bg-muted">
          <Image src={image} alt="OG preview" fill className="object-cover" />
        </div>
      ) : (
        <div className="w-full h-32 bg-muted/50 flex items-center justify-center">
          <p className="text-xs text-muted-foreground/40">No image uploaded</p>
        </div>
      )}
      <div className="px-4 py-3 space-y-0.5 border-t border-border">
        <p className="text-[10px] uppercase text-muted-foreground/60 tracking-wider">{site || "yoursite.com"}</p>
        <p className="text-sm font-semibold text-foreground line-clamp-1">{title || "Page Title"}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{description || "Page description"}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PageSEO() {
  const [seo, setSEO] = React.useState<PageSEO>(initialSEO)

  function set<K extends keyof PageSEO>(key: K, value: PageSEO[K]) {
    setSEO((prev) => ({ ...prev, [key]: value }))
  }

  // Resolved values — fallback to base meta if OG/Twitter fields are empty
  const resolvedOgTitle = seo.ogTitle || seo.metaTitle
  const resolvedOgDesc = seo.ogDescription || seo.metaDescription
  const resolvedTwitterTitle = seo.twitterTitle || resolvedOgTitle
  const resolvedTwitterDesc = seo.twitterDescription || resolvedOgDesc
  const resolvedTwitterImage = seo.twitterImage || seo.ogImage

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-[13.5px]">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Page SEO</h1>
          <p className="text-xs text-muted-foreground">Homepage &rsaquo; Page SEO</p>
        </div>
        <Button size="sm" onClick={() => console.log("save seo", seo)}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>

      {/* Two-column body */}
      <div className="flex-1 px-6 py-8 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Left — form */}
          <div className="space-y-6">

            {/* Basic SEO */}
            <Section title="Basic SEO" icon={Globe} description="Used by search engines to index and display your page.">
              <Field label="Meta Title" hint="Recommended: 50–60 characters.">
                <Input
                  placeholder="Homepage - Company Name"
                  value={seo.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Falls back to Site Settings if empty.</span>
                  <CharCount value={seo.metaTitle} max={60} />
                </div>
              </Field>
              <Field label="Meta Description" hint="Recommended: 120–160 characters.">
                <Textarea
                  placeholder="Delivering innovative technology and consulting services..."
                  value={seo.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Falls back to Site Settings if empty.</span>
                  <CharCount value={seo.metaDescription} max={160} />
                </div>
              </Field>
              <ImageUploader
                label="OG Image"
                hint="Shown when sharing on social media. Recommended: 1200×630px."
                value={seo.ogImage}
                onChange={(v) => set("ogImage", v)}
              />
            </Section>

            {/* Advanced */}
            <Section title="Advanced" description="Canonical URL and crawler directives.">
              <Field
                label="Canonical URL"
                hint="Override the canonical URL if this page content exists elsewhere."
              >
                <Input
                  placeholder="https://yoursite.com/"
                  value={seo.canonicalUrl}
                  onChange={(e) => set("canonicalUrl", e.target.value)}
                />
              </Field>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">No Index</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Prevent search engines from indexing this page.</p>
                  </div>
                  <Switch checked={seo.noIndex} onCheckedChange={(v) => set("noIndex", v)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">No Follow</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Prevent search engines from following links on this page.</p>
                  </div>
                  <Switch checked={seo.noFollow} onCheckedChange={(v) => set("noFollow", v)} />
                </div>
              </div>
            </Section>

            {/* Open Graph */}
            <Section title="Open Graph" icon={Globe} description="Controls how this page appears when shared on Facebook and other platforms. Defaults to Basic SEO values if left empty.">
              <Field label="OG Title">
                <Input
                  placeholder={seo.metaTitle || "Inherits from Meta Title"}
                  value={seo.ogTitle}
                  onChange={(e) => set("ogTitle", e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Leave empty to use Meta Title.</span>
                  <CharCount value={seo.ogTitle} max={60} />
                </div>
              </Field>
              <Field label="OG Description">
                <Textarea
                  placeholder={seo.metaDescription || "Inherits from Meta Description"}
                  value={seo.ogDescription}
                  onChange={(e) => set("ogDescription", e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Leave empty to use Meta Description.</span>
                  <CharCount value={seo.ogDescription} max={160} />
                </div>
              </Field>
            </Section>

            {/* Twitter */}
            <Section title="Twitter / X" icon={Globe} description="Controls how this page appears when shared on Twitter. Defaults to Open Graph values if left empty.">
              <Field label="Twitter Title">
                <Input
                  placeholder={resolvedOgTitle || "Inherits from OG Title"}
                  value={seo.twitterTitle}
                  onChange={(e) => set("twitterTitle", e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Leave empty to use OG Title.</span>
                  <CharCount value={seo.twitterTitle} max={60} />
                </div>
              </Field>
              <Field label="Twitter Description">
                <Textarea
                  placeholder={resolvedOgDesc || "Inherits from OG Description"}
                  value={seo.twitterDescription}
                  onChange={(e) => set("twitterDescription", e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Leave empty to use OG Description.</span>
                  <CharCount value={seo.twitterDescription} max={160} />
                </div>
              </Field>
              <ImageUploader
                label="Twitter Image"
                hint="Leave empty to use OG Image. Recommended: 1200×630px."
                value={seo.twitterImage}
                onChange={(v) => set("twitterImage", v)}
              />
            </Section>

            {/* Bottom save */}
            <div className="flex justify-end pb-8">
              <Button onClick={() => console.log("save seo", seo)}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right — previews */}
          <div className="sticky top-[73px] space-y-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-1">
              Live Preview
            </p>

            <SERPPreview
              title={seo.metaTitle}
              description={seo.metaDescription}
              url="yoursite.com"
            />

            <OGPreview
              title={resolvedOgTitle}
              description={resolvedOgDesc}
              image={seo.ogImage}
              site="yoursite.com"
            />

            <OGPreview
              title={resolvedTwitterTitle}
              description={resolvedTwitterDesc}
              image={resolvedTwitterImage}
              site="Twitter / X"
            />

            {/* Robots tag preview */}
            <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                Robots Tag
              </p>
              <code className="text-xs text-foreground/70 font-mono">
                {[
                  !seo.noIndex ? "index" : "noindex",
                  !seo.noFollow ? "follow" : "nofollow",
                ].join(", ")}
              </code>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}