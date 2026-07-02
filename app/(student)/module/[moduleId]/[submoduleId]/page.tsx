import { redirect } from 'next/navigation'

// /module/[moduleId]/[submoduleId] — redirect to the module overview
export default async function SubmoduleRootPage({
  params,
}: {
  params: Promise<{ moduleId: string; submoduleId: string }>
}) {
  const { moduleId } = await params
  redirect(`/module/${moduleId}`)
}
