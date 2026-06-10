"use client";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { statsPage } from "@/constants";
import { Plus, Search, Filter, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StatsPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Statistics" description="Manage all your statistics" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search stats..."
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button
              onClick={() => {
                router.push("/home/stats/add");
              }}
              size="sm"
              className="gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              New Stat
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Icon
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {statsPage.statistics.map((stat: Stat) => (
                <tr
                  key={stat.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 rounded-lg">
                    <Image
                      src={
                        "https://itsec.asia/storage/photos/shares/projects.ad2150ebd5055caa.svg"
                      }
                      width={100}
                      height={100}
                      alt={stat.description}
                      className="rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-center">
                    {stat.order}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-center">
                    {stat.value}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    {stat.description}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/home/stats/${stat.id}/edit`)
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button>
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
