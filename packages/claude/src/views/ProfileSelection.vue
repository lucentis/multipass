<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles.store'
import { useAppStore } from '@/stores/app.store'
 
const profilesStore = useProfilesStore()
const appStore = useAppStore()

function selectProfile(id: string): void {
  profilesStore.select(id)

  appStore.navigate('dashboard')
}
 
function xpToPercent(xp: number): number {
  return Math.min((xp / 500) * 100, 100)
}
</script>
 
<template>
  <div class="flex flex-col flex-1 p-6">
 
    <div class="text-center py-8">
      <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
        multibul
      </p>
      <h1 class="text-xl font-medium text-foreground mb-1">Qui joue aujourd'hui ?</h1>
      <p class="text-sm text-muted-foreground">Choisis ton profil</p>
    </div>
 
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="profile in profilesStore.profiles"
        :key="profile.id"
        @click="selectProfile(profile.id)"
        class="flex flex-col items-center p-4 bg-background border border-border rounded-xl hover:border-teal-400 transition-colors text-left"
      >
        <span class="text-4xl leading-none mb-3">{{ profile.avatar }}</span>
        <p class="font-medium text-sm text-foreground mb-2.5 truncate w-full text-center">
          {{ profile.name }}
        </p>
        <div class="w-full bg-muted rounded-full h-1 mb-1">
          <div
            class="bg-teal-500 h-1 rounded-full transition-all"
            :style="{ width: xpToPercent(profile.xp) + '%' }"
          />
        </div>
        <span class="text-xs text-muted-foreground">{{ profile.xp }} xp</span>
      </button>
 
      <button
        @click="appStore.navigate('create-profile')"
        class="flex flex-col items-center justify-center gap-2 p-4 bg-muted border border-dashed border-border rounded-xl hover:border-teal-400 transition-colors min-h-[130px]"
      >
        <span class="text-2xl text-muted-foreground">＋</span>
        <span class="text-xs text-muted-foreground">Nouveau</span>
      </button>
    </div>
 
  </div>
</template>