<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  element?: string       // 全屏目标选择器，默认组件自身
  teleported?: boolean   // 是否 teleport 到 body
}>(), {
  element: '',
  teleported: false,
})

defineOptions({ name: 'SFullScreen' })

const fullscreen = ref(false)
const el = ref<HTMLElement | null>(null)

function getTarget(): HTMLElement {
  return (props.element ? document.querySelector(props.element) : el.value) as HTMLElement
}

async function toggle() {
  const target = getTarget()
  if (!target) return
  if (!document.fullscreenElement) {
    await target.requestFullscreen?.()
  } else {
    await document.exitFullscreen?.()
  }
}

function onFsChange() {
  fullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFsChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFsChange)
  if (document.fullscreenElement) document.exitFullscreen?.()
})
</script>

<template>
  <div ref="el" class="s-fullscreen" :class="{ 's-fullscreen--active': fullscreen }">
    <slot />
    <button
      class="s-fullscreen__btn"
      type="button"
      :title="fullscreen ? '退出全屏' : '全屏'"
      @click="toggle"
    >
      <span class="s-fullscreen__icon">{{ fullscreen ? '⤡' : '⤢' }}</span>
    </button>
  </div>
</template>

<style scoped>
.s-fullscreen { position: relative; }
.s-fullscreen--active {
  background: var(--s-bg);
}
.s-fullscreen__btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: var(--s-font);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 5;
}
.s-fullscreen:hover .s-fullscreen__btn { opacity: 1; }
.s-fullscreen__btn:hover { color: var(--s-primary); }
</style>
