import { Topbar } from "@/components/topbar"
import {
  FileText,
  Eye,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

const stats = [
  { label: "Total Posts", value: "248", change: "+12%", up: true, icon: FileText, color: "text-violet-500", bg: "bg-violet-50" },
  { label: "Page Views", value: "84.2K", change: "+8.1%", up: true, icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Users", value: "1,429", change: "-2.3%", up: false, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Engagement", value: "6.4%", change: "+1.2%", up: true, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
]

const recentPosts = [
  { title: "Getting Started with Next.js 15", status: "published", views: "2.4K", date: "2 hours ago" },
  { title: "Tailwind CSS Best Practices for 2026", status: "published", views: "1.8K", date: "5 hours ago" },
  { title: "The Future of TypeScript", status: "draft", views: "—", date: "Yesterday" },
  { title: "Building Scalable APIs with tRPC", status: "review", views: "—", date: "2 days ago" },
  { title: "Database Design Patterns", status: "published", views: "3.1K", date: "3 days ago" },
]

type StatusKey = "published" | "draft" | "review"
const statusConfig: Record<StatusKey, { label: string; icon: typeof CheckCircle2; class: string }> = {
  published: { label: "Published", icon: CheckCircle2, class: "text-emerald-600 bg-emerald-50" },
  draft: { label: "Draft", icon: Clock, class: "text-gray-500 bg-gray-100" },
  review: { label: "In Review", icon: AlertCircle, class: "text-amber-600 bg-amber-50" },
}

export default function DashboardPage() {
  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Dashboard" description="Welcome back, John" />
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  <div className={"rounded-lg p-2 " + stat.bg}>
                    <Icon className={"h-4 w-4 " + stat.color} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <div className={"flex items-center gap-1 text-xs font-medium " + (stat.up ? "text-emerald-600" : "text-red-500")}>
                    {stat.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {stat.change}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent Posts</h2>
              <p className="text-xs text-muted-foreground">Latest content activity</p>
            </div>
            <a href="/posts" className="text-xs font-medium text-primary hover:underline">View all</a>
          </div>
          <div className="divide-y divide-border">
            {recentPosts.map((post) => {
              const s = statusConfig[post.status as StatusKey]
              const StatusIcon = s.icon
              return (
                <div key={post.title} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {post.views !== "—" && <span className="text-xs text-muted-foreground hidden sm:block">{post.views} views</span>}
                    <div className={"flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium " + s.class}>
                      <StatusIcon className="h-3 w-3" />
                      {s.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
