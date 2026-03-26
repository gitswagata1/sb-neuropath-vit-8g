'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Target, Trophy, TrendingUp, ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react'
import type { Concept, Progress as ProgressType } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const { data, isLoading } = useSWR<{ concepts: Concept[], progress: ProgressType[] }>(
    user ? '/api/concepts' : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return <DashboardSkeleton />
  }

  const concepts = data?.concepts || []
  const progress = data?.progress || []
  
  const completedCount = progress.filter(p => p.status === 'completed').length
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length
  const totalCount = concepts.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const currentConcept = concepts.find(c => {
    const p = progress.find(pr => pr.concept_id === c.id)
    return !p || p.status !== 'completed'
  })

  const recentProgress = concepts.slice(0, 5).map(concept => ({
    ...concept,
    progress: progress.find(p => p.concept_id === concept.id)
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Total Concepts"
          value={totalCount}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={completedCount}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="In Progress"
          value={inProgressCount}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Progress"
          value={`${Math.round(progressPercentage)}%`}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : currentConcept ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <span className="mb-2 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                        {currentConcept.difficulty}
                      </span>
                      <h3 className="text-xl font-semibold">{currentConcept.title}</h3>
                      <p className="mt-1 text-muted-foreground">{currentConcept.description}</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/learn/${currentConcept.id}`} className="gap-2">
                      Continue Learning
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-lg font-semibold">All concepts completed!</h3>
                  <p className="text-muted-foreground">Great job on your learning journey.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Path Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Learning Path
              </CardTitle>
              <CardDescription>
                Track your progress through the curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProgress.map((concept) => (
                    <div
                      key={concept.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-background">
                        {concept.progress?.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : concept.progress?.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-warning" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{concept.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {concept.progress?.status?.replace('_', ' ') || 'Not started'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/learn/${concept.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/learn">View All Concepts</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>{completedCount} of {totalCount} concepts</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/tutor">
                  <Target className="h-4 w-4" />
                  Ask AI Tutor
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/learn">
                  <BookOpen className="h-4 w-4" />
                  Browse Concepts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}
