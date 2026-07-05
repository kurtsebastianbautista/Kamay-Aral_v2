'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeStudentFromSectionAction } from '@/app/actions/admin'

export default function RemoveFromSectionButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRemove() {
    if (!confirm('Remove this student from the section? Their account will not be deleted.')) return
    setLoading(true)
    try {
      await removeStudentFromSectionAction(studentId)
      toast.success('Student removed from section')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={loading}
      className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
    >
      <UserMinus className="h-3 w-3" />
      Remove
    </Button>
  )
}
