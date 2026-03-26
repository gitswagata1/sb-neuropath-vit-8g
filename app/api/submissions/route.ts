import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const conceptId = searchParams.get('conceptId')
    
    let submissions
    if (conceptId) {
      submissions = await sql`
        SELECT s.*, c.title as concept_title
        FROM submissions s
        JOIN concepts c ON s.concept_id = c.id
        WHERE s.user_id = ${user.id} AND s.concept_id = ${conceptId}
        ORDER BY s.created_at DESC
      `
    } else {
      submissions = await sql`
        SELECT s.*, c.title as concept_title
        FROM submissions s
        JOIN concepts c ON s.concept_id = c.id
        WHERE s.user_id = ${user.id}
        ORDER BY s.created_at DESC
        LIMIT 50
      `
    }
    
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { conceptId, code, feedback, score } = await request.json()
    
    if (!conceptId || !code) {
      return NextResponse.json(
        { error: 'Concept ID and code are required' },
        { status: 400 }
      )
    }
    
    const submissions = await sql`
      INSERT INTO submissions (user_id, concept_id, code, feedback, score)
      VALUES (${user.id}, ${conceptId}, ${code}, ${feedback || null}, ${score || null})
      RETURNING *
    `
    
    return NextResponse.json({ submission: submissions[0] })
  } catch (error) {
    console.error('Failed to create submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}
