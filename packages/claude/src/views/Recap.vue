<script setup>
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useGameStore } from '@/stores/game.store'
import { Button } from '@/components/ui/button'
import StarRating from '@/components/StarRating.vue'

const gameStore = useGameStore()
const progressStore = useProgressStore()
const profilesStore = useProfilesStore()

const tableNumber = computed(() => gameStore.tableNumber)
const summary = computed(() => gameStore.summary)

const successRate = computed(() => summary.value.correct / summary.value.total)

const stars = computed(() => {
  const r = successRate.value
  if (r >= 0.9) return 3
  if (r >= 0.7) return 2
  if (r >= 0.5) return 1
  return 0
})

const feedback = computed(() => {
  if (stars.value === 3) return { emoji: '🌟', title: `Parfait, ${profilesStore.activeProfile?.name} !` }
  if (stars.value === 2) return { emoji: '🎉', title: `Bien joué, ${profilesStore.activeProfile?.name} !` }
  if (stars.value === 1) return { emoji: '💪', title: 'Continue comme ça !' }
  return { emoji: '💪', title: 'On va y arriver !' }
})

const xpGained = computed(() => summary.value.correct * 10)

function replay() {
  gameStore.startPractice()
  appStore.navigateTo('practice')
}

function goHome() {
  appStore.navigateTo('dashboard')
}
</script>

<template>
  <div class="flex flex-col min-h-screen p-6 gap-6">

    <!-- Title & emoji -->
    <div class="text-center pt-4">
      <p class="text-5xl mb-3 leading-none">{{ feedback.emoji }}</p>
      <p class="text-xl font-medium text-foreground mb-1">{{ feedback.title }}</p>
      <p class="text-sm text-muted-foreground">Table de ×{{ tableNumber }} — session terminée</p>
    </div>

    <!-- Stars -->
    <div class="text-center">
      <StarRating :stars="stars" size="lg" class="justify-center mb-2" />
      <p class="text-sm text-muted-foreground">
        {{ summary.correct }} bonne{{ summary.correct > 1 ? 's' : '' }} réponse{{ summary.correct > 1 ? 's' : '' }} sur {{ summary.total }}
      </p>
    </div>

    <!-- XP gained -->
    <div class="flex items-center justify-between bg-teal-50 border border-teal-300 rounded-xl px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="text-base">⚡</span>
        <span class="text-sm font-medium text-teal-900">+{{ xpGained }} xp gagnés</span>
      </div>
      <span class="text-xs text-teal-700">
        Total : {{ profilesStore.activeProfile?.xp }} xp
      </span>
    </div>

    <!-- Missed questions -->
    <div
      v-if="summary.missed.length > 0"
      class="bg-background border border-border rounded-xl overflow-hidden"
    >
      <p class="text-xs font-medium text-muted-foreground px-4 py-3 border-b border-border">
        À retravailler
      </p>
      <div class="divide-y divide-border">
        <div
          v-for="missed in summary.missed"
          :key="missed.label"
          class="flex items-center justify-between px-4 py-2.5"
        >
          <span class="text-sm text-muted-foreground">{{ missed.label }}</span>
          <span class="text-sm font-medium text-foreground">= {{ missed.answer }}</span>
        </div>
      </div>
    </div>

    <!-- Perfect session message -->
    <div
      v-else
      class="text-center py-2"
    >
      <p class="text-sm text-teal-700">🎯 Aucune erreur — impressionnant !</p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-3 mt-auto">
      <Button
        @click="replay"
        class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base"
      >
        Rejouer cette table
      </Button>
      <Button
        variant="outline"
        @click="goHome"
        class="w-full py-6 text-base"
      >
        Retour à l'accueil
      </Button>
    </div>

  </div>
</template>