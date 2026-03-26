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
import { BookOpen, Target, Trophy, TrendingUp, ArrowRight, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Total Concepts"
            value={totalCount}
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Completed"
            value={completedCount}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="In Progress"
            value={inProgressCount}
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            label="Progress"
            value={`${Math.round(progressPercentage)}%`}
            color="bg-primary/10 text-primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
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
                  <Skeleton className="h-32 w-full" />
                ) : currentConcept ? (
                  <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                    <div className="mb-4">
                      <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium capitalize text-primary">
                        {currentConcept.difficulty}
                      </span>
                      <h3 className="mt-2 text-xl font-semibold">{currentConcept.title}</h3>
                      <p className="mt-1 text-muted-foreground">{currentConcept.description}</p>
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
            <Card className="border-border/50">
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
                  <div className="space-y-3">
                    {recentProgress.map((concept) => (
                      <div
                        key={concept.id}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          concept.progress?.status === 'completed'
                            ? 'bg-emerald-500/10'
                            : concept.progress?.status === 'in_progress'
                            ? 'bg-amber-500/10'
                            : 'bg-muted'
                        }`}>
                          {concept.progress?.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : concept.progress?.status === 'in_progress' ? (
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{concept.title}</h4>
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
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">{completedCount} of {totalCount} concepts</span>
                  <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <Link href="/tutor">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Ask AI Tutor
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <Link href="/learn">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Browse Concepts
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string | number
  color: string 
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`rounded-xl p-3 ${color}`}>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
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
    </div>
  )
}
