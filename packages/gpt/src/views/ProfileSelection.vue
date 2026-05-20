<!-- src/views/ProfileSelectionView.vue -->

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Plus } from 'lucide-vue-next'

import { useAppStore } from '@/stores/app.store'
import { useProfileStore } from '@/stores/profile.store'
import ProfileCard from '../components/profile/ProfileCard.vue';

const appStore = useAppStore()
const profileStore = useProfileStore()

const { profiles } =
  storeToRefs(profileStore)

function handleProfileSelect(
  profileId: string,
) {
  profileStore.selectProfile(profileId)

  appStore.navigate('dashboard')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F6F7FB] p-4">
    <div class="relative w-full max-w-[900px] overflow-hidden rounded-[40px] bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
      <!-- Clouds -->
      <div class="absolute left-[-80px] top-10 h-40 w-40 rounded-full bg-violet-100 blur-lg"/>

      <div class="absolute bottom-0 right-[-80px] h-48 w-48 rounded-full bg-pink-100 blur-lg"/>

      <div class="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
        <!-- Header -->
        <div class="text- flex gap-4 justify-center items-center">
          <div class="flex size-20 items-center justify-center rounded-full text-3xl">
            👋
          </div>

          <div class="">
            <h1 class="text-4xl font-black tracking-tight text-slate-800 sm:text-3xl">
              Bonjour !
            </h1>

            <p class="mt-1 text-lg text-slate-500">
              Choisis ton profil pour
              continuer
            </p>
          </div>

        </div>

        <!-- Profiles -->
        <div class="mt-12 grid grid-cols-3 gap-4 md:grid-cols-4"
>
          <ProfileCard
            v-for="profile in profiles"
            :key="profile.id"
            @select="handleProfileSelect(profile.id)"
            :profile="profile"
          >
            
          </ProfileCard>

          <!-- New Profile -->
          <button
            @click="appStore.navigate('create-profile')"
            class="rounded-[28px] border-[2px] border-dashed border-violet-200 bg-violet-50 p-4 transition hover:bg-violet-100 hover:border-violet-200"
          >
            <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] bg-white">
              <Plus class="h-10 w-10 text-violet-500"/>
            </div>

            <h3 class="mt-4 text-lg font-bold text-slate-800">
              Nouveau
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Ajouter un profil
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>