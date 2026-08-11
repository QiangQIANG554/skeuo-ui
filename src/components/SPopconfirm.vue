<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(defineProps<{
  title?: string
  confirmText?: string
  cancelText?: string
  placement?: Placement
  okType?: 'primary' | 'danger'
}>(), {
  title: '确定执行此操作吗？',
  confirmText: '确定',
  cancelText: '取消',
  placement: 'top',
  okType: 'primary',
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

defineOptions({ name: 'SPopconfirm' })

const wrapEl = ref<HTMLElement | null>(null)
const popEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const pos = ref({ top: 0, left: 0 })
const GAP = 10

function position() {
  if (!wrapEl.value || !popEl.value) return
  const t = wrapEl.value.getBoundingClientRect()
  const p = popEl.value.getBoundingClientRect()
  let top = 0
  let left = 0
  switch (props.placement) {
    case 'top':
      top = t.top - p.height - GAP + window.scrollY
      left = t.left + t.width / 2 - p.width / 2 + window.scrollX
      break
    case 'bottom':
      top = t.bottom + GAP + window.scrollY
      left = t.left + t.width / 2 - p.width / 2 + window.scrollX
      break
    case 'left':
      top = t.top + t.height / 2 - p.height / 2 + window.scrollY
      left = t.left - p.width - GAP + window.scrollX
      break
    case 'right':
      top = t.top + t.height / 2 - p.height / 2 + window.scrollY
      left = t.right + GAP + window.scrollX
      break
  }
  pos.value = { top, left }
}

function open() {
  visible.value = true
  requestAnimationFrame(() => position())
}

function close() {
  visible.value = false
}

function onConfirm() {
  emit('confirm')
  close()
}
function onCancel() {
  emit('cancel')
  close()
}

function onOutside(e: MouseEvent) {
  if (visible.value && wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
    close()
  }
}
function onScrollOrResize() {
  if (visible.value) position()
}

onMounted(() => {
  document.addEventListener('click', onOutside)
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onOutside)
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<template>
  <span ref="wrapEl" class="s-popconfirm" @click="visible ? close() : open()">
    <slot />
    <Teleport to="body">
      <Transition name="pop">
        <div
          v-if="visible"
          ref="popEl"
          class="s-popconfirm__pop"
          :class="`s-popconfirm__pop--${placement}`"
          :style="{ top: pos.top + 'px', left: pos.left + 'px' }"
          role="dialog"
          @click.stop
        >
          <div class="s-popconfirm__title">{{ title }}</div>
          <div class="s-popconfirm__actions">
            <button class="s-popconfirm__btn" type="button" @click="onCancel">{{ cancelText }}</button>
            <button
              class="s-popconfirm__btn s-popconfirm__btn--ok"
              :class="okType === 'danger' ? 's-popconfirm__btn--danger' : ''"
              type="button"
              @click="onConfirm"
            >{{ confirmText }}</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.s-popconfirm {
  display: inline-flex;
  cursor: pointer;
}
.s-popconfirm__pop {
  position: absolute;
  z-index: 2000;
  min-width: 180px;
  max-width: 280px;
  padding: 14px 16px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 8px 24px var(--s-sh-dark-strong);
  color: var(--s-ink);
}
.s-popconfirm__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 12px;
}
.s-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.s-popconfirm__btn {
  font-family: var(--s-font);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--s-r-sm);
  border: none;
  cursor: pointer;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  transition: all 0.12s;
}
.s-popconfirm__btn:active {
  box-shadow: var(--s-shadow-pressed);
  color: var(--s-ink);
}
.s-popconfirm__btn--ok {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light);
}
.s-popconfirm__btn--ok:active {
  background: var(--s-primary-deep);
  box-shadow: 3px 3px 6px var(--s-sh-dark) inset, -3px -3px 6px var(--s-sh-light) inset;
  color: #fff;
}
.s-popconfirm__btn--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  color: #fff8f7;
}
.s-popconfirm__btn--danger:active {
  background: var(--s-danger-deep);
  color: #fff;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.18s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(4px);
}
</style>
