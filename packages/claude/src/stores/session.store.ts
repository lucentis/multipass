import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSessionStore = defineStore('session', () => {
  // Navigation
  const currentTab = ref('profile') // profile | dashboard | practice | discover | recap | progress
  const practiceTable = ref(null)
  const discoverTable = ref(null)

  // Current practice session
  const questions = ref([])
  const currentQuestionIndex = ref(0)
  const answers = ref([]) // { question, userAnswer, correct, usedHint }
  const currentStreak = ref(0)
  const bestStreak = ref(0)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null)
  const isSessionComplete = computed(() => currentQuestionIndex.value >= questions.value.length && questions.value.length > 0)

  const sessionSummary = computed(() => {
    const correct = answers.value.filter(a => a.correct).length
    const total = answers.value.length
    const missed = answers.value
      .filter(a => !a.correct)
      .map(a => ({ label: `${a.question.a} × ${a.question.b}`, answer: a.question.answer }))
    return { correct, total, missed, bestStreak: bestStreak.value }
  })

  function navigateTo(tab, payload = {}) {
    currentTab.value = tab
    if (payload.practiceTable !== undefined) practiceTable.value = payload.practiceTable
    if (payload.discoverTable !== undefined) discoverTable.value = payload.discoverTable
  }

  function startSession(questionList) {
    questions.value = questionList
    currentQuestionIndex.value = 0
    answers.value = []
    currentStreak.value = 0
    bestStreak.value = 0
  }

  function recordAnswer(userAnswer, correct, usedHint) {
    const q = questions.value[currentQuestionIndex.value]
    answers.value.push({ question: q, userAnswer, correct, usedHint })

    if (correct) {
      currentStreak.value++
      if (currentStreak.value > bestStreak.value) bestStreak.value = currentStreak.value
    } else {
      currentStreak.value = 0
    }

    currentQuestionIndex.value++
  }

  return {
    currentTab,
    practiceTable,
    discoverTable,
    questions,
    currentQuestionIndex,
    answers,
    currentStreak,
    bestStreak,
    currentQuestion,
    isSessionComplete,
    sessionSummary,
    navigateTo,
    startSession,
    recordAnswer,
  }
})