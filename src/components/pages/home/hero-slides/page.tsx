"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, ExternalLink, Monitor, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { heroSlides } from "@/constants"

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
  id?: string
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
              width={200}
              height={200}
              className="rounded-md object-cover w-full h-[200px]"
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
            <Upload className="h-[100px] w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WEBP up to 5MB</p>
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
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Separator />
      {children}
    </div>
  )
}

// ─── Hero Preview ─────────────────────────────────────────────────────────────

function HeroPreview({ form }: { form: Partial<HeroSlide> }) {
  const hasImage = !!form.image
  const hasHeadline = !!form.headline
  const hasCtaLabel = !!form.ctaLabel

  return (
    <div className="sticky top-[73px] space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2 px-1">
        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Preview
        </span>
      </div>

      {/* Browser chrome */}
      <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-background">
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="flex-1 rounded-md bg-background border border-border px-2 py-0.5">
            <span className="text-[10px] text-muted-foreground/60">yoursite.com</span>
          </div>
        </div>

        {/* Fake nav bar */}
        <div className="flex items-center justify-between border-b border-border/50 bg-white px-4 py-2">
          <div className="h-2.5 w-16 rounded-sm bg-muted" />
          <div className="flex gap-3">
            <div className="h-2 w-8 rounded-sm bg-muted/70" />
            <div className="h-2 w-8 rounded-sm bg-muted/70" />
            <div className="h-2 w-8 rounded-sm bg-muted/70" />
            <div className="h-2 w-8 rounded-sm bg-muted/70" />
          </div>
        </div>

        {/* Hero slide area */}
        <div className="relative w-full aspect-video bg-muted/50 overflow-hidden">
          {/* Background image or placeholder */}
          {hasImage ? (
            <Image
              src={`https://images.unsplash.com/photo-1758035453658-9268bbaf8e29?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt={form.alt ?? "Hero slide preview"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/30">
              <Upload className="h-6 w-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/40">No image uploaded</p>
            </div>
          )}

          {/* Overlay */}
          {hasImage && (
            <div className="absolute inset-0 bg-black/40" />
          )}

          {/* Slide content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center gap-2">
            {hasHeadline ? (
              <p className="text-white font-bold text-sm leading-snug drop-shadow">
                {form.headline}
              </p>
            ) : (
              <div className="h-3 w-40 rounded-sm bg-white/20" />
            )}

            {form.subheadline ? (
              <p className="text-white/80 text-[10px] leading-relaxed max-w-[80%] drop-shadow">
                {form.subheadline}
              </p>
            ) : (
              <div className="space-y-1.5 w-full flex flex-col items-center">
                <div className="h-2 w-48 rounded-sm bg-white/15" />
                <div className="h-2 w-36 rounded-sm bg-white/15" />
              </div>
            )}

            {hasCtaLabel && (
              <div className="mt-1 flex items-center gap-1 rounded-md bg-white px-3 py-1.5 shadow">
                <span className="text-[10px] font-semibold text-gray-800">{form.ctaLabel}</span>
                <ChevronRight className="h-2.5 w-2.5 text-gray-600" />
              </div>
            )}
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="h-1.5 w-4 rounded-full bg-white/80" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Below fold hint */}
        <div className="px-4 py-3 space-y-2 bg-white">
          <div className="h-2 w-24 rounded-sm bg-muted/60" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded-md bg-muted/40" />
            <div className="h-8 rounded-md bg-muted/40" />
            <div className="h-8 rounded-md bg-muted/40" />
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-fit",
        form.active
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-muted text-muted-foreground border border-border"
      )}>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full",
          form.active ? "bg-green-500" : "bg-muted-foreground/50"
        )} />
        {form.active ? "Visible on site" : "Hidden from site"}
      </div>
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function HeroSlideForm({ id }: HeroSlideFormProps) {
  const router = useRouter()
  const isEdit = !!id

  const [form, setForm] = React.useState<Partial<HeroSlide>>(
    isEdit ? heroSlides[0] : { active: true, order: 1 }
  )

  function set<K extends keyof HeroSlide>(key: K, value: HeroSlide[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("submit", form)
  }

  React.useEffect(() => {
    console.log(isEdit)
  }, [isEdit])



  return (
    <div className="flex flex-col min-h-full bg-background">
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

      {/* Two-column body */}
      <div className="px-6 py-8 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Field label="Alt Text" hint="Describe the image for screen readers and SEO.">
                <Input
                  placeholder="e.g. Team collaborating in a modern office"
                  value={form.alt ?? ""}
                  onChange={(e) => set("alt", e.target.value)}
                />
              </Field>
            </Section>

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
                <Field label="Internal URL" hint="Link to a page within the site. e.g. /services">
                  <Input
                    placeholder="/services"
                    value={form.ctaUrl ?? ""}
                    onChange={(e) => set("ctaUrl", e.target.value)}
                  />
                </Field>
                <Field label="External URL" hint="Overrides internal URL. Opens in a new tab.">
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

            {isEdit && (
              <div className="flex items-center gap-6 px-1">
                <p className="text-xs text-muted-foreground">
                  Created{" "}
                  <span className="text-foreground/70">
                    {new Date(heroSlides[0].createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated{" "}
                  <span className="text-foreground/70">
                    {new Date(heroSlides[0].updatedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 pb-8">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Save Changes" : "Add Slide"}
              </Button>
            </div>
          </form>

          {/* Right — preview */}
          <HeroPreview form={form} />
        </div>
      </div>
    </div>
  )
}