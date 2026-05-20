import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Question, Answer, DiscoverExample, SessionSummary } from '@/types/game'
import { generateQuestions, generateDiscoverExamples } from '@/utils/multiplication'

export const useGameStore = defineStore('game', () => {
  // Shared
  const tableNumber = ref<number | null>(null)

  // Practice
  const questions = ref<Question[]>([])
  const currentIndex = ref(0)
  const answers = ref<Answer[]>([])
  const streak = ref(0)
  const bestStreak = ref(0)

  // Discover
  const examples = ref<DiscoverExample[]>([])
  const discoverIndex = ref(0)

  // Practice computed
  const currentQuestion = computed<Question | null>(
    () => questions.value[currentIndex.value] ?? null,
  )

  const isComplete = computed(
    () => questions.value.length > 0 && currentIndex.value >= questions.value.length,
  )

  const summary = computed<SessionSummary>(() => ({
    correct: answers.value.filter(a => a.correct).length,
    total: answers.value.length,
    missed: answers.value
      .filter(a => !a.correct)
      .map(a => ({ label: `${a.question.a} × ${a.question.b}`, answer: a.question.answer })),
    bestStreak: bestStreak.value,
  }))

  // Discover computed
  const currentExample = computed<DiscoverExample | null>(
    () => examples.value[discoverIndex.value] ?? null,
  )

  const isDiscoverComplete = computed(
    () => examples.value.length > 0 && discoverIndex.value >= examples.value.length,
  )

  // Actions
  function startPractice(table: number): void {
    tableNumber.value = table
    questions.value = generateQuestions(table)
    currentIndex.value = 0
    answers.value = []
    streak.value = 0
    bestStreak.value = 0
  }

  function submitAnswer(userAnswer: number, usedHint: boolean): void {
    const question = questions.value[currentIndex.value]
    if (!question) return

    const correct = userAnswer === question.answer

    answers.value.push({ question, userAnswer, correct, usedHint })

    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }

    currentIndex.value++
  }

  function startDiscover(table: number): void {
    tableNumber.value = table
    examples.value = generateDiscoverExamples(table)
    discoverIndex.value = 0
  }

  function nextDiscover(): void {
    discoverIndex.value++
  }

  function reset(): void {
    tableNumber.value = null
    questions.value = []
    currentIndex.value = 0
    answers.value = []
    streak.value = 0
    bestStreak.value = 0
    examples.value = []
    discoverIndex.value = 0
  }

  return {
    tableNumber,
    questions,
    currentIndex,
    answers,
    streak,
    bestStreak,
    examples,
    discoverIndex,
    currentQuestion,
    isComplete,
    summary,
    currentExample,
    isDiscoverComplete,
    startPractice,
    submitAnswer,
    startDiscover,
    nextDiscover,
    reset,
  }
})