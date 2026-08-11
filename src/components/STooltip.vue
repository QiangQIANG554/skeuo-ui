<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(defineProps<{
  content?: string
  placement?: Placement
  disabled?: boolean
}>(), {
  content: '',
  placement: 'top',
  disabled: false,
})

defineOptions({ name: 'STooltip' })

const triggerEl = ref<HTMLElement | null>(null)
const tipEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const pos = ref({ top: 0, left: 0 })
const showTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const hideTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function position() {
  if (!triggerEl.value || !tipEl.value) return
  const t = triggerEl.value.getBoundingClientRect()
  const p = tipEl.value.getBoundingClientRect()
  const gap = 10
  let top = 0
  let left = 0

  switch (props.placement) {
    case 'top':
      top = t.top - p.height - gap + window.scrollY
      left = t.left + t.width / 2 - p.width / 2 + window.scrollX
      break
    case 'bottom':
      top = t.bottom + gap + window.scrollY
      left = t.left + t.width / 2 - p.width / 2 + window.scrollX
      break
    case 'left':
      top = t.top + t.height / 2 - p.height / 2 + window.scrollY
      left = t.left - p.width - gap + window.scrollX
      break
    case 'right':
      top = t.top + t.height / 2 - p.height / 2 + window.scrollY
      left = t.right + gap + window.scrollX
      break
  }
  pos.value = { top, left }
}

function show() {
  if (props.disabled || !props.content) return
  showTimer.value = setTimeout(() => {
    visible.value = true
    requestAnimationFrame(() => position())
  }, 80)
}

function hide() {
  if (hideTimer.value) clearTimeout(hideTimer.value)
  hideTimer.value = setTimeout(() => { visible.value = false }, 60)
}

function onScrollOrResize() {
  if (visible.value) position()
}

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  if (showTimer.value) clearTimeout(showTimer.value)
  if (hideTimer.value) clearTimeout(hideTimer.value)
})
</script>

<template>
  <span class="s-tooltip" ref="triggerEl" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Teleport to="body">
      <Transition name="tip">
        <div
          v-if="visible"
          ref="tipEl"
          class="s-tooltip__bubble"
          :class="`s-tooltip__bubble--${placement}`"
          :style="{ top: pos.top + 'px', left: pos.left + 'px' }"
          role="tooltip"
        >
          {{ content }}
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.s-tooltip {
  display: inline-flex;
  cursor: help;
}
.s-tooltip__bubble {
  position: absolute;
  z-index: 2000;
  max-width: 260px;
  padding: 7px 12px;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm), 0 4px 12px var(--s-sh-dark-strong);
  color: var(--s-ink);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  pointer-events: none;
  white-space: normal;
}

/* 过渡 */
.tip-enter-active,
.tip-leave-active {
  transition: all 0.16s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(3px);
}
</style>
