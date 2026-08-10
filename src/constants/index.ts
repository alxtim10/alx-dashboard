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

export const testimonials: Testimonial[] = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Ahmad Rizaldi",
    role: "Chief Technology Officer",
    company: "PT Nusantara Digital",
    quote: "Working with this team has been a game-changer for our digital transformation. Their expertise in cloud infrastructure and security helped us scale our platform to serve millions of users across Southeast Asia.",
    rating: 5,
    active: true,
    order: 1,
    createdAt: "2026-06-15T08:30:00.000Z",
    updatedAt: "2026-07-20T14:15:00.000Z",
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechBridge Solutions",
    quote: "Exceptional service delivery and attention to detail. They understood our complex requirements and delivered a solution that exceeded our expectations within the agreed timeline.",
    rating: 5,
    active: true,
    order: 2,
    createdAt: "2026-05-10T10:00:00.000Z",
    updatedAt: "2026-06-28T09:45:00.000Z",
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Michael Tanaka",
    role: "Managing Director",
    company: "Asia Pacific Holdings",
    quote: "Their consulting team provided invaluable insights that helped us restructure our IT operations. The ROI we have seen in the first year alone justified the entire engagement.",
    rating: 4,
    active: true,
    order: 3,
    createdAt: "2026-04-22T12:00:00.000Z",
    updatedAt: "2026-05-15T16:30:00.000Z",
  },
  {
    id: 4,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Diana Putri",
    role: "Head of Product",
    company: "Kreasi Bangsa",
    quote: "From initial discovery to final deployment, the process was seamless. Their agile approach and transparent communication made us feel like true partners throughout the project.",
    rating: 5,
    active: false,
    order: 4,
    createdAt: "2026-03-08T07:15:00.000Z",
    updatedAt: "2026-04-12T11:00:00.000Z",
  },
]