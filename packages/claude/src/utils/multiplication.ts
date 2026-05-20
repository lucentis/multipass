import type { Question, DiscoverExample } from '@/types/game'

const EMOJI_POOL = [
  '⭐', '🍎', '🐠', '🌸', '🎈', '🍭', '🦋', '🌈',
  '🐥', '🍓', '🎵', '🌙', '🍕', '🦄', '🌻', '🍩',
  '🐢', '🎪', '🍦', '🐝',
]

let lastEmoji = ''

function getRandomEmoji(): string {
  const pool = EMOJI_POOL.filter(e => e !== lastEmoji)
  const picked = pool[Math.floor(Math.random() * pool.length)]
  lastEmoji = picked
  return picked
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 10 shuffled questions for a practice session
export function generateQuestions(tableNumber: number): Question[] {
  const questions: Question[] = Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
  }))
  return shuffle(questions)
}

// 10 ordered examples for discover mode, each with a distinct emoji
export function generateDiscoverExamples(tableNumber: number): DiscoverExample[] {
  return Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
    emoji: getRandomEmoji(),
  }))
}

// 4 shuffled options including the correct answer
export function generateHints(answer: number): number[] {
  const wrong = new Set<number>()
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, -5, 5, -4, 4])

  for (const offset of offsets) {
    if (wrong.size >= 3) break
    const candidate = answer + offset
    if (candidate > 0) wrong.add(candidate)
  }

  while (wrong.size < 3) {
    const candidate = Math.floor(Math.random() * 99) + 1
    if (candidate !== answer) wrong.add(candidate)
  }

  return shuffle([answer, ...[...wrong]])
}