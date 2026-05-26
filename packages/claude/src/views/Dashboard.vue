<script setup lang="ts">
import { computed } from 'vue'

import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'

import BottomNav from '@/components/BottomNav.vue'
import StarRating from '@/components/StarRating.vue'
import ProfileMenuButton from '@/components/ProfileMenuButton.vue'

const appStore = useAppStore()
const gameStore = useGameStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const profile = computed(() => profilesStore.activeProfile)

const tables = computed(() =>
  profile.value
    ? progressStore.getAllTables(profile.value.id)
    : [],
)

const suggestion = computed(() => {
  const inProgress = tables.value.find(
    t => t.unlocked && t.totalAttempts > 0 && t.stars < 3,
  )

  if (inProgress) {
    return {
      screen: 'practice' as const,
      table: inProgress.number,
      label: `Table ×${inProgress.number}`,
      subtitle: 'Continue ton entraînement',
    }
  }

  const undiscovered = tables.value.find(
    t => t.unlocked && !t.discovered,
  )

  if (undiscovered) {
    return {
      screen: 'discover' as const,
      table: undiscovered.number,
      label: `Table ×${undiscovered.number}`,
      subtitle: 'Découvre une nouvelle table',
    }
  }

  return null
})

const firstUnlocked = computed(() =>
  tables.value.find(t => t.unlocked),
)

function goTo(
  screen: 'practice' | 'discover',
  tableNumber: number,
): void {
  gameStore.tableNumber = tableNumber
  appStore.navigate(screen)
}

function handleSuggestion(): void {
  if (!suggestion.value) return
  goTo(suggestion.value.screen, suggestion.value.table)
}

function handleTableClick(
  table: typeof tables.value[number],
): void {
  if (!table.unlocked) return

  const screen = table.discovered
    ? 'practice'
    : 'discover'

  goTo(screen, table.number)
}

function handleDiscover(): void {
  const target =
    tables.value.find(
      t => t.unlocked && !t.discovered,
    ) ?? firstUnlocked.value

  if (target) {
    goTo('discover', target.number)
  }
}

function handlePractice(): void {
  if (firstUnlocked.value) {
    goTo('practice', firstUnlocked.value.number)
  }
}
</script>

<template>
  <div
    v-if="profile"
    class="relative h-dvh overflow-hidden bg-amber-50/30 font-[Nunito]"
  >
    <!-- blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-12 -right-10 size-50 rounded-full bg-amber-100/80 blur-[2px]" />
      <div class="absolute top-[-20px] right-24 size-24 rounded-full bg-amber-200/50 blur-[2px]" />
      <div class="absolute -bottom-10 -left-10 size-50 rounded-full bg-amber-200/70 blur-[2px]" />
      <div class="absolute bottom-8 left-30 size-20 rounded-full bg-amber-300/40 blur-[2px]" />
      <div class="absolute top-1/2 -right-20 size-50 rounded-full bg-amber-200/40 blur-[2px]" />
    </div>

    <div class="relative z-10 flex h-full flex-col px-4 pb-24">
      <!-- Header -->
      <div class="pt-4">
        <div class="flex items-start justify-between">

          <!-- Left -->
          <ProfileMenuButton />

          <!-- Right stats -->
          <div class="pt-1 text-right">
            <p class="text-lg font-extrabold text-amber-500 leading-none">
              ★ {{ progressStore.getStats(profile.id).totalStars }}
            </p>

            <p class="text-xs font-bold text-slate-500 flex gap-2 items-center">
              {{ profile.xp }} XP
            </p>
          </div>

        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-1 flex-col pt-4">

        <!-- Continue -->
        <button
          v-if="suggestion"
          @click="handleSuggestion"
          class="mb-4 flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-100/80 px-4 py-3 text-left shadow-sm transition active:scale-[0.98]"
        >
          <div>
            <p
              class="text-[10px] font-extrabold uppercase tracking-widest text-amber-700"
            >
              Continuer
            </p>

            <p
              class="text-sm font-bold text-amber-900"
            >
              {{ suggestion.label }}
            </p>

            <p
              class="text-[11px] text-amber-700"
            >
              {{ suggestion.subtitle }}
            </p>
          </div>

          <span class="text-xl text-amber-700">
            →
          </span>
        </button>

        <!-- Tables -->
        <div class="mb-4">
          <p
            class="mb-2 text-xs font-bold text-slate-500"
          >
            Mes tables
          </p>

          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="table in tables"
              :key="table.number"
              @click="handleTableClick(table)"
              :disabled="!table.unlocked"
              :class="[
                'flex aspect-square flex-col items-center justify-center rounded-2xl border transition-all duration-150 active:scale-95',

                !table.unlocked
                  ? 'border-transparent bg-slate-100 opacity-50'
                  : table.stars === 3
                    ? 'border-amber-500'
                    : 'border-white bg-white shadow-sm',
              ]"
            >
              <p
                class="mb-1 text-base font-extrabold text-slate-800"
              >
                ×{{ table.number }}
              </p>

              <span
                v-if="!table.unlocked"
                class="text-[10px]"
              >
                🔒
              </span>

              <StarRating
                v-else
                :stars="table.stars"
                size="sm"
              />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-auto">
          <p
            class="mb-2 text-xs font-bold text-slate-500"
          >
            Que veux-tu faire ?
          </p>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleDiscover"
              class="rounded-3xl bg-amber-100 p-4 text-left shadow-sm transition active:scale-[0.98]"
            >
              <div class="mb-2 text-2xl">
                👁️
              </div>

              <p
                class="text-sm font-extrabold text-amber-900"
              >
                Découvrir
              </p>

              <p
                class="text-[11px] text-amber-700"
              >
                Avec images
              </p>
            </button>

            <button
              @click="handlePractice"
              class="rounded-3xl border border-white bg-white p-4 text-left shadow-sm transition active:scale-[0.98]"
            >
              <div class="mb-2 text-2xl">
                ✏️
              </div>

              <p
                class="text-sm font-extrabold text-slate-800"
              >
                S'entraîner
              </p>

              <p
                class="text-[11px] text-slate-500"
              >
                Exercices
              </p>
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  </div>
</template>