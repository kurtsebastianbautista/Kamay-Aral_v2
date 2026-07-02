import { notFound } from 'next/navigation'
import { getSubModule, getModule } from '@/content/registry'
import ActivityRunner from '@/components/activities/ActivityRunner'

interface Props {
  params: Promise<{ moduleId: string; submoduleId: string }>
}

export default async function ActivityPage({ params }: Props) {
  const { moduleId, submoduleId } = await params
  const mod = getModule(moduleId)
  const submodule = getSubModule(moduleId, submoduleId)
  if (!mod || !submodule) notFound()

  return <ActivityRunner module={mod} submodule={submodule} mode="activity" />
}
