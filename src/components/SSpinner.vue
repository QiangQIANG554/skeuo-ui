<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: number
  color?: string
  text?: string
}>(), {
  size: 28,
  color: '',
  text: '',
})

defineOptions({ name: 'SSpinner' })

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...(props.color ? { borderTopColor: props.color } : {}),
}))
</script>

<template>
  <div class="s-spinner" role="status">
    <div class="s-spinner__ring" :style="style" />
    <span v-if="text" class="s-spinner__text">{{ text }}</span>
  </div>
</template>

<style scoped>
.s-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.s-spinner__ring {
  border-radius: 50%;
  border: 3px solid var(--s-bg-deep);
  border-top-color: var(--s-primary);
  box-shadow: var(--s-shadow-inset);
  animation: s-spinner-rotate 0.8s linear infinite;
}
.s-spinner__text {
  font-size: 13px;
  color: var(--s-ink-soft);
}
@keyframes s-spinner-rotate {
  to { transform: rotate(360deg); }
}
</style>
