<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useProgressStore } from '@/stores/progress.store'
import { useProfilesStore } from '@/stores/profiles.store'

const appStore = useAppStore()
const gameStore = useGameStore()
const progressStore = useProgressStore()
const profilesStore = useProfilesStore()

// Discover.vue owns session init — Dashboard only sets gameStore.tableNumber
onMounted(() => {
  if (gameStore.tableNumber !== null) {
    gameStore.startDiscover(gameStore.tableNumber)
  }
})

const revealed = ref(false)

const example = computed(() => gameStore.currentExample)
const index = computed(() => gameStore.discoverIndex)
const total = computed(() => gameStore.examples.length)
const progressPercent = computed(() => (index.value / total.value) * 100)

// Build visual groups: example.a groups of example.b emoji
const groups = computed(() => {
  if (!example.value) return []
  return Array.from({ length: example.value.a }, (_, i) => ({
    label: `Groupe ${i + 1}`,
    items: Array.from({ length: example.value!.b }, () => example.value!.emoji),
  }))
})

function reveal(): void {
  revealed.value = true
}

function next(): void {
  if (gameStore.isDiscoverComplete) return

  revealed.value = false
  gameStore.nextDiscover()

  if (gameStore.isDiscoverComplete) {
    progressStore.markDiscovered(profilesStore.activeProfile!.id, gameStore.tableNumber!)
  }
}

function goToPractice(): void {
  gameStore.startPractice(gameStore.tableNumber!)
  appStore.navigate('practice')
}

function goToNextDiscover(): void {
  const allTables = progressStore.getAllTables(profilesStore.activeProfile!.id)
  const next = allTables.find(t => t.unlocked && !t.discovered)
  if (next) {
    gameStore.startDiscover(next.number)
    revealed.value = false
  } else {
    appStore.navigate('dashboard')
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">

    <!-- Done screen -->
    <template v-if="gameStore.isDiscoverComplete">
      <div class="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <p class="text-5xl leading-none">🌟</p>
        <div>
          <p class="mb-1 text-xl font-medium text-foreground">
            Table de ×{{ gameStore.tableNumber }} découverte !
          </p>
          <p class="text-sm text-muted-foreground">
            Tu connais maintenant tous les exemples. Prête à t'entraîner ?
          </p>
        </div>
        <div class="flex w-full max-w-xs flex-col gap-3">
          <button
            @click="goToPractice"
            class="w-full rounded-xl bg-teal-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
          >
            S'entraîner sur ×{{ gameStore.tableNumber }}
          </button>
          <button
            @click="goToNextDiscover"
            class="w-full rounded-xl border border-border py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
          >
            Découvrir la table suivante →
          </button>
          <button
            @click="appStore.navigate('dashboard')"
            class="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </template>

    <!-- Main discover screen -->
    <template v-else-if="example">

      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          @click="appStore.navigate('dashboard')"
          class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Retour
        </button>
        <p class="text-sm font-medium text-foreground">Découvrir ×{{ gameStore.tableNumber }}</p>
        <span class="text-xs text-muted-foreground">{{ index + 1 }} / {{ total }}</span>
      </div>

      <div class="flex flex-1 flex-col gap-5 p-4">

        <!-- Progress bar -->
        <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-teal-500 transition-all duration-300"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <!-- Concept label -->
        <div class="pt-1 text-center">
          <p class="text-base text-muted-foreground">
            <span class="font-medium text-foreground">{{ example.a }}</span>
            groupes de
            <span class="font-medium text-foreground">{{ example.b }}</span>
            {{ example.emoji }}
          </p>
        </div>

        <!-- Visual groups -->
        <div class="flex flex-col gap-2">
          <div
            v-for="group in groups"
            :key="group.label"
            class="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5"
          >
            <span class="min-w-[58px] text-xs text-muted-foreground">{{ group.label }}</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(emoji, idx) in group.items"
                :key="idx"
                class="text-xl leading-none"
              >{{ emoji }}</span>
            </div>
          </div>
        </div>

        <!-- Equation -->
        <div class="py-2 text-center">
          <p class="text-5xl font-medium tracking-tight text-foreground">
            {{ example.a }} × {{ example.b }} =
            <span :class="revealed ? 'text-teal-600' : 'text-muted-foreground'">
              {{ revealed ? example.answer : '?' }}
            </span>
          </p>
        </div>

        <!-- Hint / celebration -->
        <p v-if="!revealed" class="text-center text-sm text-muted-foreground">
          Compte tous les {{ example.emoji }}…
        </p>
        <div
          v-else
          class="rounded-xl border border-teal-300 bg-teal-50 px-4 py-3 text-center"
        >
          <p class="text-sm text-teal-800">
            {{ example.a }} groupes de {{ example.b }} font bien
            <strong class="font-semibold">{{ example.answer }}</strong> en tout !
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-auto">
          <button
            v-if="!revealed"
            @click="reveal"
            class="w-full rounded-xl bg-teal-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
          >
            Révéler la réponse
          </button>
          <button
            v-else
            @click="next"
            class="w-full rounded-xl bg-teal-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
          >
            {{ index < total - 1 ? 'Exemple suivant →' : 'Terminer la découverte 🎉' }}
          </button>
        </div>

      </div>
    </template>

  </div>
</template>