export const TABLE_ORDER = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9]

const EMOJI_POOL = [
  '⭐', '🍎', '🐠', '🌸', '🎈', '🍭', '🦋', '🌈',
  '🐥', '🍓', '🔵', '🎵', '🌙', '🍕', '🦄', '🌻',
  '🍩', '🐢', '🎪', '🍦',
]

let lastEmoji = ''

export function getRandomEmoji() {
  const pool = EMOJI_POOL.filter(e => e !== lastEmoji)
  const picked = pool[Math.floor(Math.random() * pool.length)]
  lastEmoji = picked
  return picked
}

// 10 shuffled questions for a practice session
export function generateQuestions(tableNumber) {
  const questions = Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
  }))
  return shuffle(questions)
}

// 10 ordered examples for discover mode, each with a unique emoji
export function generateDiscoverExamples(tableNumber) {
  return Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
    emoji: getRandomEmoji(),
  }))
}

// 4 shuffled options including the correct answer
export function generateHints(answer) {
  const wrong = new Set()
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, -5, 5, -4, 4])

  for (const offset of offsets) {
    if (wrong.size >= 3) break
    const candidate = answer + offset
    if (candidate > 0) wrong.add(candidate)
  }

  // Fallback if not enough candidates
  while (wrong.size < 3) {
    const candidate = Math.floor(Math.random() * 99) + 1
    if (candidate !== answer) wrong.add(candidate)
  }

  return shuffle([answer, ...[...wrong]])
}

// 0–3 stars based on cumulative success rate
export function computeStars(successRate) {
  if (successRate >= 0.9) return 3
  if (successRate >= 0.7) return 2
  if (successRate >= 0.5) return 1
  return 0
}

// XP earned for a session: 10 per correct answer
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