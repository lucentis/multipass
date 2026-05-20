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
    class="group w-full overflow-hidden rounded-[42px] bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] active:scale-[0.98]"
  >
    <div class="flex items-center gap-5">
      <!-- Avatar -->
      <div
        class="flex h-28 w-28 shrink-0 items-center justify-center rounded-[34px] bg-violet-100 text-[64px] transition-transform duration-300 group-hover:scale-105"
      >
        {{ profile.avatar }}
      </div>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <h2
          class="truncate text-[28px] font-bold tracking-tight text-slate-800"
        >
          {{ profile.name }}
        </h2>

        <p
          class="mt-1 text-base text-slate-400"
        >
          {{ profile.xp }} XP
        </p>

        <div class="mt-5">
          <div
            class="h-3 overflow-hidden rounded-full bg-violet-100"
          >
            <div
              class="h-full rounded-full bg-teal-300 transition-all duration-500"
              :style="{
                width: `${Math.min(profile.xp, 100)}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>