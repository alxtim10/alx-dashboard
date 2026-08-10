import StatsForm from "@/components/pages/home/stats/StatsForm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <StatsForm id={id} />
}