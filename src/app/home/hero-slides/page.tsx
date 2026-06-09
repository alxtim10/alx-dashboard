'use client'
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/constants";
import { Plus, Search, Filter, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSlidesPage() {

  const router = useRouter();

  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Hero Slides" description="Manage all your slides" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search slide..."
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
                router.push('/home/hero-slides/add')
              }}
              size="sm"
              className="gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              New Slide
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Thumbnail
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Mobile Thumbnail
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Subheadline
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Cta Label
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Cta URL
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell text-center">
                  Order
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center ">
                  Active
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {heroSlides.map((slide: HeroSlide) => (
                <tr
                  key={slide.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-2 rounded-lg text-center">
                    <Image
                      src={slide.image}
                      width={200}
                      height={100}
                      alt={slide.headline}
                      className="rounded-lg"
                    />
                  </td>
                  {slide.mobileImage ? (
                    <td className="p-2 rounded-lg text-center">
                      <Image
                        src={slide.mobileImage}
                        width={200}
                        height={100}
                        alt={slide.headline}
                        className="rounded-lg"
                      />
                    </td>
                  ) : (
                    <td className="text-center">No Image</td>
                  )}
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    {slide.headline}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell line-clamp-2 max-w-sm">
                    {slide.subheadline}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell line-clamp-2 max-w-sm">
                    {slide.ctaLabel}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell line-clamp-2 max-w-sm">
                    {slide.ctaUrl || slide.ctaExternal}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell text-center">
                    {slide.order}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-center text-white">
                    <span
                      className={`${slide.active ? "bg-green-500" : "bg-red-500"} px-2 py-1 rounded-md`}
                    >
                      {slide.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button>
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
