"use client"

import * as React from "react"
import {
  GripVertical, Plus, Pencil, Trash2, X, Save,
  Users, TrendingUp, Globe, Award, Star, Briefcase,
  Building2, Clock, Target, Heart, Rocket, ThumbsUp,
  Check,
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

type Stat = {
  id: number
  icon: string
  value: string
  label: string
  order: number
  active: boolean
}

type FormState = {
  icon: string
  value: string
  label: string
  active: boolean
}

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  Users, TrendingUp, Globe, Award, Star, Briefcase,
  Building2, Clock, Target, Heart, Rocket, ThumbsUp,
}

const ICON_NAMES = Object.keys(ICONS)

function StatIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Star
  return <Icon className={className} />
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialStats: Stat[] = [
  { id: 1, icon: "Briefcase", value: "50+",  label: "Projects Completed", order: 1, active: true },
  { id: 2, icon: "Users",     value: "200+", label: "Happy Clients",      order: 2, active: true },
  { id: 3, icon: "Globe",     value: "10+",  label: "Countries Served",   order: 3, active: true },
  { id: 4, icon: "Star",      value: "4.9",  label: "Average Rating",     order: 4, active: true },
]

const emptyForm: FormState = { icon: "Briefcase", value: "", label: "", active: true }

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

// ─── Icon Picker ──────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field label="Icon">
      <div className="grid grid-cols-6 gap-2">
        {ICON_NAMES.map((name) => {
          const isSelected = value === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
              title={name}
            >
              <StatIcon name={name} className="h-4 w-4" />
              {isSelected && (
                <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-2 w-2" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Field>
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

// ─── Stat Form ────────────────────────────────────────────────────────────────

function StatForm({ value, onChange, onSubmit, onCancel, submitLabel }: {
  value: FormState
  onChange: (v: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <IconPicker value={value.icon} onChange={(icon) => onChange({ ...value, icon })} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Value" hint="e.g. 50+, 4.9, $2M">
          <Input
            placeholder="50+"
            value={value.value}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
          />
        </Field>
        <Field label="Label">
          <Input
            placeholder="Projects Completed"
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Active</p>
          <p className="text-xs text-muted-foreground">Show this stat on the homepage</p>
        </div>
        <Switch checked={value.active} onCheckedChange={(v) => onChange({ ...value, active: v })} />
      </div>

      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSubmit} disabled={!value.value || !value.label}>{submitLabel}</Button>
      </div>
    </div>
  )
}

// ─── Sortable Stat Row ────────────────────────────────────────────────────────

function SortableStatRow({ stat, onEdit, onDelete, onToggle }: {
  stat: Stat
  onEdit: (stat: Stat) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stat.id })
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
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        stat.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
      )}>
        <StatIcon name={stat.icon} className="h-4 w-4" />
      </div>

      <div className="flex items-baseline gap-2 min-w-[100px]">
        <span className={cn(
          "text-lg font-bold tabular-nums",
          !stat.active && "text-muted-foreground/40"
        )}>
          {stat.value}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm text-foreground truncate",
          !stat.active && "text-muted-foreground/40 line-through"
        )}>
          {stat.label}
        </p>
      </div>

      <Switch checked={stat.active} onCheckedChange={() => onToggle(stat.id)} />

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(stat)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onDelete(stat.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function StatsPreview({ stats }: { stats: Stat[] }) {
  const activeStats = stats.filter((s) => s.active)

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-4 pt-3 pb-2">
        Live Preview
      </p>
      <div className="border-t border-border bg-muted/10 px-6 py-8">
        {activeStats.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground/50 py-6">No active stats to display</p>
        ) : (
          <div className={cn(
            "grid gap-6",
            activeStats.length === 1 && "grid-cols-1",
            activeStats.length === 2 && "grid-cols-2",
            activeStats.length === 3 && "grid-cols-3",
            activeStats.length >= 4 && "grid-cols-2 md:grid-cols-4"
          )}>
            {activeStats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center text-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                  <StatIcon name={stat.icon} className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatsManager() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [stats, setStats] = React.useState<Stat[]>(initialStats)

  type ModalMode =
    | { type: "add" }
    | { type: "edit"; stat: Stat }
    | null

  const [modal, setModal] = React.useState<ModalMode>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function closeModal() {
    setModal(null)
    setForm(emptyForm)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = stats.findIndex((s) => s.id === active.id)
    const newIndex = stats.findIndex((s) => s.id === over.id)
    setStats((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function handleSubmit() {
    if (!modal) return

    if (modal.type === "add") {
      setStats((prev) => [
        ...prev,
        { id: Date.now(), ...form, order: prev.length + 1 },
      ])
    }
    if (modal.type === "edit") {
      setStats((prev) =>
        prev.map((s) => s.id === modal.stat.id ? { ...s, ...form } : s)
      )
    }

    closeModal()
  }

  const modalTitle = modal?.type === "add" ? "Add Stat" : "Edit Stat"
  const submitLabel = modal?.type === "add" ? "Add Stat" : "Save Changes"

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Stats</h1>
          <p className="text-xs text-muted-foreground">Home &rsaquo; Stats</p>
        </div>
        <Button size="sm" onClick={() => { setModal({ type: "add" }); setForm(emptyForm) }}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Stat
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">

        {/* Preview */}
        <StatsPreview stats={stats} />

        {/* List */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground px-1">
            Drag to reorder. Toggle to show or hide a stat on the homepage.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stats.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {stats.map((stat) => (
                  <SortableStatRow
                    key={stat.id}
                    stat={stat}
                    onEdit={(s) => { setModal({ type: "edit", stat: s }); setForm({ icon: s.icon, value: s.value, label: s.label, active: s.active }) }}
                    onDelete={(id) => setStats((prev) => prev.filter((s) => s.id !== id))}
                    onToggle={(id) => setStats((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {stats.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium text-foreground">No stats yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Add a stat to display on the homepage.</p>
              <Button size="sm" onClick={() => { setModal({ type: "add" }); setForm(emptyForm) }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Stat
              </Button>
            </div>
          )}
        </div>

        {/* Bottom save */}
        {stats.length > 0 && (
          <div className="flex justify-end pb-8">
            <Button variant="outline" size="sm" onClick={() => console.log("save order", stats)}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Order
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal title={modalTitle} open={!!modal} onClose={closeModal}>
        <StatForm
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