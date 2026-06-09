import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter } from "lucide-react"

const posts = [
  { id: 1, title: "Getting Started with Next.js 15", author: "John Doe", category: "Tech", status: "published", views: "2.4K", date: "Jun 4, 2026" },
  { id: 2, title: "Tailwind CSS Best Practices", author: "Jane Smith", category: "Design", status: "published", views: "1.8K", date: "Jun 3, 2026" },
  { id: 3, title: "The Future of TypeScript", author: "John Doe", category: "Tech", status: "draft", views: "—", date: "Jun 2, 2026" },
  { id: 4, title: "Building Scalable APIs", author: "Alex Brown", category: "Backend", status: "review", views: "—", date: "Jun 1, 2026" },
  { id: 5, title: "Database Design Patterns", author: "Jane Smith", category: "Backend", status: "published", views: "3.1K", date: "May 30, 2026" },
]

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
  review: "bg-amber-50 text-amber-700",
}

export default function PostsPage() {
  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Posts" description="Manage all your content" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search posts..." className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Filter className="h-3.5 w-3.5" />Filter</Button>
            <Button size="sm" className="gap-2"><Plus className="h-3.5 w-3.5" />New Post</Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Views</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-foreground">{post.title}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{post.author}</td>
                  <td className="px-6 py-4 hidden lg:table-cell"><span className="rounded-full bg-violet-50 text-violet-700 px-2.5 py-0.5 text-xs font-medium">{post.category}</span></td>
                  <td className="px-6 py-4"><span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + statusColors[post.status]}>{post.status}</span></td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{post.views}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
