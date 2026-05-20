import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Screen } from '@/types/app'

export const useAppStore = defineStore('app', () => {
  const currentScreen = ref<Screen>('profiles')

  function navigate(screen: Screen) {
    currentScreen.value = screen
  }

  return {
    currentScreen,
    navigate,
  }
})