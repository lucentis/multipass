<script setup>
import { computed } from 'vue'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { Progress } from '@/components/ui/progress'
import BottomNav from '@/components/BottomNav.vue'
import StarRating from '@/components/StarRating.vue'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const profile = computed(() => profilesStore.activeProfile)
const tables = computed(() => progressStore.getAllTables(profile.value?.id))

const stats = computed(() => {
  const ts = tables.value
  return {
    totalStars: ts.reduce((sum, t) => sum + t.stars, 0),
    tablesComplete: ts.filter(t => t.stars === 3).length,
    bestStreak: Math.max(...ts.map(t => t.bestStreak), 0),
  }
})

function xpProgress(xp) {
  return Math.min((xp / 500) * 100, 100)
}
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
      <span class="text-3xl leading-none">{{ profile?.avatar }}</span>
      <div>
        <p class="font-medium text-sm text-foreground leading-none mb-0.5">{{ profile?.name }}</p>
        <p class="text-xs text-muted-foreground">Mes progrès</p>
      </div>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-5 overflow-y-auto pb-24">

      <!-- Summary stats -->
      <div class="grid grid-cols-4 gap-2">
        <div class="flex flex-col items-center bg-muted rounded-xl p-3 text-center">
          <p class="text-xl font-medium text-foreground leading-none mb-1">{{ profile?.xp }}</p>
          <p class="text-[10px] text-muted-foreground">xp total</p>
        </div>
        <div class="flex flex-col items-center bg-muted rounded-xl p-3 text-center">
          <p class="text-xl font-medium text-foreground leading-none mb-1">{{ stats.totalStars }}</p>
          <p class="text-[10px] text-muted-foreground">étoiles</p>
        </div>
        <div class="flex flex-col items-center bg-muted rounded-xl p-3 text-center">
          <p class="text-xl font-medium text-foreground leading-none mb-1">{{ stats.tablesComplete }}/10</p>
          <p class="text-[10px] text-muted-foreground">tables ok</p>
        </div>
        <div class="flex flex-col items-center bg-muted rounded-xl p-3 text-center">
          <p class="text-xl font-medium text-foreground leading-none mb-1">🔥 {{ stats.bestStreak }}</p>
          <p class="text-[10px] text-muted-foreground">record</p>
        </div>
      </div>

      <!-- XP progression bar -->
      <div>
        <div class="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Niveau</span>
          <span>{{ profile?.xp }} / 500 xp</span>
        </div>
        <Progress :model-value="xpProgress(profile?.xp ?? 0)" class="h-2" />
      </div>

      <!-- Per-table breakdown -->
      <div class="bg-background border border-border rounded-xl overflow-hidden">
        <p class="text-xs font-medium text-muted-foreground px-4 py-3 border-b border-border">
          Détail par table
        </p>
        <div class="divide-y divide-border">
          <div
            v-for="table in tables"
            :key="table.number"
            :class="[
              'flex items-center gap-3 px-4 py-3 transition-opacity',
              !table.unlocked && 'opacity-40',
            ]"
          >
            <!-- Table label -->
            <span class="text-sm font-medium text-foreground w-8 shrink-0">×{{ table.number }}</span>

            <!-- Stars -->
            <StarRating :stars="table.stars" size="sm" class="shrink-0" />

            <!-- Lock or progress bar -->
            <template v-if="!table.unlocked">
              <span class="text-xs text-muted-foreground flex-1">🔒 verrouillée</span>
            </template>
            <template v-else>
              <div class="flex-1">
                <Progress
                  :model-value="Math.round((table.successRate ?? 0) * 100)"
                  :class="[
                    'h-1.5',
                    table.stars === 3 ? '[&>div]:bg-teal-500' : '[&>div]:bg-teal-400'
                  ]"
                />
              </div>
              <span class="text-xs text-muted-foreground w-8 text-right shrink-0">
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