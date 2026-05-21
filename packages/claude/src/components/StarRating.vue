<script setup lang="ts">
defineProps({
  stars: { type: Number, required: true }, // 0–3
  size: { type: String, default: 'sm' },   // sm | md | lg
})
</script>

<template>
  <div class="flex items-center gap-0.5">
    <span
      v-for="i in 3"
      :key="i"
      :class="[
        'transition-colors',
        size === 'sm' && 'text-[10px]',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-2xl',
        i <= stars ? 'text-amber-400' : 'text-border',
      ]"
    >★</span>
  </div>
</template>