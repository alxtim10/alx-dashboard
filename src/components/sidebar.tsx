"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Settings, ChevronLeft, Layers,
  Globe, Users, ChevronDown, Image, AlignLeft, Star,
  BarChart3, Phone, Building2, MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from "./ui/tooltip"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { bottomNav, contentNav, globalNav, mainNav } from "@/constants"

function NavLink({
  item,
  collapsed,
  pathname,
}: {
  item: NavItem | NavChild
  collapsed: boolean
  pathname: string
}) {
  const isActive = pathname === item.href
  const Icon = item.icon

  const linkContent = (
    <Link
      href={item.href!}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "transition-colors duration-150",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive
            ? "text-sidebar-primary-foreground"
            : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
        )}
      />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

// ─── Accordion item (has children) ───────────────────────────────────────────

function NavAccordion({
  item,
  collapsed,
  pathname,
}: {
  item: NavItem
  collapsed: boolean
  pathname: string
}) {
  const Icon = item.icon
  const isChildActive = item.children?.some((c) => pathname === c.href) ?? false

  // Auto-open if a child is active
  const [open, setOpen] = React.useState(isChildActive)

  // Re-open when navigating directly to a child route
  React.useEffect(() => {
    if (isChildActive) setOpen(true)
  }, [isChildActive])

  if (collapsed) {
    // In collapsed mode render a tooltip that lists children
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "group flex w-full items-center justify-center rounded-lg px-3 py-2.5",
              "transition-colors duration-150 hover:bg-sidebar-accent",
              isChildActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="p-0 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b">
            {item.label}
          </div>
          <div className="py-1">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm",
                  "hover:bg-accent transition-colors",
                  pathname === child.href ? "text-primary font-medium" : "text-foreground/70"
                )}
              >
                <child.icon className="h-3.5 w-3.5 shrink-0" />
                {child.label}
              </Link>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div>
      {/* Accordion trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
          "transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isChildActive
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/70"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isChildActive
              ? "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
          )}
        />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200 group-hover:text-sidebar-accent-foreground",
            open && "rotate-180 group-hover:text-sidebar-accent-foreground"
          )}
        />
      </button>

      {/* Children */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3 pb-1">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
                "transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                pathname === child.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/60"
              )}
            >
              <child.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function NavSection({
  items,
  collapsed,
  pathname,
}: {
  items: NavItem[]
  collapsed: boolean
  pathname: string
}) {
  return (
    <nav className="space-y-0.5">
      {items.map((item) =>
        item.children ? (
          <NavAccordion key={item.label} item={item} collapsed={collapsed} pathname={pathname} />
        ) : (
          <NavLink key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        )
      )}
    </nav>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { isOpen, toggle } = useSidebar()
  const pathname = usePathname()
  const collapsed = !isOpen

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        style={{ width: isOpen ? "16rem" : "4rem", willChange: "width" }}
        className="relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4",
            isOpen ? "justify-between" : "justify-center"
          )}
        >
          {isOpen ? (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
                <Layers className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-sm font-bold tracking-tight text-sidebar-foreground truncate">
                  CMS Dashboard
                </span>
                <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">
                  Dashboard
                </span>
              </div>
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm hover:bg-sidebar-primary/90 transition-colors"
                >
                  <Layers className="h-4 w-4 text-sidebar-primary-foreground" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">ContentOS CMS</TooltipContent>
            </Tooltip>
          )}

          {isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-7 w-7 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Scrollable nav */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Main */}
          <NavSection items={mainNav} collapsed={collapsed} pathname={pathname} />

          <Separator className="my-3 bg-sidebar-border" />

          {/* Content */}
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Content
            </p>
          )}
          <NavSection items={contentNav} collapsed={collapsed} pathname={pathname} />

          <Separator className="my-3 bg-sidebar-border" />

          {/* Global */}
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Global
            </p>
          )}
          <NavSection items={globalNav} collapsed={collapsed} pathname={pathname} />
        </div>

        {/* Bottom nav */}
        <div className="border-t border-sidebar-border p-3 space-y-0.5">
          <NavSection items={bottomNav} collapsed={collapsed} pathname={pathname} />
        </div>

        {/* Collapsed toggle bubble */}
        {!isOpen && (
          <button
            onClick={toggle}
            className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-background shadow-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-3 w-3 rotate-180" />
          </button>
        )}
      </aside>
    </TooltipProvider>
  )
}