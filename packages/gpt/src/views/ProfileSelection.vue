<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Plus } from 'lucide-vue-next'

import { useAppStore } from '@/stores/app.store'
import { useProfileStore } from '@/stores/profile.store'

import ProfileCard from '@/components/profile/ProfileCard.vue'

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
  <div
    class="min-h-screen bg-[#FCFAFF] px-6 py-10"
  >
    <div
      class="mx-auto flex min-h-screen max-w-md flex-col"
    >
      <!-- Hero -->
      <div class="mb-12 text-center">
        <div class="mb-5 text-7xl">
          ✨
        </div>

        <h1
          class="text-[42px] font-black leading-[1.05] tracking-tight text-slate-800"
        >
          Qui apprend
          <br />
          aujourd’hui ?
        </h1>

        <p
          class="mt-4 text-lg text-slate-400"
        >
          Choisis ton profil
        </p>
      </div>

      <!-- Profiles -->
      <div class="space-y-5">
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          @select="
            handleProfileSelect(
              profile.id,
            )
          "
        />

        <!-- New Profile -->
        <button
          @click="
            appStore.navigate(
              'create-profile',
            )
          "
          class="w-full rounded-[42px] border-[3px] border-dashed border-violet-200 bg-violet-50/60 p-8 transition-all duration-300 hover:bg-violet-100/60"
        >
          <div
            class="flex flex-col items-center justify-center"
          >
            <div
              class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Plus
                class="h-10 w-10 text-violet-500"
              />
            </div>

            <h2
              class="text-2xl font-bold text-slate-800"
            >
              Nouveau profil
            </h2>

            <p
              class="mt-2 text-slate-400"
            >
              Créer un ami
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>