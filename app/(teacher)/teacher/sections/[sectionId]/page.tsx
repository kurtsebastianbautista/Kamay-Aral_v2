import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MODULES } from '@/content/registry'
import Link from 'next/link'
import QuizToggle from '@/components/teacher/QuizToggle'
import CreateStudentForm from '@/components/teacher/CreateStudentForm'
import { ChevronLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface Props { params: Promise<{ sectionId: string }> }

export default async function SectionDetailPage({ params }: Props) {
  const { sectionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: section } = await supabase
    .from('sections')
    .select('id, name, teacher_id')
    .eq('id', sectionId)
    .single()

  if (!section || section.teacher_id !== user!.id) notFound()

  const { data: students } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('section_id', sectionId)
    .order('full_name')

  const { data: quizSettings } = await supabase
    .from('quiz_settings')
    .select('submodule_id, enabled')
    .eq('section_id', sectionId)

  function isEnabled(submoduleId: string) {
    return quizSettings?.find((q) => q.submodule_id === submoduleId)?.enabled ?? false
  }

  const studentIds = students?.map((s) => s.id) ?? []
  const { data: attempts } = studentIds.length > 0
    ? await supabase
        .from('quiz_attempts')
        .select('student_id, submodule_id, score, total')
        .in('student_id', studentIds)
        .not('submitted_at', 'is', null)
    : { data: [] }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/teacher/sections" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" /> Sections
        </Link>
        <h1 className="text-2xl font-bold">Section: {section.name}</h1>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Students ({students?.length ?? 0})</h2>
        <CreateStudentForm sectionId={sectionId} />

        <div className="mt-3 space-y-2">
          {students?.map((student) => {
            const studentAttempts = attempts?.filter((a) => a.student_id === student.id) ?? []
            const avg = studentAttempts.length > 0
              ? Math.round(
                  studentAttempts.reduce((acc, a) => acc + (a.total ? (a.score ?? 0) / a.total : 0), 0)
                  / studentAttempts.length * 100
                )
              : null

            return (
              <Link
                key={student.id}
                href={`/teacher/sections/${sectionId}/students/${student.id}`}
                className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                    {student.full_name[0].toUpperCase()}
                  </div>
                  <p className="font-medium">{student.full_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {avg !== null && (
                    <span className={`text-sm font-bold ${avg >= 80 ? 'text-emerald-600' : avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {avg}% avg
                    </span>
                  )}
                  <span className="text-muted-foreground">›</span>
                </div>
              </Link>
            )
          })}
          {(!students || students.length === 0) && (
            <p className="text-center text-muted-foreground py-4">No students yet.</p>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-1">Quiz Settings</h2>
        <p className="text-sm text-muted-foreground mb-3">Enable quizzes per sub-module for this section.</p>
        <div className="space-y-2">
          {MODULES.flatMap((mod) =>
            mod.subModules.map((sm) => (
              <div key={sm.id} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
                <div>
                  <p className="font-medium text-sm">{mod.title}</p>
                  <p className="text-xs text-muted-foreground">{sm.title}</p>
                </div>
                <QuizToggle
                  sectionId={sectionId}
                  submoduleId={sm.id}
                  initialEnabled={isEnabled(sm.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
