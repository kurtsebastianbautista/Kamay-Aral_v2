import { createClient } from '@/lib/supabase/server'
import SettingsTabs from '@/components/admin/SettingsTabs'
import TeacherAuditLogList from '@/components/teacher/TeacherAuditLogList'
import { getTeacherAuditLogs } from '@/lib/queries/teacher-audit-logs'

export default async function TeacherSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 200-row cap for v1 — server-side pagination is the follow-up if this grows.
  const { logs, sections } = await getTeacherAuditLogs(supabase, user!.id, { limit: 200 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Activity history for your sections.</p>
      </div>

      <SettingsTabs
        tabs={[
          {
            id: 'audit-logs',
            label: 'Audit Logs',
            content: <TeacherAuditLogList logs={logs} sections={sections} />,
          },
        ]}
      />
    </div>
  )
}
