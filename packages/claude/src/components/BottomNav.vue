<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import type { Screen } from '@/types/app'
import { House, Trophy, Cog, type LucideIcon } from '@lucide/vue'

const appStore = useAppStore()

const items: Array<{ screen: Screen; label: string; icon: LucideIcon }> = [
  { screen: 'dashboard', label: 'Accueil', icon: House },
  { screen: 'progress', label: 'Progrès', icon: Trophy },
  { screen: 'settings', label: 'Règlages', icon: Cog },
]
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background">
    <div class="max-w-md mx-auto flex">
      <button
        v-for="item in items"
        :key="item.screen"
        @click="appStore.navigate(item.screen)"
        :class="[
          'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] transition-colors',
          appStore.currentScreen === item.screen
            ? 'text-amber-700'
            : 'text-muted-foreground hover:text-foreground',
        ]"
      >
        <span class="text-xl">
          <component :is="item.icon"></component>
        </span>
        {{ item.label }}
      </button>
    </div>
  </div>
</template>