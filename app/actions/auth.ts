'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { shadowEmailFor } from '@/lib/shadow-email'
import { sendPasswordResetEmail } from '@/lib/email/templates'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export async function requestPasswordResetAction(email: string) {
  const admin = createAdminClient()
  const trimmedEmail = email.trim()

  const { data: students } = await admin
    .from('students')
    .select('username, full_name, email')
    .ilike('email', trimmedEmail)

  for (const student of students ?? []) {
    if (!student.username) continue
    try {
      const { data, error } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: shadowEmailFor(student.username),
        options: { redirectTo: `${SITE_URL}/setup-password` },
      })
      if (!error) {
        await sendPasswordResetEmail(trimmedEmail, `${student.full_name}'s account`, data.properties.action_link)
      }
    } catch {
      // swallow — always return generic response below
    }
  }

  try {
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: trimmedEmail,
      options: { redirectTo: `${SITE_URL}/setup-password` },
    })
    if (!error) {
      await sendPasswordResetEmail(trimmedEmail, 'your account', data.properties.action_link)
    }
  } catch {
    // swallow — always return generic response below
  }

  return { message: 'If an account exists for that email, we\'ve sent a reset link.' }
}
