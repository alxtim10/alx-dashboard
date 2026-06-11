"use client"

import * as React from "react"
import {
  Save, Search, GripVertical, X, ExternalLink,
  Briefcase, Code, Smartphone, Megaphone, PenTool, Headphones,
} from "lucide-react"
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragEndEvent, KeyboardSensor,
} from "@dnd-kit/core"
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: number
  icon: string
  title: string
  shortDescription: string
  slug: string
  active: boolean
}

type SectionSettings = {
  heading: string
  subheading: string
  ctaLabel: string
  ctaUrl: string
  layout: "grid-3" | "grid-4" | "carousel"
}

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  Briefcase, Code, Smartphone, Megaphone, PenTool, Headphones,
}

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Briefcase
  return <Icon className={className} />
}

// ─── Dummy data — pulled from main Services list ──────────────────────────────

const allServices: Service[] = [
  { id: 1, icon: "Code",       title: "Web Development",  shortDescription: "Custom websites and web applications built for performance.",     slug: "web-development",  active: true },
  { id: 2, icon: "Smartphone", title: "Mobile Apps",       shortDescription: "Native and cross-platform mobile apps for iOS and Android.",       slug: "mobile-apps",      active: true },
  { id: 3, icon: "Megaphone",  title: "Digital Marketing", shortDescription: "SEO, paid ads, and social media strategies that drive growth.",     slug: "digital-marketing",active: true },
  { id: 4, icon: "PenTool",    title: "UI/UX Design",      shortDescription: "User-centered design that makes products intuitive and delightful.", slug: "ui-ux-design",   active: true },
  { id: 5, icon: "Briefcase",  title: "Consulting",        shortDescription: "Strategic guidance to help your business scale efficiently.",       slug: "consulting",       active: true },
  { id: 6, icon: "Headphones", title: "IT Support",        shortDescription: "24/7 technical support and infrastructure management.",            slug: "it-support",       active: false },
]

const initialSettings: SectionSettings = {
  heading: "Our Services",
  subheading: "We offer a wide range of services to help your business grow and succeed.",
  ctaLabel: "View All Services",
  ctaUrl: "/services",
  layout: "grid-3",
}

// initially featured = first 3 active
const initialFeaturedIds = [1, 2, 4]

// ─── Field ────────────────────────────────────────────────────────────────────

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

function Section({ title, description, children, action }: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

// ─── Layout picker ────────────────────────────────────────────────────────────

function LayoutOption({ label, value, current, onSelect, preview }: {
  label: string
  value: SectionSettings["layout"]
  current: SectionSettings["layout"]
  onSelect: (v: SectionSettings["layout"]) => void
  preview: React.ReactNode
}) {
  const isSelected = current === value
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
      )}
    >
      <div className="w-full">{preview}</div>
      <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  )
}

// ─── Sortable Featured Service Row ────────────────────────────────────────────

function SortableFeaturedRow({ service, onRemove }: {
  service: Service
  onRemove: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 group",
        isDragging && "opacity-50 shadow-lg z-10"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
      </button>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <ServiceIcon name={service.icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{service.title}</p>
        <p className="text-xs text-muted-foreground/60 truncate">{service.shortDescription}</p>
      </div>
      <button
        onClick={() => onRemove(service.id)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Available Service Row ────────────────────────────────────────────────────

function AvailableServiceRow({ service, onAdd, disabled }: {
  service: Service
  onAdd: (id: number) => void
  disabled: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5",
      disabled && "opacity-40"
    )}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <ServiceIcon name={service.icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{service.title}</p>
        <p className="text-xs text-muted-foreground/60 truncate">
          {!service.active ? "Inactive — not shown on Services page" : service.shortDescription}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAdd(service.id)}
        disabled={disabled}
        className="shrink-0"
      >
        Add
      </Button>
    </div>
  )
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function ServicesPreview({ settings, services }: {
  settings: SectionSettings
  services: Service[]
}) {
  const cols =
    settings.layout === "grid-4" ? "md:grid-cols-4" :
    settings.layout === "grid-3" ? "md:grid-cols-3" :
    "md:grid-cols-3" // carousel approximated as scroll row in preview

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-4 pt-3 pb-2">
        Live Preview
      </p>
      <div className="border-t border-border bg-muted/10 px-6 py-8">
        <div className="text-center mb-6 space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">{settings.heading || "Section Heading"}</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {settings.subheading || "Section subheading goes here."}
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground/50 py-6">No services selected</p>
        ) : settings.layout === "carousel" ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {services.map((s) => (
              <div key={s.id} className="flex-shrink-0 w-44 rounded-lg border border-border bg-background p-4 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ServiceIcon name={s.icon} className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.shortDescription}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", cols)}>
            {services.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-background p-4 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ServiceIcon name={s.icon} className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.shortDescription}</p>
              </div>
            ))}
          </div>
        )}

        {settings.ctaLabel && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-primary-foreground text-xs font-semibold">
              {settings.ctaLabel}
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPreviewPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [settings, setSettings] = React.useState<SectionSettings>(initialSettings)
  const [featuredIds, setFeaturedIds] = React.useState<number[]>(initialFeaturedIds)
  const [search, setSearch] = React.useState("")

  function set<K extends keyof SectionSettings>(key: K, value: SectionSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = featuredIds.findIndex((id) => id === active.id)
    const newIndex = featuredIds.findIndex((id) => id === over.id)
    setFeaturedIds((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function addService(id: number) {
    setFeaturedIds((prev) => [...prev, id])
  }

  function removeService(id: number) {
    setFeaturedIds((prev) => prev.filter((i) => i !== id))
  }

  const featuredServices = featuredIds
    .map((id) => allServices.find((s) => s.id === id))
    .filter((s): s is Service => !!s)

  const availableServices = allServices.filter((s) =>
    !featuredIds.includes(s.id) &&
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  const maxFeatured = settings.layout === "grid-4" ? 8 : settings.layout === "carousel" ? 8 : 6

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Services Preview</h1>
          <p className="text-xs text-muted-foreground">Home &rsaquo; Services Preview</p>
        </div>
        <Button size="sm" onClick={() => console.log("save", { settings, featuredIds })}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full space-y-6">

        {/* Live preview */}
        <ServicesPreview settings={settings} services={featuredServices} />

        {/* Section content */}
        <Section title="Section Content" description="Heading and CTA shown above the featured services.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Heading">
              <Input
                placeholder="Our Services"
                value={settings.heading}
                onChange={(e) => set("heading", e.target.value)}
              />
            </Field>
            <Field label="CTA Label" hint="Button shown below the services.">
              <Input
                placeholder="View All Services"
                value={settings.ctaLabel}
                onChange={(e) => set("ctaLabel", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Subheading">
            <Input
              placeholder="We offer a wide range of services to help your business grow."
              value={settings.subheading}
              onChange={(e) => set("subheading", e.target.value)}
            />
          </Field>
          <Field label="CTA URL">
            <Input
              placeholder="/services"
              value={settings.ctaUrl}
              onChange={(e) => set("ctaUrl", e.target.value)}
            />
          </Field>
        </Section>

        {/* Layout */}
        <Section title="Layout" description="How the featured services are displayed.">
          <div className="grid grid-cols-3 gap-3">
            <LayoutOption
              label="3 Columns"
              value="grid-3"
              current={settings.layout}
              onSelect={(v) => set("layout", v)}
              preview={
                <div className="grid grid-cols-3 gap-1 h-12">
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                </div>
              }
            />
            <LayoutOption
              label="4 Columns"
              value="grid-4"
              current={settings.layout}
              onSelect={(v) => set("layout", v)}
              preview={
                <div className="grid grid-cols-4 gap-1 h-12">
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                </div>
              }
            />
            <LayoutOption
              label="Carousel"
              value="carousel"
              current={settings.layout}
              onSelect={(v) => set("layout", v)}
              preview={
                <div className="flex gap-1 h-12">
                  <div className="rounded bg-muted w-8" />
                  <div className="rounded bg-muted w-8" />
                  <div className="rounded bg-muted w-8" />
                  <div className="rounded bg-muted w-4 opacity-40" />
                </div>
              }
            />
          </div>
        </Section>

        {/* Featured services */}
        <Section
          title="Featured Services"
          description={`Select which services to feature on the homepage. Max ${maxFeatured} for this layout.`}
        >
          {featuredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
              <p className="text-sm font-medium text-foreground">No services featured</p>
              <p className="text-xs text-muted-foreground mt-1">Add services from the list below.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={featuredIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {featuredServices.map((service) => (
                    <SortableFeaturedRow key={service.id} service={service} onRemove={removeService} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Separator />

          {/* Available services */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <Input
                placeholder="Search services to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {availableServices.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 text-center py-4">
                {search ? "No matching services found." : "All services are featured."}
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableServices.map((service) => (
                  <AvailableServiceRow
                    key={service.id}
                    service={service}
                    onAdd={addService}
                    disabled={featuredIds.length >= maxFeatured}
                  />
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground/60 text-center">
              Manage all services in <span className="font-medium text-foreground">Content &rsaquo; Services</span>.
            </p>
          </div>
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <Button onClick={() => console.log("save", { settings, featuredIds })}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}