"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroSlide = {
  id: number
  image: string
  mobileImage?: string
  headline: string
  subheadline: string
  ctaLabel: string
  ctaUrl?: string
  ctaExternal?: string
  alt?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

type HeroSlideFormProps = {
  id?: string // undefined = add mode, string = edit mode
}

// ─── Dummy data for edit mode ─────────────────────────────────────────────────

const dummySlide: HeroSlide = {
  id: 1,
  image: "/images/hero-1.jpg",
  mobileImage: "/images/hero-1-mobile.jpg",
  headline: "We Build Solutions That Matter",
  subheadline:
    "Delivering innovative technology and consulting services to help your business grow",
  ctaLabel: "Discover Our Services",
  ctaUrl: "/services",
  ctaExternal: "",
  alt: "Team working on a project in a modern office",
  order: 1,
  active: true,
  createdAt: "2024-01-15T08:00:00Z",
  updatedAt: "2024-03-10T14:23:00Z",
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  required,
  children,
}: {
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

// ─── Image uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value?: string
  onChange?: (val: string) => void
}) {
  return (
    <Field label={label} hint={hint}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border",
          "bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer",
          value ? "p-2" : "p-8"
        )}
      >
        {value ? (
          <div className="relative w-full">
            <Image
              src={value}
              alt="Preview"
              width={800}
              height={400}
              className="rounded-md object-cover w-full h-40"
            />
            <button
              type="button"
              onClick={() => onChange?.("")}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              PNG, JPG, WEBP up to 5MB
            </p>
          </>
        )}
      </div>
    </Field>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Separator />
      {children}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function HeroSlideForm({ id }: HeroSlideFormProps) {
  const router = useRouter()
  const isEdit = !!id

  const [form, setForm] = React.useState<Partial<HeroSlide>>(
    isEdit ? dummySlide : { active: true, order: 1 }
  )

  function set<K extends keyof HeroSlide>(key: K, value: HeroSlide[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call POST /api/hero-slides or PUT /api/hero-slides/:id
    console.log("submit", form)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {isEdit ? "Edit Slide" : "Add Slide"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Homepage &rsaquo; Hero Slides
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Slide"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full space-y-6">

        {/* Images */}
        <Section
          title="Images"
          description="Upload a desktop and optional mobile version of the slide image."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Desktop Image"
              hint="Recommended: 1920×1080px (16:9)"
              value={form.image}
              onChange={(v) => set("image", v)}
            />
            <ImageUploader
              label="Mobile Image"
              hint="Optional. Recommended: 768×1024px (portrait)"
              value={form.mobileImage}
              onChange={(v) => set("mobileImage", v)}
            />
          </div>
          <Field
            label="Alt Text"
            hint="Describe the image for screen readers and SEO."
          >
            <Input
              placeholder="e.g. Team collaborating in a modern office"
              value={form.alt ?? ""}
              onChange={(e) => set("alt", e.target.value)}
            />
          </Field>
        </Section>

        {/* Content */}
        <Section
          title="Content"
          description="The text that appears over the slide image."
        >
          <Field label="Headline" required>
            <Input
              placeholder="e.g. We Build Solutions That Matter"
              value={form.headline ?? ""}
              onChange={(e) => set("headline", e.target.value)}
            />
          </Field>
          <Field label="Subheadline">
            <Textarea
              placeholder="e.g. Delivering innovative technology and consulting services..."
              value={form.subheadline ?? ""}
              onChange={(e) => set("subheadline", e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        {/* CTA */}
        <Section
          title="Call to Action"
          description="The button shown on the slide. Leave blank to hide the button."
        >
          <Field label="Button Label">
            <Input
              placeholder="e.g. Discover Our Services"
              value={form.ctaLabel ?? ""}
              onChange={(e) => set("ctaLabel", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Internal URL"
              hint="Link to a page within the site. e.g. /services"
            >
              <Input
                placeholder="/services"
                value={form.ctaUrl ?? ""}
                onChange={(e) => set("ctaUrl", e.target.value)}
              />
            </Field>
            <Field
              label="External URL"
              hint="Overrides internal URL. Opens in a new tab."
            >
              <div className="relative">
                <Input
                  placeholder="https://example.com"
                  value={form.ctaExternal ?? ""}
                  onChange={(e) => set("ctaExternal", e.target.value)}
                  className="pr-9"
                />
                <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
              </div>
            </Field>
          </div>
        </Section>

        {/* Settings */}
        <Section
          title="Settings"
          description="Control visibility and display order of this slide."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Order" hint="Lower numbers appear first.">
              <Input
                type="number"
                min={1}
                value={form.order ?? 1}
                onChange={(e) => set("order", parseInt(e.target.value))}
              />
            </Field>
            <Field label="Active" hint="Inactive slides are hidden from the site.">
              <div className="flex items-center gap-3 pt-1">
                <Switch
                  checked={form.active ?? false}
                  onCheckedChange={(v) => set("active", v)}
                />
                <span className="text-sm text-muted-foreground">
                  {form.active ? "Visible on site" : "Hidden from site"}
                </span>
              </div>
            </Field>
          </div>
        </Section>

        {/* Timestamps — edit mode only */}
        {isEdit && (
          <div className="flex items-center gap-6 px-1">
            <p className="text-xs text-muted-foreground">
              Created{" "}
              <span className="text-foreground/70">
                {new Date(dummySlide.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated{" "}
              <span className="text-foreground/70">
                {new Date(dummySlide.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex justify-end gap-2 pt-2 pb-8">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Save Changes" : "Add Slide"}
          </Button>
        </div>
      </form>
    </div>
  )
}