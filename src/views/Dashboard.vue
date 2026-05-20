<script setup>
import { computed } from 'vue'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { useSessionStore } from '@/stores/session.store'
import { generateQuestions } from '@/utils/multiplication'
import BottomNav from '@/components/BottomNav.vue'
import StarRating from '@/components/StarRating.vue'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()
const sessionStore = useSessionStore()

const profile = computed(() => profilesStore.activeProfile)
const tables = computed(() => progressStore.getAllTables(profile.value?.id))

const xpProgress = computed(() => Math.min(((profile.value?.xp ?? 0) / 500) * 100, 100))

// Suggest continuing the first unlocked-but-unmastered table,
// or discovering the first unlocked-but-undiscovered table.
const suggestion = computed(() => {
  const ts = tables.value
  const inProgress = ts.find(t => t.unlocked && t.totalAttempts > 0 && t.stars < 3)
  if (inProgress) {
    return { type: 'practice', table: inProgress.number, label: `Table de ×${inProgress.number} — Entraînement` }
  }
  const undiscovered = ts.find(t => t.unlocked && !t.discovered)
  if (undiscovered) {
    return { type: 'discover', table: undiscovered.number, label: `Table de ×${undiscovered.number} — Découverte` }
  }
  return null
})

function goToSuggestion() {
  if (!suggestion.value) return
  suggestion.value.type === 'practice'
    ? startPractice(suggestion.value.table)
    : startDiscover(suggestion.value.table)
}

function startPractice(tableNumber) {
  sessionStore.startSession(generateQuestions(tableNumber))
  sessionStore.navigateTo('practice', { practiceTable: tableNumber })
}

function startDiscover(tableNumber) {
  sessionStore.navigateTo('discover', { discoverTable: tableNumber })
}

// Clicking a table card: discover first if not yet done, otherwise practice
function handleTableClick(table) {
  if (!table.unlocked) return
  if (!table.discovered) startDiscover(table.number)
  else startPractice(table.number)
}

function switchProfile() {
  sessionStore.navigateTo('profile')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Profile header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <span class="text-3xl leading-none">{{ profile?.avatar }}</span>
        <div>
          <p class="font-medium text-sm text-foreground leading-none mb-1.5">{{ profile?.name }}</p>
          <div class="flex items-center gap-2">
            <div class="w-20 bg-muted rounded-full h-1">
              <div
                class="bg-teal-500 h-1 rounded-full transition-all duration-500"
                :style="{ width: xpProgress + '%' }"
              />
            </div>
            <span class="text-xs text-muted-foreground">{{ profile?.xp }} xp</span>
          </div>
        </div>
      </div>
      <button
        @click="switchProfile"
        class="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
        title="Changer de profil"
      >
        <span class="text-lg">👥</span>
      </button>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-5 overflow-y-auto pb-24">

      <!-- Smart suggestion -->
      <button
        v-if="suggestion"
        @click="goToSuggestion"
        class="w-full flex items-center justify-between bg-teal-50 border border-teal-300 rounded-xl px-4 py-3 hover:bg-teal-100 transition-colors text-left"
      >
        <div>
          <p class="text-[10px] font-semibold text-teal-700 uppercase tracking-widest mb-0.5">Continuer</p>
          <p class="text-sm font-medium text-teal-900">{{ suggestion.label }}</p>
        </div>
        <span class="text-teal-600 text-lg">→</span>
      </button>

      <!-- Tables grid -->
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-2.5">Mes tables</p>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="table in tables"
            :key="table.number"
            @click="handleTableClick(table)"
            :disabled="!table.unlocked"
            :class="[
              'flex flex-col items-center py-3 px-1 rounded-xl border text-center transition-colors',
              table.unlocked
                ? table.stars === 3
                  ? 'border-teal-300 bg-background hover:border-teal-500 cursor-pointer'
                  : 'border-border bg-background hover:border-teal-400 cursor-pointer'
                : 'border-border bg-muted opacity-50 cursor-not-allowed',
            ]"
          >
            <p class="text-sm font-medium text-foreground mb-1.5">×{{ table.number }}</p>
            <span v-if="!table.unlocked" class="text-[10px] text-muted-foreground">🔒</span>
            <StarRating v-else :stars="table.stars" size="sm" />
          </button>
        </div>
      </div>

      <!-- Mode buttons -->
      <div>
        <p class="text-xs font-medium text-muted-foreground mb-2.5">Que veux-tu faire ?</p>
        <div class="flex gap-3">
          <!-- Discover: suggest first undiscovered unlocked table -->
          <button
            @click="() => {
              const t = tables.find(t => t.unlocked && !t.discovered)
              if (t) startDiscover(t.number)
              else startDiscover(tables.find(t => t.unlocked)?.number)
            }"
            class="flex-1 flex flex-col p-4 rounded-xl border bg-teal-50 border-teal-300 hover:bg-teal-100 transition-colors text-left"
          >
            <span class="text-xl mb-2">👁️</span>
            <p class="text-sm font-medium text-teal-900 mb-0.5">Découvrir</p>
            <p class="text-[11px] text-teal-700">Comprendre avec des images</p>
          </button>

          <!-- Practice: suggest first unlocked table -->
          <button
            @click="() => {
              const t = tables.find(t => t.unlocked)
              if (t) startPractice(t.number)
            }"
            class="flex-1 flex flex-col p-4 rounded-xl border border-border bg-background hover:border-teal-400 transition-colors text-left"
          >
            <span class="text-xl mb-2">✏️</span>
            <p class="text-sm font-medium text-foreground mb-0.5">S'entraîner</p>
            <p class="text-[11px] text-muted-foreground">Répondre aux questions</p>
          </button>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>