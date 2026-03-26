'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, ArrowLeft, Play, MessageSquare, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Concept, Progress } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const { data, isLoading, mutate } = useSWR<{ concept: Concept, progress: Progress | null }>(
    user ? `/api/concepts/${id}` : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (data?.concept && data?.progress?.status !== 'completed' && user) {
      // Mark as in progress when viewing
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptId: id, status: 'in_progress' }),
      }).then(() => mutate())
    }
  }, [data, id, user, mutate])

  if (authLoading || !user) {
    return <ConceptSkeleton />
  }

  const concept = data?.concept
  const progress = data?.progress

  const handleMarkComplete = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptId: id, status: 'completed', score: 100 }),
      })
      toast.success('Concept marked as complete!')
      mutate()
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code')
      return
    }
    
    setSubmitting(true)
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptId: id, code }),
      })
      toast.success('Code submitted! Ask the AI tutor for feedback.')
      setCode('')
    } catch {
      toast.error('Failed to submit code')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 gap-2" asChild>
        <Link href="/learn">
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Path
        </Link>
      </Button>

      {isLoading ? (
        <ConceptSkeleton />
      ) : concept ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Concept Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    concept.difficulty === 'beginner' ? 'secondary' :
                    concept.difficulty === 'intermediate' ? 'default' : 'outline'
                  }>
                    {concept.difficulty}
                  </Badge>
                  {progress?.status === 'completed' && (
                    <Badge variant="outline" className="gap-1 border-primary text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{concept.title}</CardTitle>
                <CardDescription className="text-base">
                  {concept.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h3>What you&apos;ll learn</h3>
                  <p>
                    In this module, you&apos;ll master the fundamentals of {concept.title.toLowerCase()}. 
                    This concept is essential for building a strong foundation in programming.
                  </p>
                  
                  <h3>Key Points</h3>
                  <ul>
                    <li>Understanding the core principles</li>
                    <li>Practical applications and use cases</li>
                    <li>Best practices and common patterns</li>
                    <li>Hands-on coding exercises</li>
                  </ul>

                  <h3>Practice Exercise</h3>
                  <p>
                    Write a code example that demonstrates your understanding of {concept.title.toLowerCase()}. 
                    Submit it below and then ask our AI tutor for feedback!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Code Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Practice Code
                </CardTitle>
                <CardDescription>
                  Write your code below and submit for review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`// Write your ${concept.title.toLowerCase()} code here...\n\n`}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-48 font-mono text-sm"
                />
                <div className="flex gap-3">
                  <Button onClick={handleSubmitCode} disabled={submitting || !code.trim()}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Code
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/tutor?concept=${id}`} className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Ask AI Tutor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    progress?.status === 'completed' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {progress?.status === 'completed' ? 'Completed!' : 
                       progress?.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </p>
                    {progress?.score && (
                      <p className="text-sm text-muted-foreground">Score: {progress.score}%</p>
                    )}
                  </div>
                </div>
                
                {progress?.status !== 'completed' && (
                  <Button 
                    className="w-full" 
                    onClick={handleMarkComplete}
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Complete
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {concept.prerequisites && concept.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {concept.prerequisites.map((prereq, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Need Help */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription>
                  Our AI tutor is here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gap-2" asChild>
                  <Link href={`/tutor?concept=${id}`}>
                    <MessageSquare className="h-4 w-4" />
                    Chat with AI Tutor
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Concept not found</p>
          <Button className="mt-4" asChild>
            <Link href="/learn">Back to Learning Path</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function ConceptSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-10 w-48" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  )
}
