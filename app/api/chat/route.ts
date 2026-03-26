import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getSession()
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
    
    const { messages, conceptId }: { messages: UIMessage[], conceptId?: string } = await request.json()
    
    // Get concept details if provided
    let conceptContext = ''
    if (conceptId) {
      const concepts = await sql`
        SELECT title, description, difficulty FROM concepts WHERE id = ${conceptId}
      `
      if (concepts.length > 0) {
        const concept = concepts[0]
        conceptContext = `
The user is currently learning about: ${concept.title}
Difficulty level: ${concept.difficulty}
Description: ${concept.description}
`
      }
    }
    
    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: `You are NeuroPath AI, an expert programming tutor specialized in teaching coding concepts through personalized guidance. Your role is to:

1. Explain programming concepts clearly with practical examples
2. Review code and provide constructive feedback
3. Suggest improvements and best practices
4. Encourage learning through questions rather than giving direct answers immediately
5. Adapt your explanations based on the user's skill level
6. Use code examples with syntax highlighting when helpful

${conceptContext}

Be encouraging, patient, and supportive. Break down complex concepts into digestible parts. When reviewing code, be specific about what's good and what could be improved.`,
      messages: await convertToModelMessages(messages),
    })
    
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
