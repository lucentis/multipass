<script setup lang="ts">
import { storeToRefs } from 'pinia'

import {
  Tabs,
  TabsContent,
  TabsList,
} from '@/components/ui/tabs'

import { useAppStore } from '@/stores/app.store'

import DashboardView from '@/views/Dashboard.vue'
import CreateProfileView from '@/views/CreateProfile.vue'
import ProfileSelectionView from '@/views/ProfileSelection.vue'

const appStore = useAppStore()

const { currentScreen } =
  storeToRefs(appStore)
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <Tabs
      v-model="currentScreen"
      class="min-h-screen"
    >
      <TabsList class="hidden" />

      <TabsContent
        value="profiles"
        class="m-0"
      >
        <ProfileSelectionView />
      </TabsContent>

      <TabsContent
        value="create-profile"
        class="m-0"
      >
        <CreateProfileView />
      </TabsContent>

      <TabsContent
        value="dashboard"
        class="m-0"
      >
        <DashboardView />
      </TabsContent>
    </Tabs>
  </main>
</template>