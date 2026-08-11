<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  width?: string
  closable?: boolean
  maskClosable?: boolean
  appendToBody?: boolean
}>(), {
  modelValue: false,
  title: '',
  width: '480px',
  closable: true,
  maskClosable: true,
  appendToBody: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

defineOptions({ name: 'SModal' })

const visible = ref(props.modelValue)
const animating = ref(false)

watch(
  () => props.modelValue,
  async (v) => {
    if (v) {
      animating.value = true
      visible.value = true
      await nextTick()
      requestAnimationFrame(() => {
        document.body.style.overflow = 'hidden'
        animating.value = false
      })
      emit('open')
    } else {
      animating.value = true
      setTimeout(() => {
        visible.value = false
        animating.value = false
        document.body.style.overflow = ''
      }, 160)
      emit('close')
    }
  },
)

function close() {
  emit('update:modelValue', false)
}
function onMask() {
  if (props.maskClosable) close()
}

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="s-modal" :class="{ 's-modal--show': !animating }">
      <div class="s-modal__mask" @click="onMask" />
      <div class="s-modal__dialog" :style="{ width }" role="dialog" aria-modal="true">
        <div class="s-modal__head">
          <div class="s-modal__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="closable" class="s-modal__x" type="button" aria-label="关闭" @click="close">✕</button>
        </div>
        <div class="s-modal__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="s-modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.s-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-modal__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.15s;
}
.s-modal--show .s-modal__mask { opacity: 1; }
.s-modal__dialog {
  position: relative;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 80px);
  overflow: auto;
  background: var(--s-surface);
  border-radius: var(--s-r-lg);
  box-shadow: var(--s-shadow-raised), 0 16px 40px var(--s-sh-dark-strong);
  padding: var(--s-sp-5);
  color: var(--s-ink);
  transform: translateY(12px) scale(0.97);
  opacity: 0;
  transition: transform 0.16s ease, opacity 0.16s ease;
}
.s-modal--show .s-modal__dialog {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.s-modal__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--s-sp-3);
}
.s-modal__title {
  font-family: var(--s-font-serif);
  font-size: 17px;
  font-weight: 700;
}
.s-modal__x {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  cursor: pointer;
  color: var(--s-ink-soft);
  font-size: 13px;
  line-height: 1;
  font-family: var(--s-font);
}
.s-modal__x:active { box-shadow: var(--s-shadow-pressed); }
.s-modal__x:hover { color: var(--s-danger); }
.s-modal__body { font-size: 14px; line-height: 1.7; }
.s-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-sp-3);
  margin-top: var(--s-sp-5);
}
</style>
