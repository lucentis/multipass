import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref([])
  const activeProfileId = ref(null)

  const activeProfile = computed(() =>
    profiles.value.find(p => p.id === activeProfileId.value) ?? null
  )

  function createProfile(name, avatar) {
    const profile = {
      id: crypto.randomUUID(),
      name,
      avatar,
      xp: 0,
      createdAt: new Date().toISOString(),
    }
    profiles.value.push(profile)
    return profile
  }

  function selectProfile(id) {
    activeProfileId.value = id
  }

  function addXp(profileId, amount) {
    const profile = profiles.value.find(p => p.id === profileId)
    if (profile) profile.xp += amount
  }

  return { profiles, activeProfileId, activeProfile, createProfile, selectProfile, addXp }
}, {
  persist: true,
})