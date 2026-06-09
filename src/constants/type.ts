type HeroSlide = {
  id: number;
  image: string;
  mobileImage?: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl?: string;
  ctaExternal?: string;
  alt?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type NavChild = {
  label: string
  href: string
  icon: React.ElementType
}

type NavItem = {
  label: string
  href?: string
  icon: React.ElementType
  children?: NavChild[]
}