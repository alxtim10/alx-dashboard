import HeroSlideForm from "@/components/pages/home/hero-slides/page"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <HeroSlideForm id={id} />
}