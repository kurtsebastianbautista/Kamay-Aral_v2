'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Mode = 'student' | 'teacher'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const role = data.user.user_metadata?.role as string | undefined
      const isTeacher = role === 'teacher'

      if (mode === 'teacher' && !isTeacher) {
        await supabase.auth.signOut()
        throw new Error('This account is not a teacher account.')
      }
      if (mode === 'student' && isTeacher) {
        await supabase.auth.signOut()
        throw new Error('Please use the Teacher tab to sign in.')
      }

      router.push(isTeacher ? '/teacher/dashboard' : '/dashboard')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="mb-2 text-4xl">🤟</div>
        <CardTitle className="text-2xl font-bold">Kamay Aral</CardTitle>
        <CardDescription>Filipino Sign Language Learning</CardDescription>
      </CardHeader>

      {/* Mode toggle */}
      <div className="px-6 pb-4">
        <div className="flex rounded-xl border p-1 gap-1 bg-muted">
          {(['student', 'teacher'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all',
                mode === m
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'student' ? '🎓 Student' : '👩‍🏫 Teacher'}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="pt-0">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          {mode === 'teacher' && (
            <p className="text-center text-sm text-muted-foreground">
              No account?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:underline">
                Create teacher account
              </Link>
            </p>
          )}

          {mode === 'student' && (
            <p className="text-center text-xs text-muted-foreground">
              Your account is created by your teacher.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
