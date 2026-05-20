<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { generateHints } from '@/utils/multiplication'

const appStore = useAppStore()
const gameStore = useGameStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

// Practice.vue owns session init — Dashboard only sets gameStore.tableNumber
onMounted(() => {
  if (gameStore.tableNumber !== null) {
    gameStore.startPractice(gameStore.tableNumber)
  }
})

// Per-question UI state — reset whenever the question index advances
const inputValue = ref('')
const showHint = ref(false)
const hintOptions = ref<number[]>([])
const selectedHint = ref<number | null>(null)
const usedHint = ref(false)
const status = ref<'idle' | 'correct' | 'wrong'>('idle')

function openHint(): void {
  if (!gameStore.currentQuestion) return
  hintOptions.value = generateHints(gameStore.currentQuestion.answer)
  showHint.value = true
  usedHint.value = true
}

function selectHint(option: number): void {
  selectedHint.value = option
  inputValue.value = String(option)
}

function closeHint(): void {
  showHint.value = false
  selectedHint.value = null
  inputValue.value = ''
}

function submit(): void {
  if (!inputValue.value) return
  const value = parseInt(inputValue.value, 10)
  gameStore.submitAnswer(value, usedHint.value)
  status.value = gameStore.answers.at(-1)?.correct ? 'correct' : 'wrong'
}

function next(): void {
  console.log('next called')
  if (gameStore.isComplete) {
    const { correct, total, bestStreak } = gameStore.summary
    const profileId = profilesStore.activeProfile!.id
    progressStore.recordSession(profileId, gameStore.tableNumber!, correct, total, bestStreak)
    profilesStore.addXp(correct * 10)
    appStore.navigate('recap')
  } else {
    status.value = 'idle'
    inputValue.value = ''
    showHint.value = false
    hintOptions.value = []
    selectedHint.value = null
    usedHint.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">

    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <button
        @click="appStore.navigate('dashboard')"
        class="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Retour
      </button>
      <p class="text-sm font-medium text-foreground">Table de ×{{ gameStore.tableNumber }}</p>
      <div class="flex items-center gap-1.5">
        <span>🔥</span>
        <span class="text-sm font-medium text-muted-foreground">{{ gameStore.streak }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-6 p-4">

      <!-- Progress dots -->
      <div class="flex items-center justify-center gap-1.5 pt-2">
        <div
          v-for="i in 10"
          :key="i"
          :class="[
            'h-2 w-2 rounded-full transition-colors',
            i - 1 < gameStore.currentIndex
              ? 'bg-teal-500'
              : i - 1 === gameStore.currentIndex
                ? 'border border-teal-400 bg-teal-200'
                : 'border border-border bg-muted',
          ]"
        />
      </div>

      <!-- Question -->
      <div class="py-4 text-center" v-if="status === 'idle'">
        <p class="mb-3 text-sm text-muted-foreground">Combien font…</p>
        <p class="text-5xl font-medium tracking-tight text-foreground">
          {{ gameStore.currentQuestion?.a }} × {{ gameStore.currentQuestion?.b }} = ?
        </p>
      </div>

      <!-- Idle: free input -->
      <template v-if="status === 'idle'">

        <div v-if="!showHint" class="flex flex-col gap-3">
          <div class="relative">
            <input
              v-model="inputValue"
              type="number"
              placeholder="Ta réponse…"
              :class="[
                'w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-center',
                'text-xl outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
              ]"
              @keyup.enter="submit"
              autofocus
            />
            <button
              @click="openHint"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-amber-500"
              title="Voir des propositions"
            >
              💡
            </button>
          </div>
          <button
            @click="submit"
            :disabled="!inputValue"
            :class="[
              'w-full rounded-xl py-3.5 text-base font-medium transition-colors',
              inputValue
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'cursor-not-allowed bg-muted text-muted-foreground',
            ]"
          >
            Valider
          </button>
        </div>

        <!-- Hint panel -->
        <div v-else class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="text-amber-500">💡</span>
            <p class="text-xs text-muted-foreground">Choisis la bonne réponse, puis valide</p>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="option in hintOptions"
              :key="option"
              @click="selectHint(option)"
              :class="[
                'rounded-xl border py-3 text-lg font-medium transition-colors',
                selectedHint === option
                  ? 'border-teal-500 bg-teal-50 text-teal-900'
                  : 'border-border bg-background text-foreground hover:border-teal-400',
              ]"
            >
              {{ option }}
            </button>
          </div>
          <button
            @click="submit"
            :disabled="selectedHint === null"
            :class="[
              'w-full rounded-xl py-3.5 text-base font-medium transition-colors',
              selectedHint !== null
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'cursor-not-allowed bg-muted text-muted-foreground',
            ]"
          >
            Valider
          </button>
          <button
            @click="closeHint"
            class="py-1 text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Saisir moi-même
          </button>
        </div>
      </template>

      <!-- Correct feedback -->
      <div v-else-if="status === 'correct'" class="flex flex-col gap-4">
        <div class="py-4 text-center">
          <p class="mb-3 text-sm text-muted-foreground">Combien font…</p>
          <p class="text-5xl font-medium tracking-tight text-foreground">
            {{ gameStore.answers.at(-1)?.question.a }} × {{ gameStore.answers.at(-1)?.question.b }} = ?
          </p>
        </div>
        <div class="rounded-xl border border-teal-300 bg-teal-50 p-5 text-center">
          <p class="mb-2 text-3xl">🎉</p>
          <p class="mb-1 text-base font-medium text-teal-900">Bravo, c'est exact !</p>
          <p class="text-sm text-teal-700">
            {{ gameStore.answers.at(-1)?.question.a }} ×
            {{ gameStore.answers.at(-1)?.question.b }} =
            {{ gameStore.answers.at(-1)?.question.answer }}
          </p>
        </div>
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-sm text-amber-400">★</span>
          <span class="text-sm text-muted-foreground">+10 xp</span>
        </div>
        <button
          @click="next"
          class="w-full rounded-xl bg-teal-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
        >
          {{ gameStore.isComplete ? 'Voir mes résultats' : 'Question suivante' }}
        </button>
      </div>

      <!-- Wrong feedback -->
      <div v-else-if="status === 'wrong'" class="flex flex-col gap-4">
        <div class="rounded-xl border border-border bg-muted p-5 text-center">
          <p class="mb-2 text-3xl">💪</p>
          <p class="mb-1 text-base font-medium text-foreground">Pas tout à fait…</p>
          <p class="mb-3 text-sm text-muted-foreground">La bonne réponse était</p>
          <div class="inline-block rounded-lg border border-border bg-background px-6 py-2">
            <span class="text-2xl font-medium text-foreground">
              {{ gameStore.answers.at(-1)?.question.answer }}
            </span>
          </div>
        </div>
        <p class="text-center text-xs text-muted-foreground">
          On la reverra un peu plus tard, promis.
        </p>
        <button
          @click="next"
          class="w-full rounded-xl bg-teal-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
        >
          {{ gameStore.isComplete ? 'Voir mes résultats' : 'Question suivante' }}
        </button>
      </div>

    </div>
  </div>
</template>