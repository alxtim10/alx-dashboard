type HeroSlide = {
  id: number;
  image: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl: string;
  order: number;
  active: boolean;
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