import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    
    // Get all concepts
    const concepts = await sql`
      SELECT id, title, description, difficulty, prerequisites, order_index, created_at
      FROM concepts
      ORDER BY order_index ASC
    `
    
    if (!user) {
      return NextResponse.json({ concepts, progress: [] })
    }
    
    // Get user's progress
    const progress = await sql`
      SELECT id, user_id, concept_id, status, score, started_at, completed_at
      FROM progress
      WHERE user_id = ${user.id}
    `
    
    return NextResponse.json({ concepts, progress })
  } catch (error) {
    console.error('Failed to fetch concepts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch concepts' },
      { status: 500 }
    )
  }
}
