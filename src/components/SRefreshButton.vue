<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  spinning?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  title?: string
}>(), {
  spinning: false,
  size: 'md',
  disabled: false,
  title: '刷新',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

defineOptions({ name: 'SRefreshButton' })

// 内部自旋：点击后转一圈；外部也可用 spinning 控制常转
const spinning = ref(props.spinning)

function onClick() {
  if (props.disabled) return
  spinning.value = true
  emit('click')
  setTimeout(() => { spinning.value = false }, 600)
}
</script>

<template>
  <button
    class="s-refresh"
    :class="[`s-refresh--${size}`, { 's-refresh--spin': spinning }]"
    type="button"
    :disabled="disabled"
    :title="title"
    @click="onClick"
  >
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  </button>
</template>

<style scoped>
.s-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  cursor: pointer;
  transition: all 0.15s;
}
.s-refresh:hover { color: var(--s-ink); box-shadow: var(--s-shadow-raised); }
.s-refresh:active { box-shadow: var(--s-shadow-pressed); color: var(--s-ink); }
.s-refresh--sm { width: 26px; height: 26px; }
.s-refresh--lg { width: 40px; height: 40px; }
.s-refresh--lg svg { width: 18px; height: 18px; }
.s-refresh--spin svg { animation: s-refresh-rotate 0.6s ease; }
.s-refresh[disabled] { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
@keyframes s-refresh-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
