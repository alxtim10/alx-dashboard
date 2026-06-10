import {
  LayoutDashboard, FileText, Settings, Layers,
  Globe, Users, Image, AlignLeft, Star,
  BarChart3, Phone, Building2, MessageSquare,
} from "lucide-react"

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1758035453658-9268bbaf8e29?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    mobileImage: "https://images.unsplash.com/photo-1758035453658-9268bbaf8e29?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    headline: "We Build Solutions That Matter",
    subheadline: "Delivering innovative technology and consulting services to help your business grow",
    ctaLabel: "Discover Our Services",
    ctaUrl: "/services",
    order: 1,
    alt: "Hero Slide 1",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1688494930244-6a7d73e4010a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    headline: "10 Years of Trusted Partnership",
    subheadline: "Over 200 clients across Southeast Asia trust us to deliver results on time, every time",
    ctaLabel: "See Our Story",
    ctaExternal: "https://www.google.com",
    order: 2,
    alt: "Hero Slide 2",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
]

export const contentNav: NavItem[] = [
  {
    label: "Homepage",
    icon: Layers,
    children: [
      { label: "Hero Slides",       href: "/content/homepage/hero-slides",  icon: Image },
      { label: "Stats",             href: "/content/homepage/stats",         icon: BarChart3 },
      { label: "Services Preview",  href: "/content/homepage/services",      icon: Star },
      { label: "Testimonials",      href: "/content/homepage/testimonials",  icon: MessageSquare },
      { label: "Page SEO",          href: "/content/homepage/seo",           icon: Globe },
    ],
  },
  {
    label: "About",
    icon: Building2,
    children: [
      { label: "Company Story",   href: "/content/about/story",      icon: AlignLeft },
      { label: "Mission & Vision",href: "/content/about/mission",    icon: Star },
      { label: "Team Members",    href: "/content/about/team",       icon: Users },
      { label: "Milestones",      href: "/content/about/milestones", icon: BarChart3 },
      { label: "Page SEO",        href: "/content/about/seo",        icon: Globe },
    ],
  },
  {
    label: "Services",
    icon: FileText,
    children: [
      { label: "Service List", href: "/content/services/list", icon: AlignLeft },
      { label: "Page SEO",     href: "/content/services/seo",  icon: Globe },
    ],
  },
  {
    label: "Contact",
    icon: Phone,
    children: [
      { label: "Contact Info",       href: "/content/contact/info",      icon: AlignLeft },
      { label: "Office Locations",   href: "/content/contact/locations", icon: Building2 },
      { label: "Page SEO",           href: "/content/contact/seo",       icon: Globe },
    ],
  },
]

export const globalNav: NavItem[] = [
  { label: "Site Settings", href: "/global/settings",   icon: Settings },
  { label: "Navigation",    href: "/global/navigation", icon: Layers },
  { label: "Footer",        href: "/global/footer",     icon: AlignLeft },
]

export const bottomNav: NavItem[] = [
  { label: "Users",    href: "/users",    icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
]

export const statsPage: StatsPage = {
  title: "Explore Our Impressive Performance and Achievements",
  statistics: [
    {
      id: 1,
      icon: 'https://itsec.asia/storage/photos/shares/projects.ad2150ebd5055caa.svg',
      value: "100",
      description: "Clients Served",
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      icon: 'https://itsec.asia/storage/photos/shares/projects.ad2150ebd5055caa.svg',
      value: "500",
      description: "Projects Completed",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
}