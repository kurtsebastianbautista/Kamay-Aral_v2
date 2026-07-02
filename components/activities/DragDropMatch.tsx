'use client'

import { useState, useEffect } from 'react'
import type { SignItem } from '@/content/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  items: SignItem[]   // exactly 3
  onNext: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function DragDropMatch({ items, onNext }: Props) {
  const [videoOrder, setVideoOrder] = useState<SignItem[]>([])
  const [pictureOrder, setPictureOrder] = useState<SignItem[]>([])
  // matches[videoId] = pictureId
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setVideoOrder(shuffle(items))
    setPictureOrder(shuffle(items))
    setMatches({})
    setSelectedVideo(null)
    setSubmitted(false)
  }, [items])

  function handleVideoTap(id: string) {
    if (submitted) return
    setSelectedVideo((prev) => (prev === id ? null : id))
  }

  function handlePictureTap(pictureId: string) {
    if (!selectedVideo || submitted) return

    // If this picture is already matched to something else, swap it out
    const existingVideoForPicture = Object.entries(matches).find(([, pId]) => pId === pictureId)?.[0]

    setMatches((prev) => {
      const next = { ...prev }
      if (existingVideoForPicture) delete next[existingVideoForPicture]
      // Remove any prior match for selectedVideo
      next[selectedVideo] = pictureId
      return next
    })
    setSelectedVideo(null)
  }

  const allMatched = Object.keys(matches).length === items.length

  function handleSubmit() {
    if (!allMatched) return
    setSubmitted(true)
  }

  const allCorrect = submitted && items.every((item) => matches[item.id] === item.id)
  const score = submitted ? items.filter((item) => matches[item.id] === item.id).length : 0

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Match the sign to the picture
      </p>
      {selectedVideo && (
        <p className="text-center text-sm text-indigo-600 font-medium animate-pulse">
          Now tap the matching picture →
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Videos column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-center text-muted-foreground uppercase">Signs</p>
          {videoOrder.map((item) => {
            const isSelected = selectedVideo === item.id
            const matchedPictureId = matches[item.id]
            const matchedItem = matchedPictureId ? items.find((i) => i.id === matchedPictureId) : null
            const isCorrect = submitted && matchedPictureId === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleVideoTap(item.id)}
                className={cn(
                  'relative w-full rounded-xl border-2 overflow-hidden transition-all active:scale-95',
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-border',
                  submitted && isCorrect && 'border-emerald-500 bg-emerald-50',
                  submitted && !isCorrect && 'border-red-500 bg-red-50',
                )}
              >
                <video
                  src={item.videoPath}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="aspect-video w-full object-contain bg-black"
                />
                {matchedItem && !submitted && (
                  <div className="bg-indigo-100 px-2 py-1 text-center text-xs font-semibold text-indigo-700">
                    → {matchedItem.label}
                  </div>
                )}
                {submitted && (
                  <div className={cn('absolute right-1 top-1', isCorrect ? 'text-emerald-500' : 'text-red-500')}>
                    {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Pictures column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-center text-muted-foreground uppercase">Pictures</p>
          {pictureOrder.map((item) => {
            const isMatched = Object.values(matches).includes(item.id)
            const matchedCorrectly = submitted && matches[item.id] === item.id

            return (
              <button
                key={item.id}
                onClick={() => handlePictureTap(item.id)}
                disabled={submitted}
                className={cn(
                  'relative flex w-full flex-col items-center justify-center rounded-xl border-2 p-2 transition-all active:scale-95',
                  selectedVideo && !isMatched ? 'border-indigo-300 bg-indigo-50' : 'border-border bg-white',
                  isMatched && !submitted && 'border-emerald-300 bg-emerald-50 opacity-70',
                  submitted && matchedCorrectly && 'border-emerald-500 bg-emerald-50',
                  submitted && !matchedCorrectly && isMatched && 'border-red-500 bg-red-50',
                )}
              >
                {item.imagePath ? (
                  <div className="relative h-16 w-full">
                    <Image src={item.imagePath} alt={item.label} fill className="object-contain" />
                  </div>
                ) : (
                  <span className="text-2xl font-black text-indigo-600 py-4">{item.label}</span>
                )}
                <span className="text-xs font-semibold mt-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="w-full py-6 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
        >
          Check answers
        </Button>
      ) : (
        <>
          <div className={cn(
            'rounded-2xl p-4 text-center',
            allCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
          )}>
            <p className="font-bold text-lg">{allCorrect ? '🎉 Perfect match!' : `${score}/3 correct`}</p>
          </div>
          <Button
            onClick={() => onNext(allCorrect)}
            className={cn('w-full py-6 text-base font-semibold', allCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700')}
          >
            Continue →
          </Button>
        </>
      )}
    </div>
  )
}
