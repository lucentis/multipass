<script setup>
import { ref, computed } from 'vue'
import { useSessionStore } from '@/stores/session.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { generateDiscoverExamples, generateQuestions } from '@/utils/multiplication'
import { Button } from '@/components/ui/button'

const sessionStore = useSessionStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const tableNumber = computed(() => sessionStore.discoverTable)

// Generate all 10 examples for this table upfront
const examples = ref(generateDiscoverExamples(tableNumber.value))
const currentIndex = ref(0)
const revealed = ref(false)
const done = ref(false)

const current = computed(() => examples.value[currentIndex.value])
const progress = computed(() => ((currentIndex.value) / examples.value.length) * 100)

// Build group arrays for the visual array: a groups of b items
const groups = computed(() => {
  const { a, b, emoji } = current.value
  return Array.from({ length: a }, (_, i) => ({
    label: `Groupe ${i + 1}`,
    items: Array.from({ length: b }, () => emoji),
  }))
})

function reveal() {
  revealed.value = true
}

function next() {
  if (currentIndex.value < examples.value.length - 1) {
    currentIndex.value++
    revealed.value = false
  } else {
    done.value = true
    // Mark as discovered and unlock next table
    progressStore.markDiscovered(profilesStore.activeProfileId, tableNumber.value)
  }
}

function goToPractice() {
  sessionStore.startSession(generateQuestions(tableNumber.value))
  sessionStore.navigateTo('practice', { practiceTable: tableNumber.value })
}

function goToDashboard() {
  sessionStore.navigateTo('dashboard')
}

function goToNextDiscover() {
  // Find the next table in the store
  const allTables = progressStore.getAllTables(profilesStore.activeProfileId)
  const nextTable = allTables.find(t => t.unlocked && !t.discovered)
  if (nextTable) {
    examples.value = generateDiscoverExamples(nextTable.number)
    currentIndex.value = 0
    revealed.value = false
    done.value = false
    sessionStore.navigateTo('discover', { discoverTable: nextTable.number })
  } else {
    goToDashboard()
  }
}

function goBack() {
  sessionStore.navigateTo('dashboard')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <!-- Done screen -->
    <template v-if="done">
      <div class="flex flex-col flex-1 items-center justify-center p-6 gap-6 text-center">
        <p class="text-5xl">🌟</p>
        <div>
          <p class="text-xl font-medium text-foreground mb-1">
            Table de ×{{ tableNumber }} découverte !
          </p>
          <p class="text-sm text-muted-foreground">
            Tu connais maintenant tous les exemples. Prête à t'entraîner ?
          </p>
        </div>
        <div class="flex flex-col gap-3 w-full max-w-xs">
          <Button
            @click="goToPractice"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
          >
            S'entraîner sur ×{{ tableNumber }}
          </Button>
          <Button
            variant="outline"
            @click="goToNextDiscover"
            class="w-full py-6 text-base"
          >
            Découvrir la table suivante →
          </Button>
          <button
            @click="goToDashboard"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </template>

    <!-- Main discover screen -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Retour
        </button>
        <p class="text-sm font-medium text-foreground">Découvrir ×{{ tableNumber }}</p>
        <span class="text-xs text-muted-foreground">{{ currentIndex + 1 }} / {{ examples.length }}</span>
      </div>

      <div class="flex-1 p-4 flex flex-col gap-5">

        <!-- Progress bar -->
        <div class="bg-muted rounded-full h-1">
          <div
            class="bg-teal-500 h-1 rounded-full transition-all duration-300"
            :style="{ width: progress + '%' }"
          />
        </div>

        <!-- Concept label -->
        <div class="text-center pt-2">
          <p class="text-base text-muted-foreground">
            <span class="font-medium text-foreground">{{ current.a }}</span>
            groupes de
            <span class="font-medium text-foreground">{{ current.b }}</span>
            {{ current.emoji }}
          </p>
        </div>

        <!-- Visual array -->
        <div class="flex flex-col gap-2.5">
          <div
            v-for="group in groups"
            :key="group.label"
            class="flex items-center gap-3 bg-muted rounded-xl px-3 py-2.5"
          >
            <span class="text-xs text-muted-foreground min-w-[58px]">{{ group.label }}</span>
            <div class="flex gap-1.5 flex-wrap">
              <span
                v-for="(emoji, idx) in group.items"
                :key="idx"
                class="text-xl leading-none"
              >{{ emoji }}</span>
            </div>
          </div>
        </div>

        <!-- Equation -->
        <div class="text-center py-3">
          <p class="text-5xl font-medium text-foreground tracking-tight">
            {{ current.a }} × {{ current.b }} =
            <span
              :class="[
                'transition-colors duration-300',
                revealed ? 'text-teal-600' : 'text-muted-foreground',
              ]"
            >{{ revealed ? current.answer : '?' }}</span>
          </p>
        </div>

        <!-- Hint before reveal -->
        <p
          v-if="!revealed"
          class="text-center text-sm text-muted-foreground"
        >
          Compte toutes les {{ current.emoji }} …
        </p>

        <!-- Celebration after reveal -->
        <div
          v-if="revealed"
          class="bg-teal-50 border border-teal-300 rounded-xl px-4 py-3 text-center"
        >
          <p class="text-sm text-teal-800">
            {{ current.a }} groupes de {{ current.b }} font bien
            <strong class="font-semibold">{{ current.answer }}</strong> en tout !
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2.5 mt-auto">
          <Button
            v-if="!revealed"
            @click="reveal"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
          >
            Révéler la réponse
          </Button>
          <Button
            v-else
            @click="next"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
          >
            {{ currentIndex < examples.length - 1 ? 'Exemple suivant →' : 'Terminer la découverte 🎉' }}
          </Button>
        </div>

      </div>
    </template>
  </div>
</template>