<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import type { Screen } from '@/types/app'

const appStore = useAppStore()

const items: Array<{ screen: Screen; label: string; icon: string }> = [
  { screen: 'dashboard', label: 'Accueil', icon: '🏠' },
  { screen: 'progress', label: 'Progrès', icon: '📊' },
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
          'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors',
          appStore.currentScreen === item.screen
            ? 'text-teal-700'
            : 'text-muted-foreground hover:text-foreground',
        ]"
      >
        <span class="text-xl">{{ item.icon }}</span>
        {{ item.label }}
      </button>
    </div>
  </div>
</template>