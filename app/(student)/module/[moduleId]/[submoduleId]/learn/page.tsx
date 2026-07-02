import { notFound } from 'next/navigation'
import { getSubModule, getModule } from '@/content/registry'
import LearnModeClient from '@/components/student/LearnModeClient'

interface Props {
  params: Promise<{ moduleId: string; submoduleId: string }>
}

export default async function LearnPage({ params }: Props) {
  const { moduleId, submoduleId } = await params
  const mod = getModule(moduleId)
  const submodule = getSubModule(moduleId, submoduleId)
  if (!mod || !submodule) notFound()

  return <LearnModeClient module={mod} submodule={submodule} />
}
