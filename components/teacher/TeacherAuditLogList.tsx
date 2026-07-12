'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditLog {
  id: string
  actor_name: string
  actor_role: string
  description: string
  created_at: string
  sectionId: string | null
  sectionName: string | null
}

interface Section {
  id: string
  name: string
}

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  if (role === 'teacher') return 'default'
  return 'outline'
}

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export default function TeacherAuditLogList({ logs, sections }: { logs: AuditLog[]; sections: Section[] }) {
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter((log) => {
      if (sectionFilter !== 'all' && log.sectionId !== sectionFilter) return false
      if (!q) return true
      return (
        log.actor_name.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q)
      )
    })
  }, [logs, query, sectionFilter])

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSectionFilter('all')}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors border',
              sectionFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'text-muted-foreground border-border hover:bg-muted',
            )}
          >
            All
          </button>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSectionFilter(section.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors border',
                sectionFilter === section.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'text-muted-foreground border-border hover:bg-muted',
              )}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="flex items-start justify-between gap-3 rounded-xl border bg-white p-3.5 shadow-sm"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {log.actor_name[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{log.actor_name}</p>
                  <Badge variant={roleBadgeVariant(log.actor_role)} className="capitalize">
                    {log.actor_role}
                  </Badge>
                  {log.sectionName && (
                    <Badge variant="secondary">{log.sectionName}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{log.description}</p>
              </div>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              {formatter.format(new Date(log.created_at))}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {logs.length === 0 ? 'No activity recorded yet.' : 'No logs match your search.'}
          </p>
        )}
      </div>
    </div>
  )
}
