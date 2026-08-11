<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  type?: NotificationType
  title?: string
  text?: string
  duration?: number
  closable?: boolean
  actionLabel?: string
}>(), {
  type: 'info',
  title: '',
  text: '',
  duration: 4500,
  closable: true,
  actionLabel: '',
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action'): void
}>()

defineOptions({ name: 'SNotification' })

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const icons: Record<NotificationType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

onMounted(() => {
  requestAnimationFrame(() => { visible.value = true })
  if (props.duration > 0) {
    timer = setTimeout(() => {
      visible.value = false
      leaveTimer = setTimeout(() => emit('close'), 250)
    }, props.duration)
  }
})

function onClose() {
  visible.value = false
  leaveTimer = setTimeout(() => emit('close'), 250)
}

defineExpose({ close: onClose })

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (leaveTimer) clearTimeout(leaveTimer)
})
</script>

<template>
  <Transition name="noti">
    <div v-show="visible" class="s-noti" :class="`s-noti--${type}`" role="status">
      <span class="s-noti__icon">{{ icons[type] }}</span>
      <div class="s-noti__body">
        <div class="s-noti__title">{{ title }}</div>
        <div class="s-noti__text">{{ text }}</div>
        <button v-if="actionLabel" class="s-noti__action" type="button" @click="emit('action')">{{ actionLabel }}</button>
      </div>
      <button v-if="closable" class="s-noti__close" type="button" aria-label="关闭" @click="onClose">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.s-noti {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 320px;
  max-width: calc(100vw - 40px);
  padding: 14px 16px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 10px 30px var(--s-sh-dark-strong);
  color: var(--s-ink);
  pointer-events: auto;
}
.s-noti__icon {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-top: 2px;
}
.s-noti--success .s-noti__icon { background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep)); }
.s-noti--error .s-noti__icon { background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep)); }
.s-noti--warning .s-noti__icon { background: linear-gradient(145deg, var(--s-gold), #8a6d2a); }
.s-noti--info .s-noti__icon { background: linear-gradient(145deg, var(--s-primary), var(--s-primary-deep)); }
.s-noti__body { flex: 1; min-width: 0; }
.s-noti__title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}
.s-noti__text {
  font-size: 13px;
  color: var(--s-ink-soft);
  line-height: 1.6;
  word-break: break-word;
}
.s-noti__close {
  flex: none;
  border: none;
  background: transparent;
  color: var(--s-ink-faint);
  font-size: 12px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}
.s-noti__close:hover { color: var(--s-danger); }
.s-noti__action {
  margin-top: 8px;
  border: none;
  border-radius: var(--s-r-sm);
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--s-font);
  cursor: pointer;
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 3px 3px 6px var(--s-sh-dark), -3px -3px 6px var(--s-sh-light);
}
.s-noti__action:active {
  background: var(--s-primary-deep);
  box-shadow: 3px 3px 6px var(--s-sh-dark) inset, -3px -3px 6px var(--s-sh-light) inset;
}

/* 从右下角滑入 */
.noti-enter-active,
.noti-leave-active {
  transition: all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.noti-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}
.noti-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}
</style>
