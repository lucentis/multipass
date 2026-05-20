<script setup>
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import { useSessionStore } from '@/stores/session.store'

const profilesStore = useProfilesStore()
const progressStore = useProgressStore()
const sessionStore = useSessionStore()

function selectProfile(id) {
  profilesStore.selectProfile(id)
  progressStore.initProfile(id)
  sessionStore.navigateTo('dashboard')
}

function xpProgress(xp) {
  return Math.min((xp / 500) * 100, 100)
}
</script>

<template>
  <div class="flex-1 flex flex-col p-6">

    <!-- Header -->
    <div class="text-center py-8">
      <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
        multibul
      </p>
      <h1 class="text-xl font-medium text-foreground mb-1">Qui joue aujourd'hui ?</h1>
      <p class="text-sm text-muted-foreground">Choisis ton profil</p>
    </div>

    <!-- Profile grid -->
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="profile in profilesStore.profiles"
        :key="profile.id"
        @click="selectProfile(profile.id)"
        class="flex flex-col items-center p-4 bg-background border border-border rounded-xl hover:border-teal-400 transition-colors"
      >
        <span class="text-4xl leading-none mb-3">{{ profile.avatar }}</span>
        <p class="font-medium text-sm text-foreground mb-2.5">{{ profile.name }}</p>
        <div class="w-full bg-muted rounded-full h-1 mb-1">
          <div
            class="bg-teal-500 h-1 rounded-full transition-all"
            :style="{ width: xpProgress(profile.xp) + '%' }"
          />
        </div>
        <span class="text-xs text-muted-foreground">{{ profile.xp }} xp</span>
      </button>

      <!-- New profile card -->
      <button
        @click="sessionStore.navigateTo('profile-create')"
        class="flex flex-col items-center justify-center p-4 bg-muted border border-dashed border-border rounded-xl hover:border-teal-400 transition-colors min-h-[130px] gap-2"
      >
        <span class="text-2xl text-muted-foreground">＋</span>
        <span class="text-xs text-muted-foreground">Nouveau</span>
      </button>
    </div>

  </div>
</template>