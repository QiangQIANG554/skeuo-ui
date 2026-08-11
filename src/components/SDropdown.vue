<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface DropdownItem {
  label?: string
  value?: string | number
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

const props = withDefaults(defineProps<{
  items?: DropdownItem[]
  trigger?: 'click' | 'hover'
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  width?: number
  disabled?: boolean
}>(), {
  items: () => [],
  trigger: 'click',
  placement: 'bottom-start',
  width: 160,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'select', item: DropdownItem): void
}>()

defineOptions({ name: 'SDropdown' })

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function onEnter() {
  if (props.trigger === 'hover' && !props.disabled) open.value = true
}
function onLeave() {
  if (props.trigger === 'hover') open.value = false
}

function pick(item: DropdownItem) {
  if (item.disabled || item.divider) return
  emit('select', item)
  open.value = false
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-dropdown')
  if (!el && rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onOutside))
onBeforeUnmount(() => document.removeEventListener('click', onOutside))
</script>

<template>
  <div
    ref="rootEl"
    class="s-dropdown"
    :class="{ 's-dropdown--open': open, 's-dropdown--disabled': disabled }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div class="s-dropdown__trigger" @click="toggle">
      <slot name="trigger" />
      <slot />
    </div>
    <Transition name="dd">
      <div v-if="open" class="s-dropdown__menu" :class="`s-dropdown__menu--${placement}`" :style="{ minWidth: width + 'px' }">
        <template v-for="(item, i) in items" :key="i">
          <div v-if="item.divider" class="s-dropdown__divider" />
          <button
            v-else
            class="s-dropdown__item"
            :class="{
              's-dropdown__item--danger': item.danger,
              's-dropdown__item--disabled': item.disabled,
            }"
            type="button"
            :disabled="item.disabled"
            @click="pick(item)"
          >
            <span v-if="item.icon" class="s-dropdown__icon">{{ item.icon }}</span>
            <span class="s-dropdown__label">{{ item.label }}</span>
          </button>
        </template>
        <slot name="menu" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.s-dropdown { position: relative; display: inline-block; }
.s-dropdown--disabled { opacity: 0.5; pointer-events: none; }
.s-dropdown__trigger { cursor: pointer; display: inline-flex; }
.s-dropdown__menu {
  position: absolute;
  z-index: 1200;
  padding: 6px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 12px 32px var(--s-sh-dark-strong);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.s-dropdown__menu--bottom-start { top: calc(100% + 6px); left: 0; }
.s-dropdown__menu--bottom-end { top: calc(100% + 6px); right: 0; }
.s-dropdown__menu--top-start { bottom: calc(100% + 6px); left: 0; }
.s-dropdown__menu--top-end { bottom: calc(100% + 6px); right: 0; }
.s-dropdown__item {
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
  transition: background 0.12s, color 0.12s;
}
.s-dropdown__item:hover { background: var(--s-bg); }
.s-dropdown__item--danger { color: var(--s-danger); }
.s-dropdown__item--danger:hover { background: var(--s-bg); }
.s-dropdown__item--disabled { opacity: 0.45; cursor: not-allowed; }
.s-dropdown__icon { width: 16px; text-align: center; font-size: 13px; }
.s-dropdown__divider { height: 1px; background: var(--s-bg-deep); margin: 4px 8px; }

.dd-enter-active, .dd-leave-active { transition: opacity 0.18s, transform 0.18s; }
.dd-enter-from, .dd-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
