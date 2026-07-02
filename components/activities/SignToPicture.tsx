'use client'

import { useState, useEffect } from 'react'
import type { SignItem } from '@/content/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  item: SignItem
  distractors: SignItem[]
  onNext: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function SignToPicture({ item, distractors, onNext }: Props) {
  const [choices, setChoices] = useState<SignItem[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setChoices(shuffle([item, ...distractors.slice(0, 3)]))
    setSelected(null)
  }, [item, distractors])

  const answered = selected !== null
  const correct = selected === item.id

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        What sign is this?
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

      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          const isSelected = selected === choice.id
          const isCorrect = choice.id === item.id

          return (
            <button
              key={choice.id}
              onClick={() => !answered && setSelected(choice.id)}
              disabled={answered}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all active:scale-95',
                !answered && 'hover:border-indigo-300 border-border bg-white',
                answered && isCorrect && 'border-emerald-500 bg-emerald-50',
                answered && isSelected && !isCorrect && 'border-red-500 bg-red-50',
                answered && !isSelected && !isCorrect && 'border-border bg-white opacity-60',
              )}
            >
              {choice.imagePath ? (
                <div className="relative h-20 w-full">
                  <Image src={choice.imagePath} alt={choice.label} fill className="object-contain" />
                </div>
              ) : (
                <div className="flex h-20 w-full items-center justify-center text-3xl font-black text-indigo-600">
                  {choice.label}
                </div>
              )}
              <span className="text-sm font-semibold">{choice.label}</span>
              {answered && isCorrect && (
                <CheckCircle2 className="absolute right-2 top-2 h-5 w-5 text-emerald-500" />
              )}
              {answered && isSelected && !isCorrect && (
                <XCircle className="absolute right-2 top-2 h-5 w-5 text-red-500" />
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={cn(
          'rounded-2xl p-4 text-center',
          correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
        )}>
          <p className="font-bold text-lg">{correct ? '🎉 Correct!' : '❌ Not quite'}</p>
          {!correct && <p className="text-sm mt-1">The correct answer is <strong>{item.label}</strong></p>}
        </div>
      )}

      {answered && (
        <Button
          onClick={() => onNext(correct)}
          className={cn(
            'w-full py-6 text-base font-semibold',
            correct ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700',
          )}
        >
          Continue →
        </Button>
      )}
    </div>
  )
}
