export interface TableProgress {
  unlocked: boolean
  discovered: boolean
  totalAttempts: number
  totalCorrect: number
  bestStreak: number
  stars: 0 | 1 | 2 | 3
  successRate: number
}

export type ProfileProgress = Record<number, TableProgress>