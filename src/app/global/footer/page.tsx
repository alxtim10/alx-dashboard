"use client"

import * as React from "react"
import {
  GripVertical, Plus, Pencil, Trash2, ChevronRight,
  ChevronDown, X, ExternalLink, Link2, Save,
  Apple,
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// ─── Types ────────────────────────────────────────────────────────────────────

type FooterLink = {
  id: number
  label: string
  href: string
  order: number
  active: boolean
}

type FooterColumn = {
  id: number
  title: string
  order: number
  links: FooterLink[]
}

type Socials = {
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
}

type FooterSettings = {
  logo: string
  tagline: string
  copyright: string
  socials: Socials
}

type LinkFormState = {
  label: string
  href: string
  active: boolean
}

type ColumnFormState = {
  title: string
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialSettings: FooterSettings = {
  logo: "/images/logo.png",
  tagline: "We build solutions that matter.",
  copyright: "© 2024 Company Name. All rights reserved.",
  socials: {
    facebook: "https://facebook.com/company",
    instagram: "https://instagram.com/company",
    twitter: "https://twitter.com/company",
    linkedin: "https://linkedin.com/company/company",
    youtube: "",
  },
}

const initialColumns: FooterColumn[] = [
  {
    id: 1, title: "Company", order: 1,
    links: [
      { id: 11, label: "About Us",  href: "/about",   order: 1, active: true },
      { id: 12, label: "Our Team",  href: "/team",    order: 2, active: true },
      { id: 13, label: "Careers",   href: "/careers", order: 3, active: false },
    ],
  },
  {
    id: 2, title: "Services", order: 2,
    links: [
      { id: 21, label: "Web Development", href: "/services/web",    order: 1, active: true },
      { id: 22, label: "Mobile Apps",     href: "/services/mobile", order: 2, active: true },
      { id: 23, label: "Consulting",      href: "/services/consult",order: 3, active: true },
    ],
  },
  {
    id: 3, title: "Contact", order: 3,
    links: [
      { id: 31, label: "hello@company.com",   href: "mailto:hello@company.com", order: 1, active: true },
      { id: 32, label: "+62 21 1234 5678",    href: "tel:+622112345678",        order: 2, active: true },
      { id: 33, label: "Jakarta, Indonesia",  href: "/contact",                 order: 3, active: true },
    ],
  },
]

const emptyLink: LinkFormState = { label: "", href: "", active: true }
const emptyColumn: ColumnFormState = { title: "" }

// ─── Section card ─────────────────────────────────────────────────────────────

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

// ─── Link Form ────────────────────────────────────────────────────────────────

function LinkForm({ value, onChange, onSubmit, onCancel, submitLabel }: {
  value: LinkFormState
  onChange: (v: LinkFormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Label</Label>
        <Input
          placeholder="e.g. About Us"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">URL</Label>
        <div className="relative">
          <Input
            placeholder="/about or https://example.com"
            value={value.href}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
            className="pl-8"
          />
          {value.href.startsWith("http") || value.href.startsWith("mailto") || value.href.startsWith("tel") ? (
            <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          ) : (
            <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Supports <code className="bg-muted px-1 rounded text-[10px]">/path</code>,{" "}
          <code className="bg-muted px-1 rounded text-[10px]">https://</code>,{" "}
          <code className="bg-muted px-1 rounded text-[10px]">mailto:</code>, and{" "}
          <code className="bg-muted px-1 rounded text-[10px]">tel:</code>
        </p>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Active</p>
          <p className="text-xs text-muted-foreground">Show this link in the footer</p>
        </div>
        <Switch checked={value.active} onCheckedChange={(v) => onChange({ ...value, active: v })} />
      </div>
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSubmit} disabled={!value.label || !value.href}>{submitLabel}</Button>
      </div>
    </div>
  )
}

// ─── Column Form ──────────────────────────────────────────────────────────────

function ColumnForm({ value, onChange, onSubmit, onCancel, submitLabel }: {
  value: ColumnFormState
  onChange: (v: ColumnFormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Column Title</Label>
        <Input
          placeholder="e.g. Company"
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSubmit} disabled={!value.title}>{submitLabel}</Button>
      </div>
    </div>
  )
}

// ─── Sortable Link Row ────────────────────────────────────────────────────────

function SortableLinkRow({ link, onEdit, onDelete, onToggle }: {
  link: FooterLink
  onEdit: (link: FooterLink) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 group",
        isDragging && "opacity-50 shadow-lg z-10 bg-background"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
      </button>
      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/30" />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", !link.active && "text-muted-foreground/50 line-through")}>
          {link.label}
        </p>
        <p className="text-xs text-muted-foreground/60 truncate">{link.href}</p>
      </div>
      <Switch checked={link.active} onCheckedChange={() => onToggle(link.id)} />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(link)} className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Pencil className="h-3 w-3" />
        </button>
        <button onClick={() => onDelete(link.id)} className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

// ─── Sortable Column ──────────────────────────────────────────────────────────

function SortableColumn({
  column, onEdit, onDelete,
  onAddLink, onEditLink, onDeleteLink, onToggleLink,
  onReorderLinks,
}: {
  column: FooterColumn
  onEdit: (col: FooterColumn) => void
  onDelete: (id: number) => void
  onAddLink: (colId: number) => void
  onEditLink: (colId: number, link: FooterLink) => void
  onDeleteLink: (colId: number, linkId: number) => void
  onToggleLink: (colId: number, linkId: number) => void
  onReorderLinks: (colId: number, links: FooterLink[]) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const [expanded, setExpanded] = React.useState(true)

  const linkSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleLinkDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !column.links) return
    const oldIndex = column.links.findIndex((l) => l.id === active.id)
    const newIndex = column.links.findIndex((l) => l.id === over.id)
    onReorderLinks(column.id, arrayMove(column.links, oldIndex, newIndex))
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        isDragging && "opacity-50 shadow-xl z-10"
      )}
    >
      {/* Column header */}
      <div className="flex items-center gap-3 px-4 py-3 group">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", !expanded && "-rotate-90")} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{column.title}</p>
          <p className="text-xs text-muted-foreground/60">{column.links.length} link{column.links.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddLink(column.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Add link"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(column)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(column.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Links */}
      {expanded && (
        <div className="border-t border-border/50 bg-muted/10 px-4 py-3 space-y-2">
          <DndContext sensors={linkSensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
            <SortableContext items={column.links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              {column.links.map((link) => (
                <SortableLinkRow
                  key={link.id}
                  link={link}
                  onEdit={(l) => onEditLink(column.id, l)}
                  onDelete={(id) => onDeleteLink(column.id, id)}
                  onToggle={(id) => onToggleLink(column.id, id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            onClick={() => onAddLink(column.id)}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add link
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Social input ─────────────────────────────────────────────────────────────

function SocialInput({ icon: Icon, label, value, onChange, placeholder }: {
  icon: React.ElementType
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FooterManager() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [settings, setSettings] = React.useState<FooterSettings>(initialSettings)
  const [columns, setColumns] = React.useState<FooterColumn[]>(initialColumns)

  type ModalMode =
    | { type: "add-column" }
    | { type: "edit-column"; column: FooterColumn }
    | { type: "add-link"; colId: number }
    | { type: "edit-link"; colId: number; link: FooterLink }
    | null

  const [modal, setModal] = React.useState<ModalMode>(null)
  const [linkForm, setLinkForm] = React.useState<LinkFormState>(emptyLink)
  const [colForm, setColForm] = React.useState<ColumnFormState>(emptyColumn)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function closeModal() {
    setModal(null)
    setLinkForm(emptyLink)
    setColForm(emptyColumn)
  }

  function handleColumnDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = columns.findIndex((c) => c.id === active.id)
    const newIndex = columns.findIndex((c) => c.id === over.id)
    setColumns((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function handleReorderLinks(colId: number, links: FooterLink[]) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, links } : c))
  }

  function handleSubmit() {
    if (!modal) return

    if (modal.type === "add-column") {
      setColumns((prev) => [
        ...prev,
        { id: Date.now(), title: colForm.title, order: prev.length + 1, links: [] },
      ])
    }
    if (modal.type === "edit-column") {
      setColumns((prev) => prev.map((c) => c.id === modal.column.id ? { ...c, title: colForm.title } : c))
    }
    if (modal.type === "add-link") {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === modal.colId
            ? { ...c, links: [...c.links, { id: Date.now(), ...linkForm, order: c.links.length + 1 }] }
            : c
        )
      )
    }
    if (modal.type === "edit-link") {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === modal.colId
            ? { ...c, links: c.links.map((l) => l.id === modal.link.id ? { ...l, ...linkForm } : l) }
            : c
        )
      )
    }

    closeModal()
  }

  function updateSocial(key: keyof Socials, val: string) {
    setSettings((prev) => ({ ...prev, socials: { ...prev.socials, [key]: val } }))
  }

  const isLinkModal = modal?.type === "add-link" || modal?.type === "edit-link"
  const isColModal = modal?.type === "add-column" || modal?.type === "edit-column"

  const modalTitle =
    modal?.type === "add-column" ? "Add Column" :
    modal?.type === "edit-column" ? "Edit Column" :
    modal?.type === "add-link" ? "Add Link" :
    modal?.type === "edit-link" ? "Edit Link" : ""

  const submitLabel =
    modal?.type === "add-column" || modal?.type === "add-link" ? "Add" : "Save Changes"

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Footer</h1>
          <p className="text-xs text-muted-foreground">Global &rsaquo; Footer</p>
        </div>
        <Button size="sm" onClick={() => console.log("save", { settings, columns })}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full space-y-6">

        {/* Settings */}
        <Section title="Settings" description="General footer information shown across the site.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Logo" hint="URL or path to your logo image.">
              <Input
                placeholder="/images/logo.png"
                value={settings.logo}
                onChange={(e) => setSettings((p) => ({ ...p, logo: e.target.value }))}
              />
            </Field>
            <Field label="Copyright Text" hint="Shown at the bottom of the footer.">
              <Input
                placeholder="© 2024 Company Name. All rights reserved."
                value={settings.copyright}
                onChange={(e) => setSettings((p) => ({ ...p, copyright: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Tagline" hint="Short description shown below the logo.">
            <Textarea
              placeholder="We build solutions that matter."
              value={settings.tagline}
              onChange={(e) => setSettings((p) => ({ ...p, tagline: e.target.value }))}
              rows={2}
            />
          </Field>
        </Section>

        {/* Social links */}
        <Section title="Social Media" description="Leave blank to hide a platform's icon.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SocialInput icon={Apple}  label="Facebook"  value={settings.socials.facebook}  onChange={(v) => updateSocial("facebook", v)}  placeholder="https://facebook.com/company" />
            <SocialInput icon={Apple} label="Instagram" value={settings.socials.instagram} onChange={(v) => updateSocial("instagram", v)} placeholder="https://instagram.com/company" />
            <SocialInput icon={Apple}   label="Twitter / X" value={settings.socials.twitter} onChange={(v) => updateSocial("twitter", v)}   placeholder="https://twitter.com/company" />
            <SocialInput icon={Apple}  label="LinkedIn"  value={settings.socials.linkedin}  onChange={(v) => updateSocial("linkedin", v)}  placeholder="https://linkedin.com/company" />
            <SocialInput icon={Apple}   label="YouTube"   value={settings.socials.youtube}   onChange={(v) => updateSocial("youtube", v)}   placeholder="https://youtube.com/channel" />
          </div>
        </Section>

        {/* Columns */}
        <Section
          title="Footer Columns"
          description="Drag to reorder columns. Click + to add links inside a column."
          action={
            <Button size="sm" variant="outline" onClick={() => { setModal({ type: "add-column" }); setColForm(emptyColumn) }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Column
            </Button>
          }
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleColumnDragEnd}>
            <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {columns.map((col) => (
                  <SortableColumn
                    key={col.id}
                    column={col}
                    onEdit={(c) => { setModal({ type: "edit-column", column: c }); setColForm({ title: c.title }) }}
                    onDelete={(id) => setColumns((prev) => prev.filter((c) => c.id !== id))}
                    onAddLink={(colId) => { setModal({ type: "add-link", colId }); setLinkForm(emptyLink) }}
                    onEditLink={(colId, link) => { setModal({ type: "edit-link", colId, link }); setLinkForm({ label: link.label, href: link.href, active: link.active }) }}
                    onDeleteLink={(colId, linkId) =>
                      setColumns((prev) =>
                        prev.map((c) => c.id === colId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c)
                      )
                    }
                    onToggleLink={(colId, linkId) =>
                      setColumns((prev) =>
                        prev.map((c) =>
                          c.id === colId
                            ? { ...c, links: c.links.map((l) => l.id === linkId ? { ...l, active: !l.active } : l) }
                            : c
                        )
                      )
                    }
                    onReorderLinks={handleReorderLinks}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {columns.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium text-foreground">No columns yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Add a column to start building your footer.</p>
              <Button size="sm" onClick={() => { setModal({ type: "add-column" }); setColForm(emptyColumn) }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Column
              </Button>
            </div>
          )}
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <Button onClick={() => console.log("save", { settings, columns })}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal title={modalTitle} open={!!modal} onClose={closeModal}>
        {isLinkModal && (
          <LinkForm
            value={linkForm}
            onChange={setLinkForm}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitLabel={submitLabel}
          />
        )}
        {isColModal && (
          <ColumnForm
            value={colForm}
            onChange={setColForm}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitLabel={submitLabel}
          />
        )}
      </Modal>
    </div>
  )
}