<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  showIcon?: boolean
  icon?: string
}>(), {
  text: '',
  showIcon: true,
  icon: '⧉',
})

const emit = defineEmits<{
  (e: 'success', text: string): void
  (e: 'error'): void
}>()

defineOptions({ name: 'SCopy' })

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function copy() {
  const text = props.text
  if (!text) return
  let ok = false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      ok = true
    }
  } catch (e) {
    ok = false
  }
  if (!ok) {
    // 降级：临时 textarea + execCommand（用户手势下可用，兼容权限受限环境）
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      ok = document.execCommand('copy')
      document.body.removeChild(ta)
    } catch (e) {
      ok = false
    }
  }
  if (ok) {
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1600)
    emit('success', text)
  } else {
    emit('error')
  }
}
</script>

<template>
  <span
    class="s-copy"
    :class="{ 's-copy--copied': copied }"
    role="button"
    tabindex="0"
    :title="copied ? '已复制' : '点击复制'"
    @click="copy"
    @keydown.enter="copy"
  >
    <slot>{{ text }}</slot>
    <span v-if="showIcon" class="s-copy__icon">{{ copied ? '✓' : icon }}</span>
  </span>
</template>

<style scoped>
.s-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--s-ink);
  border-radius: var(--s-r-sm);
  padding: 2px 6px;
  transition: background 0.12s, color 0.12s;
  user-select: none;
  outline: none;
}
.s-copy:hover { background: var(--s-bg); }
.s-copy--copied { color: var(--s-success); }
.s-copy__icon {
  font-size: 12px;
  color: var(--s-ink-faint);
  flex: none;
  font-style: normal;
}
.s-copy--copied .s-copy__icon { color: var(--s-success); }
</style>
