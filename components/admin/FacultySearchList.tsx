'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Search, Users } from 'lucide-react'

interface Teacher {
  id: string
  full_name: string
  sectionCount: number
}

export default function FacultySearchList({ teachers }: { teachers: Teacher[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter((t) => t.full_name.toLowerCase().includes(q))
  }, [teachers, query])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teachers…"
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((teacher) => (
          <Link
            key={teacher.id}
            href={`/admin/faculty/${teacher.id}`}
            className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold">{teacher.full_name}</p>
                <p className="text-sm text-muted-foreground">{teacher.sectionCount} sections</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No teachers found.</p>
        )}
      </div>
    </div>
  )
}
