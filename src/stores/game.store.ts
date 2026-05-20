import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const tableNumber = ref(null)
  const questions = ref([])
  const currentIndex = ref(0)
  const answers = ref([])
  const streak = ref(0)
  const bestStreak = ref(0)

  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)

  const isComplete = computed(
    () => questions.value.length > 0 && currentIndex.value >= questions.value.length
  )

  // { correct, total, missed: [{ label, answer }], bestStreak }
  const summary = computed(() => {
    const correct = answers.value.filter(a => a.correct).length
    const total = answers.value.length
    const missed = answers.value
      .filter(a => !a.correct)
      .map(a => ({ label: `${a.question.a} × ${a.question.b}`, answer: a.question.answer }))
    return { correct, total, missed, bestStreak: bestStreak.value }
  })

  function start(table, questionList) {
    tableNumber.value = table
    questions.value = questionList
    currentIndex.value = 0
    answers.value = []
    streak.value = 0
    bestStreak.value = 0
  }

  function submitAnswer(userAnswer, usedHint) {
    const question = questions.value[currentIndex.value]
    if (!question) return

    const correct = parseInt(userAnswer, 10) === question.answer

    answers.value.push({ question, userAnswer, correct, usedHint })

    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }

    currentIndex.value++
  }

  function reset() {
    tableNumber.value = null
    questions.value = []
    currentIndex.value = 0
    answers.value = []
    streak.value = 0
    bestStreak.value = 0
  }

  return {
    tableNumber,
    questions,
    currentIndex,
    answers,
    streak,
    bestStreak,
    currentQuestion,
    isComplete,
    summary,
    start,
    submitAnswer,
    reset,
  }
})