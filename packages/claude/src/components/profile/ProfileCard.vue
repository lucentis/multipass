<!-- src/components/profile/ProfileCard.vue -->

<script setup lang="ts">
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    @click="emit('select')"
    class="group w-full rounded-[28px] border border-violet-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[42px]">
        {{ profile.avatar }}
      </div>

        <h3 class="truncate text-xl font-bold text-slate-800">
          {{ profile.name }}
        </h3>

        <div class="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span>⭐</span>
          <span>{{ profile.xp }} XP</span>
        </div>

        <div class="mt-3 h-2 overflow-hidden rounded-full bg-violet-100 w-4/5">
          <div
            class="h-2 rounded-full bg-teal-300 transition-all duration-500"
            :style="{
              width: `${1000 / profile.xp}%`,
            }"
          />
        </div>
      </div>
  </button>
</template>