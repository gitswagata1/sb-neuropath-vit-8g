'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, Circle, Clock, ArrowRight, BookOpen } from 'lucide-react'
import type { Concept, Progress } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LearnPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const { data, isLoading } = useSWR<{ concepts: Concept[], progress: Progress[] }>(
    user ? '/api/concepts' : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return <LearnSkeleton />
  }

  const concepts = data?.concepts || []
  const progress = data?.progress || []

  const conceptsWithProgress = concepts.map(concept => ({
    ...concept,
    progress: progress.find(p => p.concept_id === concept.id)
  }))

  const beginnerConcepts = conceptsWithProgress.filter(c => c.difficulty === 'beginner')
  const intermediateConcepts = conceptsWithProgress.filter(c => c.difficulty === 'intermediate')
  const advancedConcepts = conceptsWithProgress.filter(c => c.difficulty === 'advanced')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground">Master programming concepts step by step</p>
      </div>

      {isLoading ? (
        <LearnSkeleton />
      ) : (
        <div className="space-y-12">
          {beginnerConcepts.length > 0 && (
            <ConceptSection
              title="Fundamentals"
              description="Start with the basics"
              concepts={beginnerConcepts}
              badge="Beginner"
              badgeVariant="secondary"
            />
          )}
          
          {intermediateConcepts.length > 0 && (
            <ConceptSection
              title="Core Concepts"
              description="Build on your foundation"
              concepts={intermediateConcepts}
              badge="Intermediate"
              badgeVariant="default"
            />
          )}
          
          {advancedConcepts.length > 0 && (
            <ConceptSection
              title="Advanced Topics"
              description="Challenge yourself with complex concepts"
              concepts={advancedConcepts}
              badge="Advanced"
              badgeVariant="outline"
            />
          )}
        </div>
      )}
    </div>
  )
}

function ConceptSection({
  title,
  description,
  concepts,
  badge,
  badgeVariant,
}: {
  title: string
  description: string
  concepts: (Concept & { progress?: Progress })[]
  badge: string
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive'
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {concepts.map((concept) => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
    </section>
  )
}

function ConceptCard({ concept }: { concept: Concept & { progress?: Progress } }) {
  const status = concept.progress?.status || 'not_started'
  
  const statusConfig = {
    completed: {
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
      label: 'Completed',
      className: 'border-primary/30 bg-primary/5',
    },
    in_progress: {
      icon: <Clock className="h-5 w-5 text-warning" />,
      label: 'In Progress',
      className: 'border-warning/30 bg-warning/5',
    },
    not_started: {
      icon: <Circle className="h-5 w-5 text-muted-foreground" />,
      label: 'Not Started',
      className: '',
    },
  }

  const config = statusConfig[status]

  return (
    <Card className={`transition-all hover:border-primary/50 ${config.className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className="text-sm text-muted-foreground">{config.label}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{concept.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {concept.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-between" asChild>
          <Link href={`/learn/${concept.id}`}>
            {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start Learning'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function LearnSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="space-y-12">
        {[1, 2].map(section => (
          <div key={section}>
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
