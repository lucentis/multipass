<script setup lang="ts">
import { ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles.store'
import { useAppStore } from '@/stores/app.store'

const profilesStore = useProfilesStore()
const appStore = useAppStore()

const AVATARS = [
  '🦊', '🐸', '🐼', '🐨', '🦁', '🐯',
  '🐶', '🐱', '🐰', '🦆', '🐧', '🐻',
  '🐮', '🐷', '🐹', '🦉', '🐺', '🦊',
]

const name = ref('')
const avatar = ref('🦊')
const nameError = ref(false)

function create(): void {
  if (!name.value.trim()) {
    nameError.value = true
    return
  }
  const profile = profilesStore.add(name.value.trim(), avatar.value)
  profilesStore.select(profile.id)
  appStore.navigate('dashboard')

}
</script>

<template>
  <div class="flex flex-col flex-1">

    <div class="flex items-center px-4 py-3 border-b border-border">
      <button
        @click="appStore.navigate('profiles')"
        class="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Retour
      </button>
    </div>

    <div class="flex flex-col flex-1 p-6 gap-6">

      <div class="text-center pt-2">
        <h1 class="text-xl font-medium text-foreground mb-1">Nouveau profil</h1>
        <p class="text-sm text-muted-foreground">Choisis un animal et ton prénom</p>
      </div>

      <!-- Avatar preview -->
      <div class="text-center">
        <span class="text-6xl leading-none">{{ avatar }}</span>
      </div>

      <!-- Avatar picker -->
      <div>
        <p class="text-xs text-muted-foreground mb-2">Ton animal</p>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="emoji in AVATARS"
            :key="emoji"
            @click="avatar = emoji"
            :class="[
              'text-2xl py-2 rounded-xl border transition-colors',
              avatar === emoji
                ? 'border-teal-500 bg-teal-50'
                : 'border-transparent hover:bg-muted',
            ]"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Name input -->
      <div>
        <p class="text-xs text-muted-foreground mb-2">Ton prénom</p>
        <input
          v-model="name"
          type="text"
          placeholder="Mon prénom…"
          :class="[
            'w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none transition-colors',
            'focus:ring-2 focus:ring-teal-500 focus:border-transparent',
            nameError ? 'border-red-400' : 'border-border',
          ]"
          @input="nameError = false"
          @keyup.enter="create"
        />
        <p v-if="nameError" class="text-xs text-red-500 mt-1.5">
          Écris ton prénom d'abord !
        </p>
      </div>

      <button
        @click="create"
        class="w-full mt-auto py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors text-base"
      >
        Créer mon profil
      </button>

    </div>
  </div>
</template>