<script setup lang="ts">
import { computed } from 'vue'

import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import BottomNav from '@/components/BottomNav.vue'
import StarRating from '@/components/StarRating.vue'

const appStore = useAppStore()
const gameStore = useGameStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const profile = computed(() => profilesStore.activeProfile!)
const tables = computed(() => progressStore.getAllTables(profile.value.id))

const xpPercent = computed(() => Math.min((profile.value.xp / 500) * 100, 100))

const suggestion = computed(() => {
  const inProgress = tables.value.find(
    t => t.unlocked && t.totalAttempts > 0 && t.stars < 3,
  )
  if (inProgress) {
    return {
      screen: 'practice' as const,
      table: inProgress.number,
      label: `Table de ×${inProgress.number} — Entraînement`,
    }
  }

  const undiscovered = tables.value.find(t => t.unlocked && !t.discovered)
  if (undiscovered) {
    return {
      screen: 'discover' as const,
      table: undiscovered.number,
      label: `Table de ×${undiscovered.number} — Découverte`,
    }
  }

  return null
})

const firstUnlocked = computed(() => tables.value.find(t => t.unlocked))

function goTo(screen: 'practice' | 'discover', tableNumber: number): void {
  gameStore.tableNumber = tableNumber
  appStore.navigate(screen)
}

function handleSuggestion(): void {
  if (!suggestion.value) return
  goTo(suggestion.value.screen, suggestion.value.table)
}

function handleTableClick(table: typeof tables.value[number]): void {
  if (!table.unlocked) return
  const screen = table.discovered ? 'practice' : 'discover'
  goTo(screen, table.number)
}

function handleDiscover(): void {
  const target = tables.value.find(t => t.unlocked && !t.discovered) ?? firstUnlocked.value
  if (target) goTo('discover', target.number)
}

function handlePractice(): void {
  if (firstUnlocked.value) goTo('practice', firstUnlocked.value.number)
}
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <!-- Profile header -->
    <div class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
      <div class="flex items-center gap-3">
        <span class="text-3xl leading-none">{{ profile.avatar }}</span>
        <div>
          <p class="text-sm font-medium leading-none text-foreground mb-1.5">
            {{ profile.name }}
          </p>
          <div class="flex items-center gap-2">
            <div class="h-1 w-20 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-teal-500 transition-all duration-500"
                :style="{ width: xpPercent + '%' }"
              />
            </div>
            <span class="text-xs text-muted-foreground">{{ profile.xp }} xp</span>
          </div>
        </div>
      </div>
      <button
        @click="appStore.navigate('profiles')"
        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Changer de profil"
      >
        👥
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">

      <!-- Smart suggestion -->
      <button
        v-if="suggestion"
        @click="handleSuggestion"
        class="flex w-full items-center justify-between rounded-xl border border-teal-300 bg-teal-50 px-4 py-3 text-left transition-colors hover:bg-teal-100"
      >
        <div>
          <p class="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-teal-700">
            Continuer
          </p>
          <p class="text-sm font-medium text-teal-900">{{ suggestion.label }}</p>
        </div>
        <span class="text-teal-600">→</span>
      </button>

      <!-- Tables grid -->
      <div>
        <p class="mb-2.5 text-xs font-medium text-muted-foreground">Mes tables</p>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="table in tables"
            :key="table.number"
            @click="handleTableClick(table)"
            :disabled="!table.unlocked"
            :class="[
              'flex flex-col items-center rounded-xl border py-3 transition-colors',
              table.unlocked
                ? table.stars === 3
                  ? 'border-teal-300 bg-background hover:border-teal-500 cursor-pointer'
                  : 'border-border bg-background hover:border-teal-400 cursor-pointer'
                : 'cursor-not-allowed border-border bg-muted opacity-50',
            ]"
          >
            <p class="mb-1.5 text-sm font-medium text-foreground">×{{ table.number }}</p>
            <span v-if="!table.unlocked" class="text-[10px] text-muted-foreground">🔒</span>
            <StarRating v-else :stars="table.stars" size="sm" />
          </button>
        </div>
      </div>

      <!-- Mode buttons -->
      <div>
        <p class="mb-2.5 text-xs font-medium text-muted-foreground">Que veux-tu faire ?</p>
        <div class="flex gap-3">
          <button
            @click="handleDiscover"
            class="flex flex-1 flex-col p-4 rounded-xl border border-teal-300 bg-teal-50 text-left transition-colors hover:bg-teal-100"
          >
            <span class="mb-2 text-xl">👁️</span>
            <p class="mb-0.5 text-sm font-medium text-teal-900">Découvrir</p>
            <p class="text-[11px] text-teal-700">Comprendre avec des images</p>
          </button>

          <button
            @click="handlePractice"
            class="flex flex-1 flex-col p-4 rounded-xl border border-border bg-background text-left transition-colors hover:border-teal-400"
          >
            <span class="mb-2 text-xl">✏️</span>
            <p class="mb-0.5 text-sm font-medium text-foreground">S'entraîner</p>
            <p class="text-[11px] text-muted-foreground">Répondre aux questions</p>
          </button>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>