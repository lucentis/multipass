<script setup lang="ts">
import { storeToRefs } from 'pinia'

import {
  Tabs,
  TabsContent,
  TabsList,
} from '@/components/ui/tabs'

import { useAppStore } from '@/stores/app.store'

import Dashboard from '@/views/Dashboard.vue'
import CreateProfile from '@/views/CreateProfile.vue'
import ProfileSelection from '@/views/ProfileSelection.vue'
import Practice from '@/views/Practice.vue'
import Recap from '@/views/Recap.vue'
import Discover from '@/views/Discover.vue'
import Progress from '@/views/Progress.vue'

const appStore = useAppStore()

const { currentScreen } =
  storeToRefs(appStore)
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <Tabs
      v-model="currentScreen"
    >
      <TabsList class="hidden" />

      <TabsContent
        value="profiles"
        class="m-0"
      >
        <ProfileSelection />
      </TabsContent>

      <TabsContent
        value="create-profile"
        class="m-0"
      >
        <CreateProfile />
      </TabsContent>

      <TabsContent
        value="dashboard"
        class="m-0"
      >
        <Dashboard />
      </TabsContent>

      <TabsContent
        value="practice"
        class="m-0"
      >
        <Practice />
      </TabsContent>

      <TabsContent
        value="recap"
        class="m-0"
      >
        <Recap />
      </TabsContent>

      <TabsContent
        value="discover"
        class="m-0"
      >
        <Discover />
      </TabsContent>

      <TabsContent
        value="progress"
        class="m-0"
      >
        <Progress />
      </TabsContent>

    </Tabs>
  </main>
</template>