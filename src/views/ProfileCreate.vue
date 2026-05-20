<script setup>
import { ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { useSessionStore } from '@/stores/session.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()
const sessionStore = useSessionStore()

const AVATARS = ['🦊','🐸','🐼','🐨','🦁','🐯','🐶','🐱','🐰','🦆','🐧','🐻','🐮','🐷','🐹','🦉']

const newName = ref('')
const newAvatar = ref('🦊')
const nameError = ref(false)

function createProfile() {
  if (!newName.value.trim()) {
    nameError.value = true
    return
  }
  const profile = profilesStore.createProfile(newName.value.trim(), newAvatar.value)
  progressStore.initProfile(profile.id)
  profilesStore.selectProfile(profile.id)
  sessionStore.navigateTo('dashboard')
}
</script>

<template>
  <div class="flex-1 flex flex-col">

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
      <button
        @click="sessionStore.navigateTo('profile')"
        class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Retour
      </button>
    </div>

    <div class="flex-1 p-6 flex flex-col gap-6">

      <!-- Title -->
      <div class="text-center pt-2">
        <h1 class="text-xl font-medium text-foreground mb-1">Nouveau profil</h1>
        <p class="text-sm text-muted-foreground">Choisis un animal et ton prénom</p>
      </div>

      <!-- Avatar preview -->
      <div class="text-center">
        <span class="text-6xl leading-none">{{ newAvatar }}</span>
      </div>

      <!-- Avatar picker -->
      <div>
        <p class="text-xs text-muted-foreground mb-2">Ton animal</p>
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="emoji in AVATARS"
            :key="emoji"
            @click="newAvatar = emoji"
            :class="[
              'text-2xl py-1.5 rounded-xl border transition-colors',
              newAvatar === emoji
                ? 'border-teal-500 bg-teal-50'
                : 'border-transparent hover:bg-muted',
            ]"
          >{{ emoji }}</button>
        </div>
      </div>

      <!-- Name input -->
      <div>
        <p class="text-xs text-muted-foreground mb-2">Ton prénom</p>
        <Input
          v-model="newName"
          placeholder="Mon prénom…"
          :class="nameError && 'border-red-400'"
          @input="nameError = false"
          @keyup.enter="createProfile"
        />
        <p v-if="nameError" class="text-xs text-red-500 mt-1.5">Écris ton prénom d'abord !</p>
      </div>

      <!-- Submit -->
      <Button
        @click="createProfile"
        class="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base mt-auto"
      >
        Créer mon profil
      </Button>

    </div>
  </div>
</template>