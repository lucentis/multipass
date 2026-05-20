// Unlock order — easiest/most regular tables first
export const TABLE_ORDER = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9]

// Pool of emojis rotated per question to keep discover mode visually varied
const EMOJI_POOL = [
  '⭐', '🍎', '🐠', '🌸', '🎈', '🍭', '🦋', '🌈',
  '🐥', '🍓', '🔵', '🎵', '🌙', '🍕', '🦄', '🌻',
  '🍩', '🐢', '🎪', '🍦',
]

// Returns a random emoji that differs from the last one used
let lastEmoji = ''
export function getRandomEmoji() {
  const pool = EMOJI_POOL.filter(e => e !== lastEmoji)
  const picked = pool[Math.floor(Math.random() * pool.length)]
  lastEmoji = picked
  return picked
}

// Generates 10 shuffled questions for a practice session on tableNumber
export function generateQuestions(tableNumber) {
  const questions = Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
  }))
  return shuffle(questions)
}

// Generates ordered examples for discover mode (×1 through ×10)
export function generateDiscoverExamples(tableNumber) {
  return Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
    emoji: getRandomEmoji(),
  }))
}

// Returns 4 shuffled options including the correct answer
export function generateHints(answer) {
  const wrong = new Set()
  const candidates = []

  // Plausible wrong answers: nearby multiples and random offsets
  for (let offset of [-3, -2, 2, 3, -5, 5, -1, 1]) {
    const c = answer + offset
    if (c > 0 && c !== answer) candidates.push(c)
  }

  // Fill up to 3 wrong answers from candidates, then random if needed
  for (const c of shuffle(candidates)) {
    if (wrong.size >= 3) break
    wrong.add(c)
  }
  while (wrong.size < 3) {
    const c = Math.floor(Math.random() * 100) + 1
    if (c !== answer) wrong.add(c)
  }

  return shuffle([answer, ...[...wrong]])
}

// 0–3 stars based on session success rate
export function computeStars(successRate) {
  if (successRate >= 0.9) return 3
  if (successRate >= 0.7) return 2
  if (successRate >= 0.5) return 1
  return 0
}

// XP earned for a session
export function computeXp(correctCount) {
  return correctCount * 10
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}