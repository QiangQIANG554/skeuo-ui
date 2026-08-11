<script setup lang="ts">
import { computed } from 'vue'

type TagType = 'default' | 'primary' | 'accent' | 'danger' | 'gold'

const props = withDefaults(defineProps<{
  type?: TagType
  closable?: boolean
}>(), {
  type: 'default',
  closable: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineOptions({ name: 'STag' })

const classes = computed(() => [`s-tag`, `s-tag--${props.type}`])
</script>

<template>
  <span class="s-tag" :class="classes">
    <slot />
    <button
      v-if="closable"
      class="s-tag__close"
      type="button"
      aria-label="关闭"
      @click="emit('close')"
    >✕</button>
  </span>
</template>

<style scoped>
.s-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--s-r-pill);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  line-height: 1.5;
}
.s-tag--primary {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
}
.s-tag--accent {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
  color: #f2faf9;
}
.s-tag--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  color: #fff8f7;
}
.s-tag--gold {
  background: linear-gradient(145deg, var(--s-gold), #8a6d2a);
  color: #fff8e8;
}
.s-tag__close {
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  padding: 0 0 0 2px;
}
.s-tag__close:hover { opacity: 1; }
</style>
