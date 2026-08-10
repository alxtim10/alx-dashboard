"use client"

import * as React from "react"
import Image from "next/image"
import {
  GripVertical, Plus, Pencil, Trash2, X, Save,
  Upload, ExternalLink,
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

type Partner = {
  id: number
  name: string
  logo: string
  websiteUrl?: string
  active: boolean
}

type SectionSettings = {
  heading: string
  subheading: string
  displayStyle: "grid" | "marquee"
  grayscale: boolean
}

type FormState = {
  name: string
  logo: string
  websiteUrl: string
  active: boolean
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialPartners: Partner[] = [
  { id: 1, name: "Acme Corp",       logo: "/images/partners/acme.png",       websiteUrl: "https://acme.com",       active: true },
  { id: 2, name: "Globex",          logo: "/images/partners/globex.png",     websiteUrl: "https://globex.com",     active: true },
  { id: 3, name: "Initech",         logo: "/images/partners/initech.png",    websiteUrl: "https://initech.com",    active: true },
  { id: 4, name: "Umbrella Group",  logo: "/images/partners/umbrella.png",   websiteUrl: "",                       active: true },
  { id: 5, name: "Soylent",         logo: "/images/partners/soylent.png",    websiteUrl: "https://soylent.com",    active: false },
]

const initialSettings: SectionSettings = {
  heading: "Trusted By",
  subheading: "We're proud to work alongside these amazing companies",
  displayStyle: "grid",
  grayscale: true,
}

const emptyForm: FormState = { name: "", logo: "", websiteUrl: "", active: true }

// ─── Field & Section ──────────────────────────────────────────────────────────

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

// ─── Image uploader ───────────────────────────────────────────────────────────

function LogoUploader({ value, onChange }: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field label="Logo" hint="Recommended: SVG or PNG with transparent background, max height 80px.">
      <div className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border",
        "bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer",
        value ? "p-2" : "p-6"
      )}>
        {value ? (
          <div className="relative w-full">
            <div className="relative w-full h-20 overflow-hidden rounded-md bg-muted flex items-center justify-center">
              <Image src={value} alt="Logo preview" fill className="object-contain p-3" />
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
            <p className="text-xs text-muted-foreground">Click to upload logo</p>
          </>
        )}
      </div>
    </Field>
  )
}

// ─── Layout picker ────────────────────────────────────────────────────────────

function LayoutOption({ label, value, current, onSelect, preview }: {
  label: string
  value: SectionSettings["displayStyle"]
  current: SectionSettings["displayStyle"]
  onSelect: (v: SectionSettings["displayStyle"]) => void
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

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, open, onClose, children }: {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background shadow-xl mx-4">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Partner Form ─────────────────────────────────────────────────────────────

function PartnerForm({ value, onChange, onSubmit, onCancel, submitLabel }: {
  value: FormState
  onChange: (v: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <LogoUploader value={value.logo} onChange={(logo) => onChange({ ...value, logo })} />

      <Field label="Partner Name" hint="Used as alt text for accessibility.">
        <Input
          placeholder="e.g. Acme Corp"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </Field>

      <Field label="Website URL" hint="Optional. Logo links here when clicked.">
        <div className="relative">
          <Input
            placeholder="https://acme.com"
            value={value.websiteUrl}
            onChange={(e) => onChange({ ...value, websiteUrl: e.target.value })}
            className="pl-8"
          />
          <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Active</p>
          <p className="text-xs text-muted-foreground">Show this logo on the homepage</p>
        </div>
        <Switch checked={value.active} onCheckedChange={(v) => onChange({ ...value, active: v })} />
      </div>

      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSubmit} disabled={!value.name || !value.logo}>{submitLabel}</Button>
      </div>
    </div>
  )
}

// ─── Sortable Partner Row ─────────────────────────────────────────────────────

function SortablePartnerRow({ partner, onEdit, onDelete, onToggle }: {
  partner: Partner
  onEdit: (partner: Partner) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: partner.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 group",
        isDragging && "opacity-50 shadow-lg z-10"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
      </button>

      <div className={cn(
        "relative flex h-12 w-24 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 overflow-hidden",
        !partner.active && "opacity-40 grayscale"
      )}>
        {partner.logo ? (
          <Image src={partner.logo} alt={partner.name} fill className="object-contain p-2" />
        ) : (
          <span className="text-[10px] text-muted-foreground/40">No logo</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", !partner.active && "text-muted-foreground/40 line-through")}>
          {partner.name}
        </p>
        {partner.websiteUrl ? (
          <p className="text-xs text-muted-foreground/60 truncate flex items-center gap-1">
            <ExternalLink className="h-2.5 w-2.5" />
            {partner.websiteUrl}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/40">No link</p>
        )}
      </div>

      <Switch checked={partner.active} onCheckedChange={() => onToggle(partner.id)} />

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(partner)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onDelete(partner.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function PartnersPreview({ settings, partners }: {
  settings: SectionSettings
  partners: Partner[]
}) {
  const activePartners = partners.filter((p) => p.active)

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-4 pt-3 pb-2">
        Live Preview
      </p>
      <div className="border-t border-border bg-muted/10 px-6 py-8">
        <div className="text-center mb-6 space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">{settings.heading || "Section Heading"}</h3>
          {settings.subheading && (
            <p className="text-xs text-muted-foreground max-w-md mx-auto">{settings.subheading}</p>
          )}
        </div>

        {activePartners.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground/50 py-6">No active partners to display</p>
        ) : settings.displayStyle === "marquee" ? (
          <div className="relative overflow-hidden">
            <div className="flex gap-8 items-center animate-pulse">
              {[...activePartners, ...activePartners].map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className={cn(
                    "relative h-10 w-24 shrink-0",
                    settings.grayscale && "grayscale opacity-60"
                  )}
                >
                  {p.logo ? (
                    <Image src={p.logo} alt={p.name} fill className="object-contain" />
                  ) : (
                    <div className="h-full w-full rounded bg-muted flex items-center justify-center">
                      <span className="text-[9px] text-muted-foreground/40">{p.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card to-transparent" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {activePartners.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "relative h-10 w-28",
                  settings.grayscale && "grayscale opacity-60 hover:opacity-100 transition-opacity"
                )}
              >
                {p.logo ? (
                  <Image src={p.logo} alt={p.name} fill className="object-contain" />
                ) : (
                  <div className="h-full w-full rounded bg-muted flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground/40">{p.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PartnersManager() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [settings, setSettings] = React.useState<SectionSettings>(initialSettings)
  const [partners, setPartners] = React.useState<Partner[]>(initialPartners)

  type ModalMode =
    | { type: "add" }
    | { type: "edit"; partner: Partner }
    | null

  const [modal, setModal] = React.useState<ModalMode>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function set<K extends keyof SectionSettings>(key: K, value: SectionSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function closeModal() {
    setModal(null)
    setForm(emptyForm)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = partners.findIndex((p) => p.id === active.id)
    const newIndex = partners.findIndex((p) => p.id === over.id)
    setPartners((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function handleSubmit() {
    if (!modal) return

    if (modal.type === "add") {
      setPartners((prev) => [...prev, { id: Date.now(), ...form }])
    }
    if (modal.type === "edit") {
      setPartners((prev) => prev.map((p) => p.id === modal.partner.id ? { ...p, ...form } : p))
    }

    closeModal()
  }

  const modalTitle = modal?.type === "add" ? "Add Partner" : "Edit Partner"
  const submitLabel = modal?.type === "add" ? "Add Partner" : "Save Changes"

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Partners</h1>
          <p className="text-xs text-muted-foreground">Home &rsaquo; Partners</p>
        </div>
        <Button size="sm" onClick={() => { setModal({ type: "add" }); setForm(emptyForm) }}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Partner
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full space-y-6">

        {/* Live preview */}
        <PartnersPreview settings={settings} partners={partners} />

        {/* Section content */}
        <Section title="Section Content" description="Heading and subheading shown above the partner logos.">
          <Field label="Heading">
            <Input
              placeholder="Trusted By"
              value={settings.heading}
              onChange={(e) => set("heading", e.target.value)}
            />
          </Field>
          <Field label="Subheading">
            <Input
              placeholder="We're proud to work alongside these amazing companies"
              value={settings.subheading}
              onChange={(e) => set("subheading", e.target.value)}
            />
          </Field>
        </Section>

        {/* Display settings */}
        <Section title="Display" description="How the partner logos are presented.">
          <div className="grid grid-cols-2 gap-3">
            <LayoutOption
              label="Static Grid"
              value="grid"
              current={settings.displayStyle}
              onSelect={(v) => set("displayStyle", v)}
              preview={
                <div className="grid grid-cols-3 gap-1 h-10">
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                  <div className="rounded bg-muted" />
                </div>
              }
            />
            <LayoutOption
              label="Scrolling Marquee"
              value="marquee"
              current={settings.displayStyle}
              onSelect={(v) => set("displayStyle", v)}
              preview={
                <div className="flex gap-1 h-10 overflow-hidden">
                  <div className="rounded bg-muted w-8 shrink-0" />
                  <div className="rounded bg-muted w-8 shrink-0" />
                  <div className="rounded bg-muted w-8 shrink-0" />
                  <div className="rounded bg-muted w-8 shrink-0 opacity-40" />
                </div>
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Grayscale Logos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Logos appear gray and turn full color on hover.</p>
            </div>
            <Switch checked={settings.grayscale} onCheckedChange={(v) => set("grayscale", v)} />
          </div>
        </Section>

        {/* Partner list */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground px-1">
            Drag to reorder. Toggle to show or hide a partner on the homepage.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={partners.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {partners.map((partner) => (
                  <SortablePartnerRow
                    key={partner.id}
                    partner={partner}
                    onEdit={(p) => { setModal({ type: "edit", partner: p }); setForm({ name: p.name, logo: p.logo, websiteUrl: p.websiteUrl ?? "", active: p.active }) }}
                    onDelete={(id) => setPartners((prev) => prev.filter((p) => p.id !== id))}
                    onToggle={(id) => setPartners((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {partners.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium text-foreground">No partners yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Add a partner logo to display on the homepage.</p>
              <Button size="sm" onClick={() => { setModal({ type: "add" }); setForm(emptyForm) }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Partner
              </Button>
            </div>
          )}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <Button onClick={() => console.log("save", { settings, partners })}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal title={modalTitle} open={!!modal} onClose={closeModal}>
        <PartnerForm
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitLabel={submitLabel}
        />
      </Modal>
    </div>
  )
}