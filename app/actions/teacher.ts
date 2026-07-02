'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function createStudentAction(payload: {
  sectionId: string
  fullName: string
  email: string
  password: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify calling user owns the section (using their session + RLS)
  const { data: section } = await supabase
    .from('sections')
    .select('id')
    .eq('id', payload.sectionId)
    .eq('teacher_id', user.id)
    .single()
  if (!section) throw new Error('Section not found or access denied')

  const admin = createAdminClient()

  const { data, error: authError } = await admin.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
  })
  if (authError) throw new Error(authError.message)

  // Use teacher's session client so RLS (teacher manages students in their sections) applies
  const { error: studentError } = await supabase
    .from('students')
    .insert({ id: data.user.id, section_id: payload.sectionId, full_name: payload.fullName.trim() })
  if (studentError) {
    await admin.auth.admin.deleteUser(data.user.id)
    throw new Error(studentError.message)
  }
}
