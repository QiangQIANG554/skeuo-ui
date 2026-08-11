<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  distance?: number     // 距底部多远触发
  disabled?: boolean
  loading?: boolean
  immediate?: boolean
}>(), {
  distance: 80,
  disabled: false,
  loading: false,
  immediate: true,
})

const emit = defineEmits<{
  (e: 'load'): void
}>()

defineOptions({ name: 'SInfiniteScroll' })

const el = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

function check() {
  const node = el.value
  if (!node || props.disabled || props.loading) return
  // 内容距底部小于 distance 就触发
  if (node.scrollHeight - node.scrollTop - node.clientHeight < props.distance) {
    emit('load')
  }
}

onMounted(() => {
  if (props.immediate) emit('load')
  ro = new ResizeObserver(() => check())
  if (el.value) ro.observe(el.value)
})

onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div ref="el" class="s-infinite" @scroll.passive="check">
    <slot />
    <div v-if="loading" class="s-infinite__loading">
      <span class="s-infinite__spinner" /> 加载中…
    </div>
    <div v-else-if="disabled" class="s-infinite__end">— 没有更多了 —</div>
  </div>
</template>

<style scoped>
.s-infinite {
  overflow-y: auto;
  position: relative;
}
.s-infinite__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-size: 12px;
  color: var(--s-ink-faint);
}
.s-infinite__spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--s-bg-deep);
  border-top-color: var(--s-primary);
  animation: s-inf-spin 0.8s linear infinite;
}
.s-infinite__end {
  text-align: center;
  padding: 14px;
  font-size: 12px;
  color: var(--s-ink-faint);
}
@keyframes s-inf-spin { to { transform: rotate(360deg); } }
</style>
