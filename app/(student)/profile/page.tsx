import { createClient } from '@/lib/supabase/server'
import { MODULES } from '@/content/registry'
import ProgressRing from '@/components/student/ProgressRing'
import LogoutButton from '@/components/shared/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: student } = await supabase
    .from('students')
    .select('full_name, created_at')
    .eq('id', user!.id)
    .single()

  const { data: learnRows } = await supabase
    .from('learn_progress')
    .select('module_id, item_id')
    .eq('student_id', user!.id)

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('submodule_id, score, total, submitted_at')
    .eq('student_id', user!.id)
    .not('submitted_at', 'is', null)

  function moduleProgress(moduleId: string, totalItems: number): number {
    if (totalItems === 0) return 0
    const viewed = learnRows?.filter((r) => r.module_id === moduleId).length ?? 0
    return Math.round((viewed / totalItems) * 100)
  }

  return (
    <div className="px-4 pt-8 pb-4 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
          {student?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className="text-xl font-bold">{student?.full_name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Module Progress
        </h2>
        <div className="space-y-3">
          {MODULES.map((mod) => {
            const totalItems = mod.subModules.reduce((sum, sm) => sum + sm.items.length, 0)
            const percent = moduleProgress(mod.id, totalItems)
            return (
              <div key={mod.id} className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm">
                <span className="text-2xl">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{mod.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {totalItems > 0 ? `${Math.round((percent / 100) * totalItems)}/${totalItems} items viewed` : 'Coming soon'}
                  </p>
                </div>
                <ProgressRing percent={percent} size={44} strokeWidth={4} />
              </div>
            )
          })}
        </div>
      </div>

      {attempts && attempts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Completed Quizzes
          </h2>
          <div className="space-y-2">
            {attempts.map((a) => (
              <div key={a.submodule_id} className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm">
                <p className="text-sm font-medium">{a.submodule_id}</p>
                <span className="text-sm font-bold text-indigo-600">
                  {a.score}/{a.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <LogoutButton />
    </div>
  )
}
