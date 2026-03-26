import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { conceptId, status, score } = await request.json()
    
    if (!conceptId || !status) {
      return NextResponse.json(
        { error: 'Concept ID and status are required' },
        { status: 400 }
      )
    }
    
    // Check if progress exists
    const existingProgress = await sql`
      SELECT id FROM progress 
      WHERE user_id = ${user.id} AND concept_id = ${conceptId}
    `
    
    let progress
    
    if (existingProgress.length > 0) {
      // Update existing progress
      const updates = await sql`
        UPDATE progress
        SET 
          status = ${status},
          score = COALESCE(${score}, score),
          started_at = COALESCE(started_at, CASE WHEN ${status} = 'in_progress' THEN NOW() ELSE NULL END),
          completed_at = CASE WHEN ${status} = 'completed' THEN NOW() ELSE completed_at END
        WHERE user_id = ${user.id} AND concept_id = ${conceptId}
        RETURNING *
      `
      progress = updates[0]
    } else {
      // Create new progress
      const inserts = await sql`
        INSERT INTO progress (user_id, concept_id, status, score, started_at, completed_at)
        VALUES (
          ${user.id}, 
          ${conceptId}, 
          ${status}, 
          ${score || null},
          CASE WHEN ${status} IN ('in_progress', 'completed') THEN NOW() ELSE NULL END,
          CASE WHEN ${status} = 'completed' THEN NOW() ELSE NULL END
        )
        RETURNING *
      `
      progress = inserts[0]
    }
    
    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
