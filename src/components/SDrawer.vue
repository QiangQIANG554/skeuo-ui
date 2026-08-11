<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  width?: string
  placement?: 'left' | 'right'
  closable?: boolean
  maskClosable?: boolean
}>(), {
  modelValue: false,
  title: '',
  width: '360px',
  placement: 'right',
  closable: true,
  maskClosable: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

defineOptions({ name: 'SDrawer' })

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
      }, 220)
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
    <div v-if="visible" class="s-drawer" :class="`s-drawer--${placement}`">
      <div class="s-drawer__mask" :class="{ 's-drawer__mask--show': !animating }" @click="onMask" />
      <aside
        class="s-drawer__panel"
        :class="{ 's-drawer__panel--show': !animating }"
        :style="{ width }"
      >
        <div class="s-drawer__head">
          <div class="s-drawer__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="closable" class="s-drawer__x" type="button" aria-label="关闭" @click="close">✕</button>
        </div>
        <div class="s-drawer__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="s-drawer__footer">
          <slot name="footer" />
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.s-drawer {
  position: fixed;
  inset: 0;
  z-index: 1000;
}
.s-drawer__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s;
}
.s-drawer__mask--show { opacity: 1; }
.s-drawer__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), -8px 0 32px var(--s-sh-dark-strong);
  padding: var(--s-sp-5);
  transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
  color: var(--s-ink);
}
.s-drawer--right .s-drawer__panel {
  right: 0;
  border-radius: var(--s-r-lg) 0 0 var(--s-r-lg);
  transform: translateX(100%);
}
.s-drawer--left .s-drawer__panel {
  left: 0;
  border-radius: 0 var(--s-r-lg) var(--s-r-lg) 0;
  transform: translateX(-100%);
}
.s-drawer__panel--show { transform: translateX(0) !important; }
.s-drawer__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--s-sp-4);
  padding-bottom: var(--s-sp-3);
  border-bottom: 1px solid var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
}
.s-drawer__title {
  font-family: var(--s-font-serif);
  font-size: 17px;
  font-weight: 700;
}
.s-drawer__x {
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
.s-drawer__x:active { box-shadow: var(--s-shadow-pressed); }
.s-drawer__x:hover { color: var(--s-danger); }
.s-drawer__body {
  flex: 1;
  overflow: auto;
  font-size: 14px;
  line-height: 1.7;
}
.s-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-sp-3);
  margin-top: var(--s-sp-4);
  padding-top: var(--s-sp-3);
  border-top: 1px solid var(--s-bg-deep);
  box-shadow: 0 -1px 0 var(--s-sh-light);
}
</style>
