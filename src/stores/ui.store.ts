import { defineStore } from 'pinia'
import { ref } from 'vue'

// Valid tabs:
// profile-select | profile-create | dashboard | practice | discover | recap | progress
export const useUiStore = defineStore('ui', () => {
  const tab = ref('profile-select')
  const tableNumber = ref(null)

  function navigate(newTab, table = null) {
    tab.value = newTab
    if (table !== null) tableNumber.value = table
  }

  return { tab, tableNumber, navigate }
})