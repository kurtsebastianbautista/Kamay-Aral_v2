'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface Props {
  id: string
  name: string
  entityLabel: 'teacher' | 'student'
  deleteAction: (id: string) => Promise<void>
  redirectTo?: string
}

export default function DeleteAccountDialog({ id, name, entityLabel, deleteAction, redirectTo }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteAction(id)
      toast.success(`${name}'s account deleted`)
      setOpen(false)
      if (redirectTo) router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="gap-1.5 text-red-600 hover:text-red-700" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Delete Account
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {entityLabel} account</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{name}</strong>&apos;s account and all associated data. This cannot be undone.
            Type <strong>DELETE</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
        />
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={confirmText !== 'DELETE' || loading}
            onClick={handleDelete}
          >
            {loading ? 'Deleting…' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
