'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface Props {
  label: string
  description?: string
  storageKey: string
  defaultChecked?: boolean
}

export default function SettingSwitch({ label, description, storageKey, defaultChecked = false }: Props) {
  const [checked, setChecked] = useState(defaultChecked)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) setChecked(saved === 'true')
  }, [storageKey])

  function apply(next: boolean) {
    setChecked(next)
    localStorage.setItem(storageKey, String(next))
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={apply} />
    </div>
  )
}
