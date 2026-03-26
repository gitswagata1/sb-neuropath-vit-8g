export interface Concept {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  order_index: number
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  concept_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  score: number | null
  started_at: string | null
  completed_at: string | null
}

export interface Submission {
  id: string
  user_id: string
  concept_id: string
  code: string
  feedback: string | null
  score: number | null
  created_at: string
}

export interface ConceptWithProgress extends Concept {
  progress?: Progress
}

export interface LearningPath {
  concepts: ConceptWithProgress[]
  completedCount: number
  totalCount: number
  currentConcept: ConceptWithProgress | null
}
