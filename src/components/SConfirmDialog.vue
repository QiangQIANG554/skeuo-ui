<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  text?: string
  confirmText?: string
  cancelText?: string
  okType?: 'primary' | 'danger'
  static?: boolean     // 静态展示模式：不 Teleport、不锁滚动、无全屏遮罩
}>(), {
  title: '操作确认',
  text: '',
  confirmText: '确定',
  cancelText: '取消',
  okType: 'primary',
  static: false,
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

defineOptions({ name: 'SConfirmDialog' })

const animating = ref(true)

onMounted(async () => {
  if (props.static) return
  await nextTick()
  requestAnimationFrame(() => {
    document.body.style.overflow = 'hidden'
    animating.value = false
  })
})

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }

onBeforeUnmount(() => {
  if (!props.static) document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="static" class="s-confirm s-confirm--static s-confirm--show">
    <div class="s-confirm__dialog" role="alertdialog" aria-modal="true">
      <div class="s-confirm__icon" :class="`s-confirm__icon--${okType}`">?</div>
      <div class="s-confirm__title">{{ title }}</div>
      <div v-if="text" class="s-confirm__text">{{ text }}</div>
      <div class="s-confirm__actions">
        <button class="s-confirm__btn" type="button" @click="onCancel">{{ cancelText }}</button>
        <button
          class="s-confirm__btn s-confirm__btn--ok"
          :class="okType === 'danger' ? 's-confirm__btn--danger' : ''"
          type="button"
          @click="onConfirm"
        >{{ confirmText }}</button>
      </div>
    </div>
  </div>
  <Teleport v-else to="body">
    <div class="s-confirm" :class="{ 's-confirm--show': !animating }">
      <div class="s-confirm__mask" @click="onCancel" />
      <div class="s-confirm__dialog" role="alertdialog" aria-modal="true">
        <div class="s-confirm__icon" :class="`s-confirm__icon--${okType}`">?</div>
        <div class="s-confirm__title">{{ title }}</div>
        <div v-if="text" class="s-confirm__text">{{ text }}</div>
        <div class="s-confirm__actions">
          <button class="s-confirm__btn" type="button" @click="onCancel">{{ cancelText }}</button>
          <button
            class="s-confirm__btn s-confirm__btn--ok"
            :class="okType === 'danger' ? 's-confirm__btn--danger' : ''"
            type="button"
            @click="onConfirm"
          >{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.s-confirm {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;  justify-content: center;
}
.s-confirm--static {
  position: relative;
  inset: auto;
  z-index: auto;
  pointer-events: auto;
}
.s-confirm--static .s-confirm__dialog {
  width: 100%;
  max-width: 360px;
  box-shadow: var(--s-shadow-raised), 0 10px 30px var(--s-sh-dark-strong);
}
.s-confirm__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.15s;
}
.s-confirm--show .s-confirm__mask { opacity: 1; }
.s-confirm__dialog {
  position: relative;
  width: 360px;
  max-width: calc(100vw - 40px);
  padding: var(--s-sp-5);
  border-radius: var(--s-r-lg);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 16px 40px var(--s-sh-dark-strong);
  color: var(--s-ink);
  text-align: center;
  transform: translateY(12px) scale(0.96);
  opacity: 0;
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.s-confirm--show .s-confirm__dialog {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.s-confirm__icon {
  width: 52px;
  height: 52px;
  margin: 0 auto var(--s-sp-3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}
.s-confirm__icon--primary {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light);
}
.s-confirm__icon--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light);
}
.s-confirm__title {
  font-family: var(--s-font-serif);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: var(--s-sp-2);
}
.s-confirm__text {
  font-size: 14px;
  color: var(--s-ink-soft);
  line-height: 1.7;
  margin-bottom: var(--s-sp-5);
}
.s-confirm__actions {
  display: flex;
  justify-content: center;
  gap: var(--s-sp-3);
}
.s-confirm__btn {
  min-width: 96px;
  padding: 9px 20px;
  border: none;
  border-radius: var(--s-r-sm);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--s-font);
  cursor: pointer;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  transition: all 0.12s;
}
.s-confirm__btn:active { box-shadow: var(--s-shadow-pressed); color: var(--s-ink); }
.s-confirm__btn--ok {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light);
}
.s-confirm__btn--ok:active {
  background: var(--s-primary-deep);
  box-shadow: 3px 3px 6px var(--s-sh-dark) inset, -3px -3px 6px var(--s-sh-light) inset;
  color: #fff;
}
.s-confirm__btn--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  color: #fff8f7;
}
.s-confirm__btn--danger:active {
  background: var(--s-danger-deep);
  color: #fff;
}
</style>
