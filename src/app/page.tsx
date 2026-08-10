import { Topbar } from "@/components/topbar"
import Link from "next/link"
import {
  Image,
  BarChart3,
  MessageSquare,
  Globe,
  Layers,
  Settings,
  Users,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pencil,
  Plus,
  Eye,
  Activity,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── CMS Summary Cards ─────────────────────────────────────────────────────── */

type SummaryCard = {
  label: string
  value: string
  description: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  href: string
}

const summaryCards: SummaryCard[] = [
  {
    label: "Hero Slides",
    value: "2",
    description: "active slides",
    icon: Image,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
    href: "/home/hero-slides",
  },
  {
    label: "Statistics",
    value: "2",
    description: "metrics displayed",
    icon: BarChart3,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100",
    href: "/home/stats",
  },
  {
    label: "Testimonials",
    value: "4",
    description: "3 published",
    icon: MessageSquare,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    href: "/home/testimonials",
  },
  {
    label: "Site Pages",
    value: "5",
    description: "sections managed",
    icon: Layers,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    href: "/global/navigation",
  },
]

/* ─── Quick Actions ──────────────────────────────────────────────────────────── */

type QuickAction = {
  label: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    label: "Edit Hero Slides",
    description: "Update homepage carousel",
    icon: Image,
    href: "/home/hero-slides",
    color: "group-hover:text-violet-600",
  },
  {
    label: "Manage Stats",
    description: "Edit company metrics",
    icon: BarChart3,
    href: "/home/stats",
    color: "group-hover:text-sky-600",
  },
  {
    label: "Testimonials",
    description: "Add or edit reviews",
    icon: MessageSquare,
    href: "/home/testimonials",
    color: "group-hover:text-amber-600",
  },
  {
    label: "Site Settings",
    description: "Branding & metadata",
    icon: Settings,
    href: "/global/settings",
    color: "group-hover:text-slate-600",
  },
  {
    label: "Navigation",
    description: "Menu structure",
    icon: Layers,
    href: "/global/navigation",
    color: "group-hover:text-emerald-600",
  },
  {
    label: "Footer",
    description: "Footer content",
    icon: Globe,
    href: "/global/footer",
    color: "group-hover:text-cyan-600",
  },
]

/* ─── Content Health ─────────────────────────────────────────────────────────── */

type ContentStatus = "live" | "draft" | "needs-review"

type ContentSection = {
  label: string
  page: string
  status: ContentStatus
  lastUpdated: string
  href: string
}

const contentSections: ContentSection[] = [
  { label: "Hero Slides", page: "Homepage", status: "live", lastUpdated: "2 hours ago", href: "/home/hero-slides" },
  { label: "Stats Section", page: "Homepage", status: "live", lastUpdated: "1 day ago", href: "/home/stats" },
  { label: "Services Preview", page: "Homepage", status: "draft", lastUpdated: "3 days ago", href: "/home/services-preview" },
  { label: "Partners", page: "Homepage", status: "needs-review", lastUpdated: "5 days ago", href: "/home/partners" },
  { label: "Testimonials", page: "Homepage", status: "live", lastUpdated: "12 hours ago", href: "/home/testimonials" },
  { label: "Page SEO", page: "Homepage", status: "draft", lastUpdated: "1 week ago", href: "/home/seo" },
]

const statusConfig: Record<ContentStatus, { label: string; icon: LucideIcon; dot: string; text: string; badge: string }> = {
  live: { label: "Live", icon: CheckCircle2, dot: "bg-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700" },
  draft: { label: "Draft", icon: Clock, dot: "bg-slate-400", text: "text-slate-600", badge: "bg-slate-100 text-slate-600" },
  "needs-review": { label: "Review", icon: AlertTriangle, dot: "bg-amber-500", text: "text-amber-700", badge: "bg-amber-50 text-amber-700" },
}

/* ─── Activity Feed ──────────────────────────────────────────────────────────── */

type ActivityItem = {
  id: number
  action: "created" | "updated" | "published" | "reordered"
  target: string
  section: string
  user: string
  time: string
}

const activityFeed: ActivityItem[] = [
  { id: 1, action: "updated", target: "Hero Slide #1", section: "Hero Slides", user: "John", time: "2 hours ago" },
  { id: 2, action: "published", target: "Ahmad Rizaldi testimonial", section: "Testimonials", user: "John", time: "5 hours ago" },
  { id: 3, action: "reordered", target: "Statistics section", section: "Stats", user: "John", time: "Yesterday" },
  { id: 4, action: "created", target: "New hero slide", section: "Hero Slides", user: "Admin", time: "2 days ago" },
  { id: 5, action: "updated", target: "Site navigation menu", section: "Navigation", user: "Admin", time: "3 days ago" },
]

const actionConfig: Record<ActivityItem["action"], { icon: LucideIcon; color: string; bg: string }> = {
  created: { icon: Plus, color: "text-emerald-600", bg: "bg-emerald-100" },
  updated: { icon: Pencil, color: "text-sky-600", bg: "bg-sky-100" },
  published: { icon: Eye, color: "text-violet-600", bg: "bg-violet-100" },
  reordered: { icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-100" },
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const liveCount = contentSections.filter((s) => s.status === "live").length
  const draftCount = contentSections.filter((s) => s.status === "draft").length
  const reviewCount = contentSections.filter((s) => s.status === "needs-review").length

  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Dashboard" description="Company profile CMS overview" />

      <div className="flex-1 p-6 space-y-6">
        {/* ── Summary Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                  <div className={cn("rounded-lg p-2 transition-transform duration-200 group-hover:scale-110", card.iconBg)}>
                    <Icon className={cn("h-4 w-4", card.iconColor)} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-foreground tracking-tight">{card.value}</span>
                    <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Jump to frequently used content editors</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    "group flex flex-col items-center gap-2.5 p-5 text-center transition-colors duration-150 hover:bg-muted/50",
                    i < quickActions.length - 1 && "border-r border-border",
                    i < quickActions.length - (quickActions.length <= 3 ? 1 : 3) && "border-b border-border lg:border-b-0",
                  )}
                >
                  <div className="rounded-xl bg-muted/60 p-3 transition-all duration-200 group-hover:bg-muted group-hover:scale-105">
                    <Icon className={cn("h-5 w-5 text-muted-foreground transition-colors duration-200", action.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Content Health + Activity Feed ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Content Health — wider */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">Content Health</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Status of all managed sections</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill dot="bg-emerald-500" label={`${liveCount} Live`} />
                <StatusPill dot="bg-slate-400" label={`${draftCount} Draft`} />
                <StatusPill dot="bg-amber-500" label={`${reviewCount} Review`} />
              </div>
            </div>
            <div className="divide-y divide-border">
              {contentSections.map((section) => {
                const cfg = statusConfig[section.status]
                return (
                  <Link
                    key={section.label}
                    href={section.href}
                    className="group flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{section.label}</p>
                      <p className="text-[11px] text-muted-foreground">{section.page}</p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">{section.lastUpdated}</span>
                    <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full", cfg.badge)}>
                      {cfg.label}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-200 shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Activity Feed — narrower */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest CMS changes</p>
            </div>
            <div className="divide-y divide-border">
              {activityFeed.map((item) => {
                const cfg = actionConfig[item.action]
                const ActionIcon = cfg.icon
                return (
                  <div key={item.id} className="flex items-start gap-3 px-6 py-3.5">
                    <div className={cn("rounded-lg p-1.5 mt-0.5 shrink-0", cfg.bg)}>
                      <ActionIcon className={cn("h-3.5 w-3.5", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{item.user}</span>
                        <span className="text-muted-foreground"> {item.action} </span>
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Site Overview Bar ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Site Status</p>
                <p className="text-xs text-muted-foreground">Your company website is live</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <OverviewStat icon={Layers} label="Pages" value="5" />
              <OverviewStat icon={Image} label="Media Items" value="8" />
              <OverviewStat icon={Users} label="Team Members" value="1" />
              <OverviewStat icon={Activity} label="Uptime" value="99.9%" />
            </div>
            <div className="sm:ml-auto">
              <Link
                href="/global/settings"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                Site Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ─── Small helper components ────────────────────────────────────────────────── */

function StatusPill({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  )
}

function OverviewStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
