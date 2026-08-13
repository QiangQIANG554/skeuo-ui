<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface ContextMenuItem {
  label?: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
  onClick?: () => void
}

const emit = defineEmits<{
  (e: 'select', item: ContextMenuItem): void
}>()

const props = withDefaults(defineProps<{
  items?: ContextMenuItem[]
}>(), {
  items: () => [],
})

defineOptions({ name: 'SContextMenu' })

const visible = ref(false)
const x = ref(0)
const y = ref(0)
const menuEl = ref<HTMLElement | null>(null)

function open(e: MouseEvent) {
  e.preventDefault()
  // 避免超出视口
  const menuW = 180
  const menuH = props.items.length * 36 + 12
  x.value = Math.min(e.clientX, window.innerWidth - menuW - 8)
  y.value = Math.min(e.clientY, window.innerHeight - menuH - 8)
  visible.value = true
}

function close() {
  visible.value = false
}

function pick(item: ContextMenuItem) {
  if (item.disabled || item.divider) return
  close()
  item.onClick?.()
  emit('select', item)
}

function onGlobal(e: MouseEvent) {
  if (visible.value && menuEl.value && !menuEl.value.contains(e.target as Node)) close()
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onGlobal)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('scroll', close, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onGlobal)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('scroll', close, true)
})

defineExpose({ open })
</script>

<template>
  <div class="s-ctx" @contextmenu="open">
    <slot />
  </div>
  <Teleport to="body">
    <Transition name="ctx">
      <div v-if="visible" ref="menuEl" class="s-ctx__menu" :style="{ left: x + 'px', top: y + 'px' }">
        <template v-for="(item, i) in items" :key="i">
          <div v-if="item.divider" class="s-ctx__divider" />
          <button
            v-else
            class="s-ctx__item"
            :class="{
              's-ctx__item--danger': item.danger,
              's-ctx__item--disabled': item.disabled,
            }"
            type="button"
            :disabled="item.disabled"
            @click="pick(item)"
          >
            <span v-if="item.icon" class="s-ctx__icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.s-ctx { display: inline-block; }
.s-ctx__menu {
  position: fixed;
  z-index: 3000;
  min-width: 180px;
  padding: 6px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 12px 32px var(--s-sh-dark-strong);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.s-ctx__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--s-r-sm);
  background: transparent;
  font-size: 13px;
  color: var(--s-ink);
  cursor: pointer;
  text-align: left;
  font-family: var(--s-font);
  transition: background 0.12s;
}
.s-ctx__item:hover { background: var(--s-bg); }
.s-ctx__item--danger { color: var(--s-danger); }
.s-ctx__item--disabled { opacity: 0.45; cursor: not-allowed; }
.s-ctx__icon { width: 16px; text-align: center; font-size: 13px; }
.s-ctx__divider { height: 1px; background: var(--s-bg-deep); margin: 4px 8px; }

.ctx-enter-active, .ctx-leave-active { transition: opacity 0.15s, transform 0.15s; }
.ctx-enter-from, .ctx-leave-to { opacity: 0; transform: scale(0.96); }
</style>
