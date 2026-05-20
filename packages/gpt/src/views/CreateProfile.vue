<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { AVATARS } from '@/constants/avatars'

import { useAppStore } from '@/stores/app.store'
import { useProfileStore } from '@/stores/profile.store'

import AvatarPicker from '@/components/profile/AvatarPicker.vue'

const appStore = useAppStore()
const profileStore = useProfileStore()

const selectedAvatar = ref('🦊')
const profileName = ref('')

const canCreate = computed(
  () => profileName.value.trim().length >= 2,
)

function handleCreateProfile() {
  const profile =
    profileStore.createProfile(
      profileName.value.trim(),
      selectedAvatar.value,
    )

  profileStore.selectProfile(profile.id)

  appStore.navigate('dashboard')
}
</script>

<template>
  <div
    class="min-h-screen bg-[#FCFAFF] px-6 py-8"
  >
    <div
      class="mx-auto max-w-md"
    >
      <!-- Back -->
      <button
        @click="
          appStore.navigate(
            'profiles',
          )
        "
        class="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <ArrowLeft
          class="h-5 w-5 text-slate-600"
        />
      </button>

      <!-- Hero -->
      <div class="text-center">
        <div
          class="mx-auto flex h-44 w-44 items-center justify-center rounded-[50px] bg-violet-100 text-[88px] shadow-sm"
        >
          {{ selectedAvatar }}
        </div>

        <h1
          class="mt-8 text-[40px] font-black leading-tight text-slate-800"
        >
          Nouveau profil
        </h1>

        <p
          class="mt-3 text-lg text-slate-400"
        >
          Choisis ton nouvel ami
        </p>
      </div>

      <!-- Picker -->
      <div class="mt-10">
        <AvatarPicker
          v-model="selectedAvatar"
          :avatars="AVATARS"
        />
      </div>

      <!-- Name -->
      <div class="mt-10">
        <Input
          v-model="profileName"
          placeholder="Ton prénom"
          class="h-16 rounded-[24px] border-0 bg-white px-6 text-lg shadow-[0_8px_24px_rgba(15,23,42,0.05)] placeholder:text-slate-300 focus-visible:ring-violet-200"
        />
      </div>

      <!-- CTA -->
      <Button
        :disabled="!canCreate"
        @click="handleCreateProfile"
        class="mt-8 h-16 w-full rounded-[28px] bg-violet-500 text-lg font-semibold shadow-lg shadow-violet-200 hover:bg-violet-600"
      >
        Créer mon profil ✨
      </Button>
    </div>
  </div>
</template>