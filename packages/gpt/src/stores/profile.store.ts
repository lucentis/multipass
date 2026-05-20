import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Profile } from '@/types/profile'

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profiles = ref<Profile[]>([
      {
        id: crypto.randomUUID(),
        name: 'Léa',
        avatar: '🦊',
        xp: 120,
        createdAt: new Date().toISOString(),
      },
    ])

    const currentProfileId = ref<string | null>(null)

    const currentProfile = computed(() =>
      profiles.value.find(
        profile => profile.id === currentProfileId.value,
      ),
    )

    function createProfile(
      name: string,
      avatar: string,
    ) {
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

    function selectProfile(profileId: string) {
      currentProfileId.value = profileId
    }

    return {
      profiles,
      currentProfileId,
      currentProfile,

      createProfile,
      selectProfile,
    }
  },
  {
    persist: true,
  },
)