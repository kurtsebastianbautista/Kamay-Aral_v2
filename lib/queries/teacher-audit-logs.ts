import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export interface TeacherAuditLog {
  id: string
  actor_name: string
  actor_role: string
  description: string
  created_at: string
  sectionId: string | null
  sectionName: string | null
}

/**
 * Logs visible to a teacher: their own actions plus their currently-assigned
 * students' own actions (enforced by RLS — see "Teachers: view own + their
 * students' audit logs" in schema.sql, not re-checked here).
 *
 * Student-authored rows (login, quiz submit) are always written with a NULL
 * section — they're resolved here to the student's CURRENT section instead,
 * which is what makes a removed student's history correctly stop appearing.
 * Teacher-authored, section-scoped rows already carry section_id/section_name
 * from write time and are used as-is.
 */
export async function getTeacherAuditLogs(
  supabase: SupabaseServerClient,
  teacherId: string,
  options?: { limit?: number },
): Promise<{ logs: TeacherAuditLog[]; sections: { id: string; name: string }[] }> {
  const { data: sections } = await supabase
    .from('sections')
    .select('id, name')
    .eq('teacher_id', teacherId)
    .order('name')

  let query = supabase
    .from('audit_logs')
    .select('id, actor_id, actor_name, actor_role, description, section_id, section_name, created_at')
    .order('created_at', { ascending: false })
  if (options?.limit) query = query.limit(options.limit)

  const { data: rows } = await query

  const sectionNameById = new Map((sections ?? []).map((s) => [s.id, s.name]))

  const studentActorIds = [
    ...new Set(
      (rows ?? [])
        .filter((r) => r.actor_role === 'student' && !r.section_id && r.actor_id)
        .map((r) => r.actor_id as string),
    ),
  ]

  const currentSectionByStudentId = new Map<string, string | null>()
  if (studentActorIds.length > 0) {
    const { data: students } = await supabase
      .from('students')
      .select('id, section_id')
      .in('id', studentActorIds)
    students?.forEach((s) => currentSectionByStudentId.set(s.id, s.section_id))
  }

  const logs: TeacherAuditLog[] = (rows ?? []).map((r) => {
    let sectionId = r.section_id
    let sectionName = r.section_name
    if (!sectionId && r.actor_role === 'student' && r.actor_id) {
      sectionId = currentSectionByStudentId.get(r.actor_id) ?? null
      sectionName = sectionId ? sectionNameById.get(sectionId) ?? null : null
    }
    return {
      id: r.id,
      actor_name: r.actor_name,
      actor_role: r.actor_role,
      description: r.description,
      created_at: r.created_at,
      sectionId,
      sectionName,
    }
  })

  return { logs, sections: sections ?? [] }
}
