export interface Question {
    a: number
    b: number
    answer: number
  }
  
  export interface Answer {
    question: Question
    userAnswer: number
    correct: boolean
    usedHint: boolean
  }
  
  export interface DiscoverExample {
    a: number
    b: number
    answer: number
    emoji: string
  }
  
  export interface SessionSummary {
    correct: number
    total: number
    missed: Array<{ label: string; answer: number }>
    bestStreak: number
  }