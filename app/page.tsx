import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Sparkles, Target, MessageSquare, BarChart3, CheckCircle2, ArrowRight, Code2, Layers, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">NeuroPath</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Learning Platform
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight lg:text-6xl">
              Master Programming with{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Personalized AI Guidance
              </span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground lg:text-xl">
              NeuroPath creates a customized learning journey based on your skill level, 
              learning style, and goals. Get instant feedback from your AI tutor.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2 px-8">
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link href="/login">Sign In to Continue</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-10">
              <div>
                <div className="text-3xl font-bold text-primary">8+</div>
                <div className="text-sm text-muted-foreground">Core Concepts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Tutor Access</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free to Start</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="border-b border-border/50 py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Structured Learning Path
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Progress through carefully designed modules from basics to advanced concepts
            </p>
          </div>
          
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-3">
              <LevelCard
                level="Beginner"
                topics={['Variables', 'Control Flow', 'Functions']}
                color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                borderColor="border-emerald-500/30"
              />
              <LevelCard
                level="Intermediate"
                topics={['Arrays', 'Objects', 'Recursion']}
                color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                borderColor="border-amber-500/30"
              />
              <LevelCard
                level="Advanced"
                topics={['Sorting', 'Trees', 'Algorithms']}
                color="bg-rose-500/10 text-rose-600 dark:text-rose-400"
                borderColor="border-rose-500/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border/50 bg-muted/30 py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our AI-powered platform adapts to your unique learning needs
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Personalized Learning Path"
              description="AI analyzes your skills and creates a custom curriculum that evolves as you progress."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Interactive AI Tutor"
              description="Get instant help, code reviews, and explanations from your personal AI programming tutor."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Progress Tracking"
              description="Visualize your learning journey with detailed analytics and milestone tracking."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Hands-on Coding"
              description="Practice with real coding challenges and get immediate feedback on your solutions."
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Concept Mastery"
              description="Deep understanding through connected concepts and spaced repetition."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Adaptive Difficulty"
              description="Challenges automatically adjust to keep you in the optimal learning zone."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border/50 py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start your learning journey in three simple steps
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard
                number={1}
                title="Create Account"
                description="Sign up for free and tell us about your programming experience"
              />
              <StepCard
                number={2}
                title="Start Learning"
                description="Follow your personalized path through curated programming concepts"
              />
              <StepCard
                number={3}
                title="Practice & Grow"
                description="Submit code, get AI feedback, and track your progress over time"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center lg:p-12">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join developers who are transforming their programming skills with NeuroPath AI.
            </p>
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/register">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">NeuroPath</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js and AI. Transform your programming journey.
          </p>
        </div>
      </footer>
    </div>
  )
}

function LevelCard({
  level,
  topics,
  color,
  borderColor,
}: {
  level: string
  topics: string[]
  color: string
  borderColor: string
}) {
  return (
    <Card className={`border-2 ${borderColor} bg-card/50`}>
      <CardContent className="p-6">
        <div className={`mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium ${color}`}>
          {level}
        </div>
        <ul className="space-y-3">
          {topics.map((topic) => (
            <li key={topic} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">{topic}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-border/50 bg-card/50 transition-colors hover:border-primary/30">
      <CardContent className="p-6">
        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
