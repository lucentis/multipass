<!-- src/views/CreateProfileView.vue -->

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { AVATARS } from '@/constants/avatars'

import { useAppStore } from '@/stores/app.store'
import { useProfileStore } from '@/stores/profile.store'

const appStore = useAppStore()
const profileStore = useProfileStore()

const selectedAvatar = ref('🦊')
const profileName = ref('')

const canCreate = computed(
  () => profileName.value.trim().length >= 2,
)

function handleCreateProfile() {
  const profile =
    profileStore.createProfile(
      profileName.value.trim(),
      selectedAvatar.value,
    )

  profileStore.selectProfile(profile.id)

  appStore.navigate('dashboard')
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[#F6F7FB] p-4"
  >
    <div
      class="relative w-full max-w-[900px] overflow-hidden rounded-[40px] bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
    >
      <div
        class="absolute right-[-60px] top-[-40px] h-40 w-40 rounded-full bg-violet-100 blur-3xl opacity-50"
      />

      <div
        class="px-6 py-8 sm:px-10 sm:py-10"
      >
        <!-- Back -->
        <button
          @click="
            appStore.navigate(
              'profiles',
            )
          "
          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
        >
          <ArrowLeft
            class="h-5 w-5 text-slate-700"
          />
        </button>

        <div
          class="mt-4 text-center"
        >
          <!-- Avatar -->
          <div
            class="mx-auto flex h-36 w-36 items-center justify-center rounded-[32px] bg-violet-100 text-[80px]"
          >
            {{ selectedAvatar }}
          </div>

          <h1
            class="mt-6 text-4xl font-black text-slate-800"
          >
            Nouveau profil
          </h1>

          <p
            class="mt-2 text-slate-500"
          >
            Choisis un avatar et
            un prénom
          </p>
        </div>

        <div
          class="mx-auto mt-10 max-w-md"
        >
          <!-- Name -->
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Prénom
          </label>

          <Input
            v-model="profileName"
            placeholder="Ex: Léa"
            class="h-14 rounded-[20px] border-slate-200 bg-slate-50 px-5 text-base"
          />

          <!-- Avatars -->
          <div class="mt-8">
            <label
              class="mb-4 block text-sm font-semibold text-slate-700"
            >
              Choisis un avatar
            </label>

            <div
              class="grid grid-cols-4 gap-3"
            >
              <button
                v-for="avatar in AVATARS"
                :key="avatar"
                @click="
                  selectedAvatar =
                    avatar
                "
                class="flex h-16 w-16 items-center justify-center rounded-[22px] border bg-white text-3xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                :class="
                  selectedAvatar ===
                  avatar
                    ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-200'
                    : 'border-slate-100'
                "
              >
                {{ avatar }}
              </button>
            </div>
          </div>

          <!-- CTA -->
          <Button
            :disabled="!canCreate"
            @click="
              handleCreateProfile
            "
            class="mt-10 h-14 w-full rounded-[22px] bg-violet-500 text-base font-semibold hover:bg-violet-600"
          >
            Créer mon profil ✨
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>