<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { useAppStore } from '@/stores/app.store'
import { useProfilesStore } from '@/stores/profiles.store'
import { useProgressStore } from '@/stores/progress.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const appStore = useAppStore()
const profilesStore = useProfilesStore()
const progressStore = useProgressStore()

const AVATARS = [
  '🦊', '🐸', '🐼', '🐨', '🦁', '🐯',
  '🐶', '🐱', '🐰', '🦆', '🐧', '🐻',
  '🐮', '🐷', '🐹', '🦉', '🐺', '🦊',
]

// Dropdown
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
onClickOutside(menuRef, () => { menuOpen.value = false })

// Edit dialog
const editOpen = ref(false)
const editName = ref('')
const editAvatar = ref('')
const editNameError = ref(false)

function openEdit(): void {
  menuOpen.value = false
  const p = profilesStore.activeProfile
  if (!p) return
  editName.value = p.name
  editAvatar.value = p.avatar
  editNameError.value = false
  editOpen.value = true
}

function saveEdit(): void {
  if (!editName.value.trim()) {
    editNameError.value = true
    return
  }
  profilesStore.update(profilesStore.activeProfileId!, {
    name: editName.value.trim(),
    avatar: editAvatar.value,
  })
  editOpen.value = false
}

// Reset dialog
const resetOpen = ref(false)

function openReset(): void {
  menuOpen.value = false
  resetOpen.value = true
}

function confirmReset(): void {
  progressStore.resetProfile(profilesStore.activeProfileId!)
  resetOpen.value = false
}

// Delete dialog
const deleteOpen = ref(false)

function openDelete(): void {
  menuOpen.value = false
  deleteOpen.value = true
}

function confirmDelete(): void {
  const id = profilesStore.activeProfileId!
  deleteOpen.value = false
  appStore.navigate('profiles')
  progressStore.removeProfile(id)
  profilesStore.remove(id)
}
</script>

<template>
  <!-- Trigger + dropdown wrapper -->
  <div ref="menuRef" class="relative">
    <button
      @click="menuOpen = !menuOpen"
      class="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-muted"
    >
      <span class="text-3xl leading-none">{{ profilesStore.activeProfile?.avatar }}</span>
      <div class="text-left">
        <p class="text-xl font-bold leading-none text-amber-800 mb-1.5">
          {{ profilesStore.activeProfile?.name }}
        </p>
      </div>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="menuOpen"
      class="absolute left-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-md"
    >
      <button
        @click="appStore.navigate('profiles')"
        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
      >
        <span class="text-base">
          👥
        </span>

        <span>
          Profiles
        </span>
      </button>
      <button
        @click="openEdit"
        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
      >
        ✏️ Modifier le profil
      </button>
      <button
        @click="openReset"
        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
      >
        🔄 Recommencer les tables
      </button>
      <div class="my-1 border-t border-border" />
      <button
        @click="openDelete"
        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-muted"
      >
        🗑️ Supprimer le profil
      </button>
    </div>
  </div>

  <!-- Edit dialog -->
  <Dialog v-model:open="editOpen">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Modifier le profil</DialogTitle>
        <DialogDescription>Change ton animal ou ton prénom</DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-5 pt-2">
        <div class="text-center">
          <span class="text-5xl leading-none">{{ editAvatar }}</span>
        </div>
        <div>
          <p class="mb-2 text-xs text-muted-foreground">Ton animal</p>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="emoji in AVATARS"
              :key="emoji"
              @click="editAvatar = emoji"
              :class="[
                'rounded-xl border py-1.5 text-2xl transition-colors',
                editAvatar === emoji
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-transparent hover:bg-muted',
              ]"
            >{{ emoji }}</button>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs text-muted-foreground">Ton prénom</p>
          <input
            v-model="editName"
            type="text"
            :class="[
              'w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors',
              'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
              editNameError ? 'border-red-400' : 'border-border',
            ]"
            @input="editNameError = false"
            @keyup.enter="saveEdit"
          />
          <p v-if="editNameError" class="mt-1.5 text-xs text-red-500">
            Écris ton prénom d'abord !
          </p>
        </div>
      </div>
      <DialogFooter class="gap-2 pt-2">
        <button
          @click="editOpen = false"
          class="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Annuler
        </button>
        <button
          @click="saveEdit"
          class="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Enregistrer
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Reset confirm dialog -->
  <Dialog v-model:open="resetOpen">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Recommencer les tables ?</DialogTitle>
        <DialogDescription>
          Toute la progression de {{ profilesStore.activeProfile?.name }} sera effacée.
          Les étoiles et les tables débloquées repartiront à zéro.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2 pt-2">
        <button
          @click="resetOpen = false"
          class="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Annuler
        </button>
        <button
          @click="confirmReset"
          class="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Recommencer
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete confirm dialog -->
  <Dialog v-model:open="deleteOpen">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Supprimer le profil ?</DialogTitle>
        <DialogDescription>
          Le profil de {{ profilesStore.activeProfile?.name }} et toute sa progression
          seront définitivement supprimés.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2 pt-2">
        <button
          @click="deleteOpen = false"
          class="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Annuler
        </button>
        <button
          @click="confirmDelete"
          class="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Supprimer
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>