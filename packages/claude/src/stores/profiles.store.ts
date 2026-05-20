import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Profile } from '@/types/profile'
 
export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<Profile[]>([])
  const activeProfileId = ref<string | null>(null)
 
  const activeProfile = computed<Profile | null>(
    () => profiles.value.find(p => p.id === activeProfileId.value) ?? null
  )
 
  function add(name: string, avatar: string): Profile {
    const profile: Profile = {
      id: crypto.randomUUID(),
      name,
      avatar,
      xp: 0,
      createdAt: new Date().toISOString(),
    }
    profiles.value.push(profile)
    return profile
  }
 
  function remove(id: string): void {
    profiles.value = profiles.value.filter(p => p.id !== id)
    if (activeProfileId.value === id) activeProfileId.value = null
  }
 
  function update(id: string, patch: Partial<Pick<Profile, 'name' | 'avatar'>>): void {
    const profile = profiles.value.find(p => p.id === id)
    if (!profile) return
    if (patch.name !== undefined) profile.name = patch.name
    if (patch.avatar !== undefined) profile.avatar = patch.avatar
  }
 
  function select(id: string): void {
    activeProfileId.value = id
  }

  function addXp(xp: number) {
    activeProfile.value.xp += xp
  }
 
  return { profiles, activeProfileId, activeProfile, add, remove, update, select, addXp }
}, {
  persist: true,
})