import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const concepts = await sql`
      SELECT id, title, description, difficulty, prerequisites, order_index, created_at
      FROM concepts
      WHERE id = ${id}
    `
    
    if (concepts.length === 0) {
      return NextResponse.json(
        { error: 'Concept not found' },
        { status: 404 }
      )
    }
    
    const concept = concepts[0]
    const user = await getSession()
    
    let progress = null
    if (user) {
      const progressRows = await sql`
        SELECT id, user_id, concept_id, status, score, started_at, completed_at
        FROM progress
        WHERE user_id = ${user.id} AND concept_id = ${id}
      `
      progress = progressRows[0] || null
    }
    
    return NextResponse.json({ concept, progress })
  } catch (error) {
    console.error('Failed to fetch concept:', error)
    return NextResponse.json(
      { error: 'Failed to fetch concept' },
      { status: 500 }
    )
  }
}
