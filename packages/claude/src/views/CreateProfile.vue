<script setup lang="ts">
import { ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { useAppStore } from '@/stores/app.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import masquotte from '@/assets/avatars/panda.png'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()
const appStore = useAppStore()

const AVATARS = [
  '🦊', '🐸', '🐼', '🐨',
  '🦁', '🐯', '🐶', '🐱',
  '🐰', '🦆', '🐧', '🐻',
  '🐮', '🐷', '🐹', '🦉',
]

const newName = ref('')
const newAvatar = ref('🦊')
const nameError = ref(false)

function createProfile() {
  if (!newName.value.trim()) {
    nameError.value = true
    return
  }

  const profile = profilesStore.add(
    newName.value.trim(),
    newAvatar.value,
  )

  progressStore.init(profile.id)
  profilesStore.select(profile.id)
  appStore.navigate('dashboard')
}
</script>

<template>
  <div class="relative h-dvh overflow-hidden bg-amber-50/30 font-[Nunito]">

    <!-- background blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-12 -right-10 size-50 rounded-full bg-amber-100/80 blur-[2px]" />
      <div class="absolute top-[-20px] right-24 size-24 rounded-full bg-amber-200/50 blur-[2px]" />
      <div class="absolute -bottom-10 -left-10 size-50 rounded-full bg-amber-200/70 blur-[2px]" />
      <div class="absolute bottom-8 left-30 size-20 rounded-full bg-amber-300/40 blur-[2px]" />
      <div class="absolute top-1/2 -right-20 size-50 rounded-full bg-amber-200/40 blur-[2px]" />
    </div>

    <div class="relative z-10 flex h-full flex-col px-4 pb-4">

      <!-- Back -->
      <div class="pt-2">
        <button
          @click="appStore.navigate('profiles')"
          class="text-sm font-bold text-slate-500 transition-colors hover:text-slate-700"
        >
          ← Retour
        </button>
      </div>

      <!-- Header -->
      <div class="pb-3 pt-1 text-center">
        <div
          class="mx-auto mb-2 flex size-22 items-center justify-center rounded-full bg-amber-50"
        >
          <img
            :src="masquotte"
            alt="Mascotte"
            class="h-full w-full object-contain"
          >
        </div>

        <h1
          class="text-2xl font-extrabold leading-none tracking-tight text-amber-700"
        >
          Nouveau profil
        </h1>

        <p class="mt-1 text-xs font-medium text-slate-500">
          Choisis ton animal et ton prénom
        </p>
      </div>

      <!-- Avatar picker -->
      <div class="mb-4">
        <p class="mb-2 text-xs font-bold text-slate-600">
          Ton animal
        </p>

        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="emoji in AVATARS"
            :key="emoji"
            @click="newAvatar = emoji"
            :class="[
              'flex aspect-square items-center justify-center rounded-xl border bg-white text-3xl transition-all duration-150 active:scale-95',
              newAvatar === emoji
                ? 'scale-105 border-amber-300 bg-amber-50 ring-1 ring-amber-300 shadow-sm'
                : 'border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
            ]"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Name input -->
      <div class="mb-4">
        <p class="mb-2 text-xs font-bold text-slate-600">
          Ton prénom
        </p>

        <Input
          v-model="newName"
          placeholder="Mon prénom..."
          :class="[
            'h-12 rounded-xl border-white bg-white text-center text-base shadow-sm',
            nameError && 'border-red-400'
          ]"
          @input="nameError = false"
          @keyup.enter="createProfile"
        />

        <p
          v-if="nameError"
          class="mt-1 text-xs font-medium text-red-500"
        >
          Écris ton prénom d'abord !
        </p>
      </div>

      <!-- CTA -->
      <Button
        @click="createProfile"
        class="mt-auto h-12 rounded-xl bg-amber-600 text-sm font-bold text-white hover:bg-amber-700"
      >
        Créer mon profil
      </Button>
    </div>
  </div>
</template>