<script setup lang="ts">
defineProps<{
  modelValue: string
  avatars: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div
    class="grid grid-cols-4 gap-4"
  >
    <button
      v-for="avatar in avatars"
      :key="avatar"
      type="button"
      @click="
        emit('update:modelValue', avatar)
      "
      class="flex aspect-square items-center justify-center rounded-[30px] bg-white text-5xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 active:scale-95"
      :class="
        modelValue === avatar
          ? 'scale-105 ring-4 ring-violet-200'
          : 'hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]'
      "
    >
      {{ avatar }}
    </button>
  </div>
</template>