<script setup lang="ts">
import { computed } from 'vue'

import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import BottomNav from '@/components/BottomNav.vue'
import StarRating from '@/components/StarRating.vue'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const profile = computed(() => profilesStore.activeProfile!)
const tables = computed(() => progressStore.getAllTables(profile.value.id))
const stats = computed(() => progressStore.getStats(profile.value.id))

const xpPercent = computed(() => Math.min((profile.value.xp / 500) * 100, 100))
</script>

<template>
  <div class="flex min-h-dvh flex-col">

    <!-- Header -->
    <div class="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
      <span class="text-3xl leading-none">{{ profile.avatar }}</span>
      <div>
        <p class="text-sm font-medium leading-none text-foreground mb-0.5">{{ profile.name }}</p>
        <p class="text-xs text-muted-foreground">Mes progrès</p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">

      <!-- Summary stats -->
      <div class="grid grid-cols-4 gap-2">
        <div class="flex flex-col items-center rounded-xl bg-muted p-3 text-center">
          <p class="text-xl font-medium leading-none text-foreground mb-1">{{ profile.xp }}</p>
          <p class="text-[10px] text-muted-foreground">xp total</p>
        </div>
        <div class="flex flex-col items-center rounded-xl bg-muted p-3 text-center">
          <p class="text-xl font-medium leading-none text-foreground mb-1">{{ stats.totalStars }}</p>
          <p class="text-[10px] text-muted-foreground">étoiles</p>
        </div>
        <div class="flex flex-col items-center rounded-xl bg-muted p-3 text-center">
          <p class="text-xl font-medium leading-none text-foreground mb-1">{{ stats.tablesComplete }}/10</p>
          <p class="text-[10px] text-muted-foreground">tables ok</p>
        </div>
        <div class="flex flex-col items-center rounded-xl bg-muted p-3 text-center">
          <p class="text-xl font-medium leading-none text-foreground mb-1">🔥 {{ stats.bestStreak }}</p>
          <p class="text-[10px] text-muted-foreground">record</p>
        </div>
      </div>

      <!-- XP bar -->
      <div>
        <div class="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Progression</span>
          <span>{{ profile.xp }} / 500 xp</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-teal-500 transition-all duration-500"
            :style="{ width: xpPercent + '%' }"
          />
        </div>
      </div>

      <!-- Per-table breakdown -->
      <div class="overflow-hidden rounded-xl border border-border bg-background">
        <p class="border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
          Détail par table
        </p>
        <div class="divide-y divide-border">
          <div
            v-for="table in tables"
            :key="table.number"
            :class="[
              'flex items-center gap-3 px-4 py-3',
              !table.unlocked && 'opacity-40',
            ]"
          >
            <span class="w-8 shrink-0 text-sm font-medium text-foreground">
              ×{{ table.number }}
            </span>

            <StarRating :stars="table.stars" size="sm" class="shrink-0" />

            <template v-if="!table.unlocked">
              <span class="flex-1 text-xs text-muted-foreground">🔒 verrouillée</span>
            </template>
            <template v-else>
              <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  :class="[
                    'h-full rounded-full transition-all',
                    table.stars === 3 ? 'bg-teal-500' : 'bg-teal-400',
                  ]"
                  :style="{ width: Math.round(table.successRate * 100) + '%' }"
                />
              </div>
              <span class="w-8 shrink-0 text-right text-xs text-muted-foreground">
                {{ table.totalAttempts > 0 ? Math.round(table.successRate * 100) + '%' : '—' }}
              </span>
            </template>
          </div>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>