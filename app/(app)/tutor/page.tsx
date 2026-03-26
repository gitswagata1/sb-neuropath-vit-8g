'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, Send, ArrowLeft, Loader2, User, Sparkles } from 'lucide-react'

function TutorContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const conceptId = searchParams.get('concept')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, input, setInput } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      body: conceptId ? { conceptId } : undefined,
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  if (authLoading || !user) {
    return <TutorSkeleton />
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">AI Code Tutor</h1>
              <p className="text-xs text-muted-foreground">
                {conceptId ? 'Learning context active' : 'Ask me anything about programming'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Welcome to your AI Tutor!</h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                I&apos;m here to help you learn programming concepts, review your code, 
                and answer any questions you have.
              </p>
              <div className="grid gap-2 text-sm">
                <SuggestionButton 
                  onClick={() => setInput('Can you explain how variables work in JavaScript?')}
                  text="Explain variables in JavaScript"
                />
                <SuggestionButton 
                  onClick={() => setInput('What are the best practices for writing clean code?')}
                  text="Best practices for clean code"
                />
                <SuggestionButton 
                  onClick={() => setInput('Can you review this code and suggest improvements?')}
                  text="Review my code"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about programming..."
              className="min-h-12 max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 shrink-0"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  )
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'
  
  // Extract text from message parts
  const text = message.parts
    ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('') || ''
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isUser ? 'bg-secondary' : 'bg-primary/20'
      }`}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Brain className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {text}
        </div>
      </div>
    </div>
  )
}

function SuggestionButton({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border/50 px-4 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
    >
      {text}
    </button>
  )
}

function TutorSkeleton() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col px-4 py-6">
      <Skeleton className="mb-4 h-14 w-full" />
      <Skeleton className="flex-1" />
    </div>
  )
}

export default function TutorPage() {
  return (
    <Suspense fallback={<TutorSkeleton />}>
      <TutorContent />
    </Suspense>
  )
}
