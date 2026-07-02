'use client'

import type { SignItem } from '@/content/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Props {
  item: SignItem
  onNext: () => void
}

export default function LessonCard({ item, onNext }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Learn this sign
      </p>

      <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-lg">
        <video
          key={item.videoPath}
          src={item.videoPath}
          autoPlay
          loop
          playsInline
          muted
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-5 shadow-sm">
        <span className="text-5xl font-black text-indigo-600">{item.label}</span>
        {item.labelFil && <span className="text-base text-muted-foreground">{item.labelFil}</span>}
        {item.imagePath && (
          <div className="relative h-28 w-28 mt-1">
            <Image src={item.imagePath} alt={item.label} fill className="object-contain" />
          </div>
        )}
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-base font-semibold"
      >
        Got it →
      </Button>
    </div>
  )
}
