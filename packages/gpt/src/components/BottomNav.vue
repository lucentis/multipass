<script setup>
import { useSessionStore } from '@/stores/session.store'

const session = useSessionStore()

function go(tab) {
  session.navigateTo(tab)
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-10">
    <div class="max-w-md mx-auto border-t border-border bg-background flex">
      <button
        @click="go('dashboard')"
        :class="[
          'flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors',
          session.currentTab === 'dashboard' ? 'text-teal-700' : 'text-muted-foreground',
        ]"
      >
        <span class="text-xl">🏠</span>
        Accueil
      </button>
      <button
        @click="go('progress')"
        :class="[
          'flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors',
          session.currentTab === 'progress' ? 'text-teal-700' : 'text-muted-foreground',
        ]"
      >
        <span class="text-xl">📊</span>
        Progrès
      </button>
    </div>
  </div>
</template>