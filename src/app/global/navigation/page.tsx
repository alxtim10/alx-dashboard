"use client"

import * as React from "react"
import {
  GripVertical, Plus, Pencil, Trash2, ChevronRight,
  ChevronDown, X, ExternalLink, Link2,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { KeyboardSensor } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type NavChild = {
  id: number
  label: string
  href: string
  active: boolean
}

type NavItem = {
  id: number
  label: string
  href: string
  order: number
  active: boolean
  children?: NavChild[]
}

type FormState = {
  label: string
  href: string
  active: boolean
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const initialNav: NavItem[] = [
  { id: 1, label: "Home",     href: "/",         order: 1, active: true },
  {
    id: 2,
    label: "Services",
    href: "/services",
    order: 2,
    active: true,
    children: [
      { id: 21, label: "Web Development", href: "/services/web",     active: true },
      { id: 22, label: "Mobile Apps",     href: "/services/mobile",  active: true },
      { id: 23, label: "Consulting",      href: "/services/consult", active: false },
    ],
  },
  { id: 3, label: "About",   href: "/about",   order: 3, active: true },
  { id: 4, label: "Contact", href: "/contact", order: 4, active: true },
]

const emptyForm: FormState = { label: "", href: "", active: true }

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({
  title, open, onClose, children,
}: {
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
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Link Form ────────────────────────────────────────────────────────────────

function LinkForm({
  value, onChange, onSubmit, onCancel, submitLabel,
}: {
  value: FormState
  onChange: (v: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Label</Label>
        <Input
          placeholder="e.g. Services"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">URL</Label>
        <div className="relative">
          <Input
            placeholder="/services or https://example.com"
            value={value.href}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
            className="pl-8"
          />
          {value.href.startsWith("http") ? (
            <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          ) : (
            <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Use <code className="bg-muted px-1 rounded text-[10px]">/path</code> for internal or a full URL for external links.
        </p>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Active</p>
          <p className="text-xs text-muted-foreground">Show this link in the navigation</p>
        </div>
        <Switch
          checked={value.active}
          onCheckedChange={(v) => onChange({ ...value, active: v })}
        />
      </div>
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSubmit} disabled={!value.label || !value.href}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}

// ─── Sortable Child Row ───────────────────────────────────────────────────────

function SortableChildRow({
  child, onEdit, onDelete, onToggle,
}: {
  child: NavChild
  onEdit: (child: NavChild) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: child.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 group",
        isDragging && "opacity-50 shadow-lg z-10 bg-background"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
      </button>
      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/30" />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", !child.active && "text-muted-foreground/50 line-through")}>
          {child.label}
        </p>
        <p className="text-xs text-muted-foreground/60 truncate">{child.href}</p>
      </div>
      <Switch checked={child.active} onCheckedChange={() => onToggle(child.id)} />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(child)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={() => onDelete(child.id)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

// ─── Sortable Parent Row ──────────────────────────────────────────────────────

function SortableParentRow({
  item, onEdit, onDelete, onToggle,
  onAddChild, onEditChild, onDeleteChild, onToggleChild,
  onReorderChildren,
}: {
  item: NavItem
  onEdit: (item: NavItem) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
  onAddChild: (parentId: number) => void
  onEditChild: (parentId: number, child: NavChild) => void
  onDeleteChild: (parentId: number, childId: number) => void
  onToggleChild: (parentId: number, childId: number) => void
  onReorderChildren: (parentId: number, newChildren: NavChild[]) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [expanded, setExpanded] = React.useState(true)
  const hasChildren = item.children && item.children.length > 0

  const childSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleChildDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !item.children) return
    const oldIndex = item.children.findIndex((c) => c.id === active.id)
    const newIndex = item.children.findIndex((c) => c.id === over.id)
    onReorderChildren(item.id, arrayMove(item.children, oldIndex, newIndex))
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
      {/* Parent row */}
      <div className="flex items-center gap-3 px-4 py-3 group">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
            hasChildren
              ? "text-muted-foreground hover:text-foreground"
              : "text-muted-foreground/20 pointer-events-none"
          )}
        >
          {hasChildren ? (
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", !expanded && "-rotate-90")} />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold truncate", !item.active && "text-muted-foreground/50 line-through")}>
            {item.label}
          </p>
          <p className="text-xs text-muted-foreground/60 truncate">{item.href}</p>
        </div>

        {hasChildren && (
          <span className="text-[10px] font-medium text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded-full">
            {item.children!.length}
          </span>
        )}

        <Switch checked={item.active} onCheckedChange={() => onToggle(item.id)} />

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddChild(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Add child link"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Children — own DnD context */}
      {hasChildren && expanded && (
        <div className="border-t border-border/50 bg-muted/10 px-4 py-3 space-y-2">
          <DndContext
            sensors={childSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleChildDragEnd}
          >
            <SortableContext
              items={item.children!.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {item.children!.map((child) => (
                <SortableChildRow
                  key={child.id}
                  child={child}
                  onEdit={(c) => onEditChild(item.id, c)}
                  onDelete={(id) => onDeleteChild(item.id, id)}
                  onToggle={(id) => onToggleChild(item.id, id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={() => onAddChild(item.id)}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add child link
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NavigationManager() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [items, setItems] = React.useState<NavItem[]>(initialNav)

  type ModalMode =
    | { type: "add-parent" }
    | { type: "edit-parent"; item: NavItem }
    | { type: "add-child"; parentId: number }
    | { type: "edit-child"; parentId: number; child: NavChild }
    | null

  const [modal, setModal] = React.useState<ModalMode>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function openModal(mode: ModalMode, prefill?: FormState) {
    setModal(mode)
    setForm(prefill ?? emptyForm)
  }

  function closeModal() {
    setModal(null)
    setForm(emptyForm)
  }

  function handleParentDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    setItems((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function handleReorderChildren(parentId: number, newChildren: NavChild[]) {
    setItems((prev) =>
      prev.map((item) => (item.id === parentId ? { ...item, children: newChildren } : item))
    )
  }

  function handleSubmit() {
    if (!modal) return

    if (modal.type === "add-parent") {
      setItems((prev) => [
        ...prev,
        { id: Date.now(), label: form.label, href: form.href, active: form.active, order: prev.length + 1 },
      ])
    }
    if (modal.type === "edit-parent") {
      setItems((prev) =>
        prev.map((item) =>
          item.id === modal.item.id ? { ...item, ...form } : item
        )
      )
    }
    if (modal.type === "add-child") {
      setItems((prev) =>
        prev.map((item) =>
          item.id === modal.parentId
            ? { ...item, children: [...(item.children ?? []), { id: Date.now(), ...form }] }
            : item
        )
      )
    }
    if (modal.type === "edit-child") {
      setItems((prev) =>
        prev.map((item) =>
          item.id === modal.parentId
            ? { ...item, children: item.children?.map((c) => c.id === modal.child.id ? { ...c, ...form } : c) }
            : item
        )
      )
    }

    closeModal()
  }

  const modalTitle =
    modal?.type === "add-parent" ? "Add Link" :
    modal?.type === "edit-parent" ? "Edit Link" :
    modal?.type === "add-child" ? "Add Child Link" :
    modal?.type === "edit-child" ? "Edit Child Link" : ""

  const submitLabel =
    modal?.type === "add-parent" || modal?.type === "add-child" ? "Add Link" : "Save Changes"

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Navigation</h1>
          <p className="text-xs text-muted-foreground">Global &rsaquo; Navigation</p>
        </div>
        <Button size="sm" onClick={() => openModal({ type: "add-parent" })}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Link
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-3">
        <p className="text-xs text-muted-foreground px-1 pb-2">
          Drag to reorder. Click <span className="font-medium text-foreground">+</span> on a link to add a dropdown child.
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleParentDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map((item) => (
                <SortableParentRow
                  key={item.id}
                  item={item}
                  onEdit={(i) => openModal({ type: "edit-parent", item: i }, { label: i.label, href: i.href, active: i.active })}
                  onDelete={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
                  onToggle={(id) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, active: !i.active } : i))}
                  onAddChild={(parentId) => openModal({ type: "add-child", parentId })}
                  onEditChild={(parentId, child) =>
                    openModal({ type: "edit-child", parentId, child }, { label: child.label, href: child.href, active: child.active })
                  }
                  onDeleteChild={(parentId, childId) =>
                    setItems((prev) =>
                      prev.map((i) => i.id === parentId ? { ...i, children: i.children?.filter((c) => c.id !== childId) } : i)
                    )
                  }
                  onToggleChild={(parentId, childId) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === parentId
                          ? { ...i, children: i.children?.map((c) => c.id === childId ? { ...c, active: !c.active } : c) }
                          : i
                      )
                    )
                  }
                  onReorderChildren={handleReorderChildren}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">No links yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Add your first navigation link to get started.</p>
            <Button size="sm" onClick={() => openModal({ type: "add-parent" })}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Link
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={() => console.log("save order", items)}>
              Save Order
            </Button>
          </div>
        )}
      </div>

      <Modal title={modalTitle} open={!!modal} onClose={closeModal}>
        <LinkForm
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