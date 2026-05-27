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

onMounted(() => {
  if (gameStore.tableNumber !== null) {
    gameStore.startDiscover(gameStore.tableNumber)
  }
})

const revealed = ref(false)

const example = computed(() => gameStore.currentExample)
const index = computed(() => gameStore.discoverIndex)
const total = computed(() => gameStore.examples.length)

const progressPercent = computed(() =>
  ((index.value + (revealed.value ? 1 : 0)) / total.value) * 100,
)

function buildRows<T>(items: T[]): T[][] {
  const count = items.length

  const layouts: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [2, 1],
    4: [2, 2],
    5: [3, 2],
    6: [3, 3],
    7: [3, 2, 2],
    8: [3, 3, 2],
    9: [3, 3, 3],
    10: [3, 3, 3, 1],
  }

  const layout = layouts[count] ?? [count]

  const rows: T[][] = []
  let cursor = 0

  for (const size of layout) {
    rows.push(items.slice(cursor, cursor + size))
    cursor += size
  }

  return rows
}

const groups = computed(() => {
  if (!example.value) return []

  return Array.from(
    { length: example.value.a },
    () => {
      const items = Array.from(
        { length: example.value!.b },
        () => example.value!.emoji,
      )

      return {
        rows: buildRows(items),
      }
    },
  )
})

function emojiSize(count: number): string {
  if (count <= 2) return 'text-3xl'
  if (count === 3) return 'text-2xl'
  if (count <= 5) return 'text-xl'
  if (count <= 7) return 'text-lg'
  return 'text-lg'
}

function reveal(): void {
  revealed.value = true
}

function next(): void {
  if (gameStore.isDiscoverComplete) return

  revealed.value = false
  gameStore.nextDiscover()

  if (gameStore.isDiscoverComplete) {
    progressStore.markDiscovered(
      profilesStore.activeProfile!.id,
      gameStore.tableNumber!,
    )
  }
}

function goToPractice(): void {
  gameStore.startPractice(gameStore.tableNumber!)
  appStore.navigate('practice')
}

function goToNextDiscover(): void {
  const allTables = progressStore.getAllTables(
    profilesStore.activeProfile!.id,
  )

  const next = allTables.find(
    t => t.unlocked && !t.discovered,
  )

  if (next) {
    gameStore.startDiscover(next.number)
    revealed.value = false
  } else {
    appStore.navigate('dashboard')
  }
}
</script>

<template>
  <div class="relative h-dvh overflow-hidden bg-amber-50/30 font-[Nunito]">

    <!-- blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-12 -right-10 size-50 rounded-full bg-amber-100/80 blur-[2px]" />
      <div class="absolute top-[-20px] right-24 size-24 rounded-full bg-amber-200/50 blur-[2px]" />
      <div class="absolute -bottom-10 -left-10 size-50 rounded-full bg-amber-200/70 blur-[2px]" />
      <div class="absolute bottom-8 left-30 size-20 rounded-full bg-amber-300/40 blur-[2px]" />
      <div class="absolute top-1/2 -right-20 size-50 rounded-full bg-amber-200/40 blur-[2px]" />
    </div>

    <!-- Done screen -->
    <template v-if="gameStore.isDiscoverComplete">
      <div class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">

        <div class="mb-5 flex size-24 items-center justify-center rounded-full bg-amber-100">
          <span class="text-5xl">🌟</span>
        </div>

        <h1 class="text-3xl font-extrabold text-amber-800">
          Bravo !
        </h1>

        <p class="mt-2 text-lg font-bold text-amber-700">
          Table ×{{ gameStore.tableNumber }} découverte
        </p>

        <p class="mt-2 text-sm font-semibold text-slate-500">
          Tu peux maintenant t'entraîner !
        </p>

        <div class="mt-8 flex w-full flex-col gap-3">
          <button
            @click="goToPractice"
            class="rounded-[28px] bg-amber-500 py-4 text-base font-extrabold text-white shadow-sm active:scale-[0.98]"
          >
            S'entraîner
          </button>

          <button
            @click="goToNextDiscover"
            class="rounded-[28px] bg-white py-4 text-base font-bold text-amber-800 shadow-sm active:scale-[0.98]"
          >
            Découvrir suivante →
          </button>

          <button
            @click="appStore.navigate('dashboard')"
            class="text-sm font-bold text-slate-500"
          >
            Retour accueil
          </button>
        </div>
      </div>
    </template>

    <!-- Discover -->
    <template v-else-if="example">
      <div class="relative z-10 flex h-full flex-col p-4">

        <!-- compact header -->
        <div class="mb-5 flex items-center gap-3">
          <button
            @click="appStore.navigate('dashboard')"
            class="shrink-0 text-sm font-bold text-amber-700"
          >
            ←
          </button>

          <p class="shrink-0 text-lg font-extrabold text-amber-800">
            ×{{ gameStore.tableNumber }}
          </p>

          <div class="h-2 flex-1 overflow-hidden rounded-full bg-amber-100">
            <div
              class="h-full rounded-full bg-amber-500 transition-all"
              :style="{ width: progressPercent + '%' }"
            />
          </div>

          <p class="shrink-0 text-sm font-bold text-slate-500">
            {{ index + 1 }}/{{ total }}
          </p>
        </div>

        <!-- label -->
        <div class="mb-5 text-center">
          <p class="text-sm font-bold text-amber-700">
            {{ example.a }} groupes • {{ example.b }} {{ example.emoji }}
          </p>
        </div>

        <!-- groups -->
        <div class="mb-5 grid grid-cols-3 gap-2">
          <div
            v-for="(group, idx) in groups"
            :key="idx"
            class="aspect-square rounded-lg bg-amber-50 p-2 shadow-sm ring-1 ring-amber-100"
          >
            <div class="flex h-full flex-col items-center justify-center gap-1">
              <div
                v-for="(row, rowIdx) in group.rows"
                :key="rowIdx"
                class=" flex justify-center gap-1"
              >
                <span
                  v-for="(emoji, emojiIdx) in row"
                  :key="emojiIdx"
                  class="leading-none"
                  :class="emojiSize(example.b)"
                >
                  {{ emoji }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- equation -->
        <div class="py-5 text-center">
          <p class="text-4xl font-extrabold tracking-tight text-amber-800">
            {{ example.a }}
            ×
            {{ example.b }}
            =

            <span
              :class="
                revealed
                  ? 'text-amber-500'
                  : 'text-slate-400'
              "
            >
              {{ revealed ? example.answer : '?' }}
            </span>
          </p>
        </div>

        <!-- feedback -->
        <div class="min-h-[56px] text-center">
          <p
            v-if="!revealed"
            class="text-sm font-bold text-slate-500"
          >
            Compte les {{ example.emoji }}
          </p>

          <div
            v-else
            class="rounded-[24px] bg-amber-100 px-4 py-3"
          >
            <p class="font-bold text-amber-800">
              Bravo ✨
            </p>

            <p class="text-sm font-semibold text-amber-700">
              {{ example.answer }} au total !
            </p>
          </div>
        </div>

        <!-- footer -->
        <div class="mt-auto shrink-0 pt-3">
          <button
            v-if="!revealed"
            @click="reveal"
            class="w-full rounded-[28px] bg-amber-500 py-4 text-lg font-extrabold text-white shadow-sm active:scale-[0.98]"
          >
            Voir la réponse
          </button>

          <button
            v-else
            @click="next"
            class="w-full rounded-[28px] bg-amber-500 py-4 text-lg font-extrabold text-white shadow-sm active:scale-[0.98]"
          >
            {{ index < total - 1 ? "J'ai compris !" : 'Terminer 🎉' }}
          </button>
        </div>

      </div>
    </template>
  </div>
</template>