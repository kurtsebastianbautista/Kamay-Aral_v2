'use client'

import { useState, useCallback } from 'react'
import type { Module, SubModule, SignItem } from '@/content/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Props {
  module: Module
  submodule: SubModule
}

export default function LearnModeClient({ module: mod, submodule }: Props) {
  const [selectedItem, setSelectedItem] = useState<SignItem>(submodule.items[0])

  const markViewed = useCallback(async (item: SignItem) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('learn_progress').upsert({
      student_id: user.id,
      module_id: mod.id,
      submodule_id: submodule.id,
      item_id: item.id,
    }, { onConflict: 'student_id,module_id,submodule_id,item_id' })
  }, [mod.id, submodule.id])

  function selectItem(item: SignItem) {
    setSelectedItem(item)
    markViewed(item)
  }

  const currentIndex = submodule.items.findIndex((i) => i.id === selectedItem.id)

  function prev() {
    if (currentIndex > 0) selectItem(submodule.items[currentIndex - 1])
  }

  function next() {
    if (currentIndex < submodule.items.length - 1) selectItem(submodule.items[currentIndex + 1])
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <Link
          href={`/module/${mod.id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {mod.title}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{submodule.shortTitle}</span>
      </div>

      {/* Item grid */}
      <div className="px-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {submodule.items.map((item) => (
            <button
              key={item.id}
              onClick={() => selectItem(item)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 text-base font-bold transition-all active:scale-95 ${
                selectedItem.id === item.id
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-border bg-white text-foreground hover:border-indigo-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main viewer */}
      <div className="flex-1 px-4 space-y-4">
        {/* Video */}
        <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-lg">
          <video
            key={selectedItem.videoPath}
            src={selectedItem.videoPath}
            controls
            playsInline
            className="h-full w-full object-contain"
          >
            <source src={selectedItem.videoPath} type="video/mp4" />
          </video>
        </div>

        {/* Label + image */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 shadow-sm">
          <span className="text-6xl font-black tracking-tight text-indigo-600">{selectedItem.label}</span>
          {selectedItem.labelFil && (
            <span className="text-lg text-muted-foreground">{selectedItem.labelFil}</span>
          )}
          {selectedItem.imagePath && (
            <div className="relative h-32 w-32">
              <Image
                src={selectedItem.imagePath}
                alt={selectedItem.label}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={next}
            disabled={currentIndex === submodule.items.length - 1}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
