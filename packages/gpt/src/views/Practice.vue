<script setup>
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/session.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { generateHints, computeXp } from '@/utils/multiplication'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const sessionStore = useSessionStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const tableNumber = computed(() => sessionStore.practiceTable)
const question = computed(() => sessionStore.currentQuestion)
const questionIndex = computed(() => sessionStore.currentQuestionIndex)
const streak = computed(() => sessionStore.currentStreak)

// UI state per question
const userInput = ref('')
const status = ref('idle')       // idle | correct | wrong
const showHint = ref(false)
const hintOptions = ref([])
const selectedHint = ref(null)
const usedHint = ref(false)

// Reset state on each new question
watch(question, () => {
  userInput.value = ''
  status.value = 'idle'
  showHint.value = false
  hintOptions.value = []
  selectedHint.value = null
  usedHint.value = false
}, { immediate: true })

function openHint() {
  if (!question.value) return
  hintOptions.value = generateHints(question.value.answer)
  showHint.value = true
  usedHint.value = true
}

function selectHint(option) {
  selectedHint.value = option
  userInput.value = String(option)
}

function closeHint() {
  showHint.value = false
  selectedHint.value = null
}

function submit() {
  if (!question.value || !userInput.value.trim()) return
  const parsed = parseInt(userInput.value, 10)
  const correct = parsed === question.value.answer
  status.value = correct ? 'correct' : 'wrong'
  sessionStore.recordAnswer(parsed, correct, usedHint.value)
}

function next() {
  if (sessionStore.isSessionComplete) {
    // Persist results then go to recap
    const { correct, total, bestStreak: bs } = sessionStore.sessionSummary
    const profileId = profilesStore.activeProfileId
    progressStore.recordSession(profileId, tableNumber.value, correct, total, bs)
    profilesStore.addXp(profileId, computeXp(correct))
    sessionStore.navigateTo('recap')
  } else {
    status.value = 'idle'
  }
}

function goBack() {
  sessionStore.navigateTo('dashboard')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <button
        @click="goBack"
        class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Retour
      </button>
      <p class="text-sm font-medium text-foreground">Table de ×{{ tableNumber }}</p>
      <div class="flex items-center gap-1.5">
        <span class="text-base">🔥</span>
        <span class="text-sm font-medium text-muted-foreground">{{ streak }}</span>
      </div>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-6">

      <!-- Progress dots -->
      <div class="flex items-center justify-center gap-1.5 pt-2">
        <div
          v-for="i in 10"
          :key="i"
          :class="[
            'w-2 h-2 rounded-full transition-colors',
            i - 1 < questionIndex
              ? 'bg-teal-500'
              : i - 1 === questionIndex
                ? 'bg-teal-300 border border-teal-400'
                : 'bg-muted border border-border',
          ]"
        />
      </div>

      <!-- Question -->
      <div class="text-center py-4">
        <p class="text-sm text-muted-foreground mb-3">Combien font…</p>
        <p class="text-5xl font-medium text-foreground tracking-tight">
          {{ question?.a }} × {{ question?.b }} = ?
        </p>
      </div>

      <!-- Idle: input zone -->
      <template v-if="status === 'idle'">

        <!-- Free input mode -->
        <div v-if="!showHint" class="flex flex-col gap-3">
          <div class="relative">
            <Input
              v-model="userInput"
              type="number"
              placeholder="Ta réponse…"
              class="text-center text-xl pr-12 py-6"
              @keyup.enter="submit"
              autofocus
            />
            <button
              @click="openHint"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors p-1"
              title="Voir des propositions"
            >
              💡
            </button>
          </div>
          <Button
            @click="submit"
            :disabled="!userInput.trim()"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
          >
            Valider
          </Button>
        </div>

        <!-- Hint mode -->
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
                'py-3 rounded-xl border text-lg font-medium transition-colors',
                selectedHint === option
                  ? 'border-teal-500 bg-teal-50 text-teal-900'
                  : 'border-border bg-background hover:border-teal-400 text-foreground',
              ]"
            >{{ option }}</button>
          </div>
          <Button
            @click="submit"
            :disabled="selectedHint === null"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
          >
            Valider
          </Button>
          <button
            @click="closeHint"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
          >
            Saisir moi-même
          </button>
        </div>
      </template>

      <!-- Correct feedback -->
      <div v-else-if="status === 'correct'" class="flex flex-col gap-4">
        <div class="bg-teal-50 border border-teal-300 rounded-xl p-5 text-center">
          <p class="text-3xl mb-2">🎉</p>
          <p class="text-base font-medium text-teal-900 mb-1">Bravo, c'est exact !</p>
          <p class="text-sm text-teal-700">
            {{ question?.a }} × {{ question?.b }} = {{ question?.answer }}
          </p>
        </div>
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-amber-400 text-sm">★</span>
          <span class="text-sm text-muted-foreground">+10 xp</span>
        </div>
        <Button
          @click="next"
          class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
        >
          {{ sessionStore.isSessionComplete ? 'Voir mes résultats' : 'Question suivante' }}
        </Button>
      </div>

      <!-- Wrong feedback -->
      <div v-else-if="status === 'wrong'" class="flex flex-col gap-4">
        <div class="bg-muted border border-border rounded-xl p-5 text-center">
          <p class="text-3xl mb-2">💪</p>
          <p class="text-base font-medium text-foreground mb-1">Pas tout à fait…</p>
          <p class="text-sm text-muted-foreground mb-3">La bonne réponse était</p>
          <div class="inline-block bg-background border border-border rounded-lg px-6 py-2">
            <span class="text-2xl font-medium text-foreground">{{ question?.answer }}</span>
          </div>
        </div>
        <p class="text-xs text-muted-foreground text-center">On la reverra un peu plus tard, promis.</p>
        <Button
          @click="next"
          class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
        >
          {{ sessionStore.isSessionComplete ? 'Voir mes résultats' : 'Question suivante' }}
        </Button>
      </div>

    </div>
  </div>
</template>