<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles.store'
import { useAppStore } from '@/stores/app.store'
import { useProgressStore } from '@/stores/progress.store'
import masquotte from '@/assets/avatars/panda.png'

const profilesStore = useProfilesStore()
const appStore = useAppStore()
const progression = useProgressStore()

function selectProfile(id: string): void {
  profilesStore.select(id)
  progression.init(id)
  appStore.navigate('dashboard')
}

function xpToPercent(xp: number): number {
  return Math.min((xp / 500) * 100, 100)
}
</script>

<template>
  <div class="relative font-[Nunito] bg-amber-50/30 min-h-dvh">

    <!-- background blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-12 -right-10 size-50 rounded-full bg-amber-100/80 blur-[2px]" />
      <div class="absolute top-[-20px] right-24 size-24 rounded-full bg-amber-200/50 blur-[2px]" />
      <div class="absolute -bottom-10 -left-10 size-50 rounded-full bg-amber-200/70 blur-[2px]" />
      <div class="absolute bottom-8 left-30 size-20 rounded-full bg-amber-300/40 blur-[2px]" />
      <div class="absolute top-1/2 -right-20 size-50 rounded-full bg-amber-200/40 blur-[2px]" />
    </div>

    <div class="relative z-10 flex h-full flex-col">

      <!-- Header -->
      <div class="p-4 text-center z-20 text-center">
        <!-- mascot -->
        <div
          class="mx-auto mb-4 flex size-30 items-center justify-center rounded-full bg-amber-50"
        >
          <!-- remplace par ton asset renard -->
          <img
            :src="masquotte"
            alt="Fox mascot"
            class="h-full w-full object-contain"
          >
        </div>


        <h1 class=" text-3xl font-extrabold text-amber-700 leading-none tracking-tight">
          Bonjour !
        </h1>

        <p class="text-xs font-bold text-slate-500">
          Choisis ton profil
        </p>
      </div>


      <!-- Profiles -->
      <div class="flex-1 p-4">
        <div class="grid grid-cols-2 gap-4 px-1">

          <button
            v-for="profile in profilesStore.profiles"
            :key="profile.id"
            @click="selectProfile(profile.id)"
            class="rounded-lg bg-white px-2 py-2 text-center shadow-[0_3px_10px_rgba(0,0,0,0.07)] border"
          >
            <!-- Avatar -->
            <div
              class="mx-auto flex size-24 items-center justify-center rounded-full bg-amber-50"
            >
              <span class="text-6xl leading-none">
                {{ profile.avatar }}
              </span>
            </div>

            <!-- Name -->
            <p class="text-lg font-extrabold text-amber-800">
              {{ profile.name }}
            </p>

            <!-- XP Bar -->
            <div class="mx-[2px] mb-1 mt-[5px] h-2 rounded-full bg-slate-100">
              <div
                class="h-2 rounded-full bg-amber-500 transition-all"
                :style="{ width: xpToPercent(profile.xp) + '%' }"
              />
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center px-[2px]">
              <span class="text-xs font-bold text-slate-500">
                {{ profile.xp }} XP
              </span>

              <span class="text-sm font-bold text-amber-500">
                ★ {{ progression.getStats(profile.id).totalStars }}
              </span>
            </div>
          </button>

          <!-- Create profile -->
          <button
            @click="appStore.navigate('create-profile')"
            class="flex min-h-[190px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white shadow-[0_3px_10px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
          >
            <div
              class="mb-1 flex size-14 items-center justify-center rounded-full bg-amber-700 text-3xl text-white"
            >
              +
            </div>

            <p class="text-[11px] font-bold text-slate-500">
              Nouveau
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>