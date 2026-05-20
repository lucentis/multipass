<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { Card } from '@/components/ui/card'

import { useProfilesStore } from '@/stores/profiles.store'

const profileStore = useProfilesStore()

const { currentProfile } =
  storeToRefs(profileStore)
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <Card
      class="mx-auto max-w-md rounded-[32px] border-0 bg-white p-8 shadow-sm"
    >
      <div class="text-center">
        <div class="mb-4 text-6xl">
          {{ currentProfile?.avatar }}
        </div>

        <h1
          class="text-3xl font-bold text-slate-800"
        >
          Salut {{ currentProfile?.name }} 👋
        </h1>

        <p class="mt-2 text-slate-500">
          Dashboard à venir
        </p>
      </div>
    </Card>
  </div>
</template>