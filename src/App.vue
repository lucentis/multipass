<script setup>
import { computed } from 'vue'
import { useSessionStore } from '@/stores/session.store'
import ProfileSelect from '@/views/ProfileSelect.vue'
import ProfileCreate from '@/views/ProfileCreate.vue'
import Dashboard from '@/views/Dashboard.vue'
import Practice from '@/views/Practice.vue'
import Discover from '@/views/Discover.vue'
import Recap from '@/views/Recap.vue'
import Progress from '@/views/Progress.vue'

const session = useSessionStore()
const tab = computed(() => session.currentTab)
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <div class="max-w-md mx-auto min-h-screen flex flex-col">
      <ProfileSelect v-if="tab === 'profile'" />
      <ProfileCreate v-else-if="tab === 'profile-create'" />
      <template v-else>
        <Dashboard v-if="tab === 'dashboard'" />
        <Practice v-else-if="tab === 'practice'" />
        <Discover v-else-if="tab === 'discover'" />
        <Recap v-else-if="tab === 'recap'" />
        <Progress v-else-if="tab === 'progress'" />
      </template>
    </div>
  </div>
</template>