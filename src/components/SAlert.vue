<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  type?: 'success' | 'info' | 'warning' | 'error'
  title?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
}>(), {
  type: 'info',
  title: '',
  description: '',
  closable: false,
  showIcon: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineOptions({ name: 'SAlert' })

const visible = ref(true)

const icons: Record<string, string> = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '✕',
}

function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition name="alert">
    <div v-if="visible" class="s-alert" :class="`s-alert--${type}`" role="alert">
      <span v-if="showIcon" class="s-alert__icon">{{ icons[type] }}</span>
      <div class="s-alert__body">
        <div v-if="title" class="s-alert__title">{{ title }}</div>
        <div v-if="description" class="s-alert__desc">{{ description }}</div>
        <slot />
      </div>
      <button v-if="closable" class="s-alert__close" type="button" aria-label="关闭" @click="close">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.s-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-alert__icon {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  margin-top: 1px;
}
.s-alert--success .s-alert__icon { background: var(--s-success); }
.s-alert--info .s-alert__icon { background: var(--s-primary); }
.s-alert--warning .s-alert__icon { background: var(--s-warning); }
.s-alert--error .s-alert__icon { background: var(--s-danger); }
.s-alert__body { flex: 1; }
.s-alert__title { font-size: 13px; font-weight: 600; color: var(--s-ink); }
.s-alert__desc { font-size: 12px; color: var(--s-ink-soft); margin-top: 2px; line-height: 1.6; }
.s-alert__close {
  flex: none;
  border: none;
  background: transparent;
  color: var(--s-ink-faint);
  cursor: pointer;
  font-size: 12px;
  padding: 2px;
  line-height: 1;
}
.s-alert__close:hover { color: var(--s-ink); }

.alert-enter-active, .alert-leave-active { transition: opacity 0.25s, transform 0.25s; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
