'use client'

import * as React from "react"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { testimonials as initialTestimonials } from "@/constants"
import {
  Plus, Search, Filter, Edit, Trash2, Star,
  MessageSquare, MoreHorizontal, Eye, EyeOff,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = React.useState(initialTestimonials)
  const [search, setSearch] = React.useState("")
  const [filterActive, setFilterActive] = React.useState<"all" | "active" | "inactive">("all")
  const [deleteConfirm, setDeleteConfirm] = React.useState<number | null>(null)

  const filtered = testimonials
    .filter((t) => {
      if (filterActive === "active") return t.active
      if (filterActive === "inactive") return !t.active
      return true
    })
    .filter((t) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q)
      )
    })

  function handleDelete(id: number) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
    setDeleteConfirm(null)
    console.log("Deleted testimonial:", id)
  }

  function handleToggleActive(id: number) {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    )
    console.log("Toggled testimonial active:", id)
  }

  const activeCount = testimonials.filter((t) => t.active).length
  const inactiveCount = testimonials.filter((t) => !t.active).length

  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Testimonials" description="Manage customer testimonials and reviews" />

      <div className="flex-1 p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-foreground">{testimonials.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inactive</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{inactiveCount}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-md border border-input overflow-hidden">
              {(["all", "active", "inactive"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setFilterActive(value)}
                  className={cn(
                    "px-3 h-9 text-xs font-medium capitalize transition-colors",
                    filterActive === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            <Button
              onClick={() => router.push('/home/testimonials/add')}
              size="sm"
              className="gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white h-9"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Testimonial
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Person
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Quote
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell text-center">
                  Rating
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell text-center">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell text-center">
                  Updated
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">No testimonials found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {search.trim()
                            ? "Try adjusting your search or filter criteria."
                            : "Add your first testimonial to get started."}
                        </p>
                      </div>
                      {!search.trim() && (
                        <Button
                          size="sm"
                          className="mt-2 gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white"
                          onClick={() => router.push('/home/testimonials/add')}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Testimonial
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Person */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
                          <Image
                            src={testimonial.avatar}
                            width={40}
                            height={40}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {testimonial.role} · {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Quote */}
                    <td className="px-6 py-4 hidden lg:table-cell max-w-md">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 hidden md:table-cell text-center">
                      <div className="flex justify-center">
                        <StarRating rating={testimonial.rating} />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 hidden sm:table-cell text-center">
                      <button
                        onClick={() => handleToggleActive(testimonial.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
                          testimonial.active
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-orange-400/10 text-orange-500 hover:bg-orange-400/20"
                        )}
                      >
                        {testimonial.active ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Updated */}
                    <td className="px-6 py-4 text-muted-foreground hidden xl:table-cell text-center text-xs">
                      {formatDate(testimonial.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {deleteConfirm === testimonial.id ? (
                          <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                            <span className="text-xs text-destructive font-medium mr-1">Delete?</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              onClick={() => handleDelete(testimonial.id)}
                            >
                              Confirm
                            </Button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => router.push(`/home/testimonials/${testimonial.id}/edit`)}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(testimonial.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <p>
              Showing {filtered.length} of {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}
            </p>
            <p className="text-muted-foreground/50">
              Changes are saved to console only (mock data)
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
