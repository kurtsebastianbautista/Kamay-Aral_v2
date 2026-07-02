'use client'

import { useState, useRef, useEffect } from 'react'
import type { SignItem } from '@/content/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  item: SignItem
  onNext: (correct: boolean) => void
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export default function Spelling({ item, onNext }: Props) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAnswer('')
    setSubmitted(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [item])

  const isCorrect =
    submitted && item.acceptedAnswers.some((a) => normalize(a) === normalize(answer))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Type what sign this is
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => !submitted && setAnswer(e.target.value)}
            placeholder="Type your answer…"
            className={cn(
              'h-14 text-center text-lg font-semibold rounded-xl border-2',
              submitted && isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-700',
              submitted && !isCorrect && 'border-red-500 bg-red-50 text-red-700',
            )}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            readOnly={submitted}
          />
          {submitted && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect
                ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                : <XCircle className="h-6 w-6 text-red-500" />}
            </div>
          )}
        </div>

        {!submitted ? (
          <Button
            type="submit"
            disabled={!answer.trim()}
            className="w-full py-6 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
          >
            Check
          </Button>
        ) : (
          <>
            <div className={cn(
              'rounded-2xl p-4 text-center',
              isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
            )}>
              <p className="font-bold text-lg">{isCorrect ? '🎉 Correct!' : '❌ Not quite'}</p>
              {!isCorrect && (
                <p className="text-sm mt-1">
                  Accepted: <strong>{item.acceptedAnswers.join(' / ')}</strong>
                </p>
              )}
            </div>
            <Button
              onClick={() => onNext(isCorrect)}
              className={cn('w-full py-6 text-base font-semibold', isCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700')}
            >
              Continue →
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
