<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  visibilityHeight?: number
  bottom?: number
  right?: number
}>(), {
  visibilityHeight: 400,
  bottom: 48,
  right: 48,
})

defineOptions({ name: 'SBackTop' })

const visible = ref(false)
const el = ref<HTMLElement | null>(null)

function onScroll() {
  visible.value = (el.value?.scrollTop ?? window.scrollY) > props.visibilityHeight
}

function scrollToTop() {
  const scroller = el.value
  if (scroller) {
    scroller.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  // 默认监听 window；若设置了 target（通过 el ref 由父级指定）则监听它
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Transition name="backtop">
    <button
      v-if="visible"
      class="s-backtop"
      type="button"
      :style="{ bottom: bottom + 'px', right: right + 'px' }"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <span class="s-backtop__arrow">↑</span>
      <slot />
    </button>
  </Transition>
</template>

<style scoped>
.s-backtop {
  position: fixed;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  font-family: var(--s-font);
  transition: box-shadow 0.15s;
}
.s-backtop:hover { box-shadow: var(--s-shadow-raised), 0 6px 18px var(--s-sh-dark-strong); }
.s-backtop:active { box-shadow: var(--s-shadow-pressed); }
.s-backtop__arrow { font-size: 18px; color: var(--s-primary); font-weight: 700; }

.backtop-enter-active, .backtop-leave-active { transition: opacity 0.25s, transform 0.25s; }
.backtop-enter-from, .backtop-leave-to { opacity: 0; transform: translateY(12px); }
</style>
