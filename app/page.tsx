import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Sparkles, Target, MessageSquare, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">NeuroPath AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Learning Platform
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Master Programming with{' '}
              <span className="text-primary">Personalized AI Guidance</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              NeuroPath AI creates a customized learning journey based on your skill level, 
              learning style, and goals. Get instant feedback from your AI tutor.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In to Continue</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to Become a Better Programmer
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform adapts to your unique learning needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Personalized Learning Path"
              description="AI analyzes your skills and creates a custom curriculum that evolves as you progress."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Interactive Code Tutor"
              description="Get instant help, code reviews, and explanations from your AI programming tutor."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Progress Tracking"
              description="Visualize your learning journey with detailed analytics and milestone tracking."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Adaptive Difficulty"
              description="Challenges automatically adjust to keep you in the optimal learning zone."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="Practical Exercises"
              description="Learn by doing with hands-on coding challenges and real-world projects."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Concept Mastery"
              description="Deep understanding through spaced repetition and connected concepts."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of developers who have transformed their programming skills with NeuroPath AI.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link href="/register">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold">NeuroPath AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js and AI. Transform your programming journey.
          </p>
        </div>
      </footer>
    </div>
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
    <div className="rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/30">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
