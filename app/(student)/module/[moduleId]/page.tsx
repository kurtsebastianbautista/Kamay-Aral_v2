import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getModule } from '@/content/registry'
import Link from 'next/link'
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react'

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params
  const mod = getModule(moduleId)
  if (!mod) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch completed quiz attempts for this student
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('submodule_id, score, total')
    .eq('student_id', user!.id)
    .not('submitted_at', 'is', null)

  // Fetch student's section for quiz settings
  const { data: student } = await supabase
    .from('students')
    .select('section_id')
    .eq('id', user!.id)
    .single()

  const { data: quizSettings } = await supabase
    .from('quiz_settings')
    .select('submodule_id, enabled')
    .eq('section_id', student?.section_id ?? '')

  function isQuizEnabled(submoduleId: string) {
    return quizSettings?.find((q) => q.submodule_id === submoduleId)?.enabled ?? false
  }

  function quizAttempt(submoduleId: string) {
    return attempts?.find((a) => a.submodule_id === submoduleId)
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <Link href="/dashboard" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{mod.icon}</span>
        <div>
          <h1 className="text-xl font-bold">{mod.title}</h1>
          <p className="text-sm text-muted-foreground">{mod.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {mod.subModules.map((sm, idx) => {
          const attempt = quizAttempt(sm.id)
          const quizEnabled = isQuizEnabled(sm.id)

          return (
            <div key={sm.id} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {idx + 1}
                  </span>
                  <h2 className="font-semibold">{sm.title}</h2>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/module/${moduleId}/${sm.id}/learn`}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-indigo-600 px-3 py-3 text-white text-sm font-medium active:scale-95 transition-transform"
                  >
                    <span className="text-lg">📖</span>
                    Learn
                  </Link>
                  <Link
                    href={`/module/${moduleId}/${sm.id}/activity`}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-3 text-white text-sm font-medium active:scale-95 transition-transform"
                  >
                    <span className="text-lg">🎮</span>
                    Activity
                  </Link>
                </div>

                <div className="mt-2">
                  {quizEnabled && !attempt ? (
                    <Link
                      href={`/module/${moduleId}/${sm.id}/quiz`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-white text-sm font-medium active:scale-95 transition-transform"
                    >
                      <span>📝</span>
                      Take Quiz
                    </Link>
                  ) : attempt ? (
                    <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Quiz completed
                      </div>
                      <span className="font-bold text-indigo-600">{attempt.score}/{attempt.total}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      Quiz not available yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
