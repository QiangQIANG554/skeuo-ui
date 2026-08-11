<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export type MessageType = 'success' | 'error' | 'warning' | 'info'
export type MessagePlacement = 'top' | 'top-right' | 'bottom-right'

const props = withDefaults(defineProps<{
  type?: MessageType
  text?: string
  duration?: number
  placement?: MessagePlacement
}>(), {
  type: 'info',
  text: '',
  duration: 2500,
  placement: 'top',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineOptions({ name: 'SMessage' })

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const icons: Record<MessageType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

onMounted(() => {
  requestAnimationFrame(() => { visible.value = true })
  // duration <= 0 表示常驻不自动关闭（静态展示用）
  if (props.duration <= 0) return
  timer = setTimeout(() => {
    visible.value = false
    leaveTimer = setTimeout(() => emit('close'), 200)
  }, props.duration)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (leaveTimer) clearTimeout(leaveTimer)
})
</script>

<template>
  <Transition name="msg">
    <div v-show="visible" class="s-msg" :class="[`s-msg--${type}`, `s-msg--${placement}`]" role="status">
      <span class="s-msg__icon">{{ icons[type] }}</span>
      <span class="s-msg__text">{{ text }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.s-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 8px 24px var(--s-sh-dark-strong);
  color: var(--s-ink);
  font-size: 14px;
  font-weight: 500;
  pointer-events: auto;
  min-width: 220px;
  justify-content: center;
}
.s-msg__icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex: none;
}
.s-msg--success .s-msg__icon {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
  box-shadow: 0 0 8px color-mix(in srgb, var(--s-accent) 45%, transparent);
}
.s-msg--error .s-msg__icon {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  box-shadow: 0 0 8px color-mix(in srgb, var(--s-danger) 45%, transparent);
}
.s-msg--warning .s-msg__icon {
  background: linear-gradient(145deg, var(--s-gold), #8a6d2a);
  box-shadow: 0 0 8px color-mix(in srgb, var(--s-gold) 45%, transparent);
}
.s-msg--info .s-msg__icon {
  background: linear-gradient(145deg, var(--s-primary), var(--s-primary-deep));
  box-shadow: 0 0 8px color-mix(in srgb, var(--s-primary) 45%, transparent);
}

/* 位置：顶部居中 / 右上 / 右下 */
.s-msg--top-right { align-self: flex-end; margin-right: 20px; }
.s-msg--bottom-right { align-self: flex-end; margin-right: 20px; }

/* 弹出动画：从顶部滑入 + 凸起 */
.msg-enter-active,
.msg-leave-active {
  transition: all 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.94);
}
.msg-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
}
</style>
