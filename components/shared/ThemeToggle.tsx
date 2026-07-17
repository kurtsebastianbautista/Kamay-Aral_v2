'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function apply(next: boolean) {
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Dark Theme</p>
        <p className="text-xs text-muted-foreground">Switch the app to a dark color scheme</p>
      </div>
      <Switch checked={dark} onCheckedChange={apply} />
    </div>
  )
}
