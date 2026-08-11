<script setup lang="ts">
import { ref, computed } from 'vue'

export interface CascaderNode {
  label: string
  value: string | number
  children?: CascaderNode[]
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  options?: CascaderNode[]
  modelValue?: (string | number)[]
  placeholder?: string
  disabled?: boolean
}>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: '请选择',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: (string | number)[]): void
}>()

defineOptions({ name: 'SCascader' })

const open = ref(false)

// 当前各级展开的列表：[根级列表, 子级列表, ...]
const levels = computed(() => {
  const list: CascaderNode[][] = [props.options]
  let current = props.options
  for (let i = 0; i < props.modelValue.length; i++) {
    const found = current.find(n => n.value === props.modelValue[i])
    if (found?.children?.length) {
      list.push(found.children)
      current = found.children
    } else {
      break
    }
  }
  return list
})

const displayText = computed(() => {
  const parts: string[] = []
  let current: CascaderNode[] = props.options
  for (const v of props.modelValue) {
    const found = current.find(n => n.value === v)
    if (!found) break
    parts.push(found.label)
    current = found.children ?? []
  }
  return parts.join(' / ')
})

// 记录各级选中项的完整路径
function select(level: number, node: CascaderNode) {
  if (node.disabled) return
  const path = props.modelValue.slice(0, level)
  path.push(node.value)
  emit('update:modelValue', path)
  if (!node.children?.length) open.value = false
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-cascader')
  if (!el) open.value = false
}
document.addEventListener('click', onOutside)
</script>

<template>
  <div class="s-cascader" :class="{ 's-cascader--open': open }">
    <div class="s-cascader__trigger" :class="{ 's-cascader__trigger--disabled': disabled }" @click="!disabled && (open = !open)">
      <span :class="{ 's-cascader__val--empty': !displayText }">{{ displayText || placeholder }}</span>
      <span class="s-cascader__caret">▾</span>
    </div>

    <div v-if="open" class="s-cascader__panel" @click.stop>
      <div v-for="(list, level) in levels" :key="level" class="s-cascader__col">
        <div
          v-for="node in list"
          :key="node.value"
          class="s-cascader__node"
          :class="{
            's-cascader__node--active': props.modelValue[level] === node.value,
            's-cascader__node--disabled': node.disabled,
          }"
          @click="select(level, node)"
        >
          <span class="s-cascader__label">{{ node.label }}</span>
          <span v-if="node.children?.length" class="s-cascader__arrow">›</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-cascader { position: relative; display: inline-block; }
.s-cascader__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
  min-width: 180px;
  font-size: 13px;
  color: var(--s-ink);
  user-select: none;
  transition: box-shadow 0.15s;
}
.s-cascader__trigger:hover { box-shadow: var(--s-shadow-inset), 0 0 0 2px var(--s-primary-soft); }
.s-cascader__trigger--disabled { opacity: 0.5; cursor: not-allowed; }
.s-cascader__val--empty { color: var(--s-ink-faint); }
.s-cascader__caret { margin-left: auto; font-size: 11px; color: var(--s-ink-faint); }
.s-cascader__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1200;
  display: flex;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 12px 32px var(--s-sh-dark-strong);
  overflow: hidden;
}
.s-cascader__col {
  min-width: 140px;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-right: 1px solid var(--s-bg-deep);
}
.s-cascader__col:last-child { border-right: none; }
.s-cascader__node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--s-r-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--s-ink);
  transition: background 0.12s;
}
.s-cascader__node:hover { background: var(--s-bg); }
.s-cascader__node--active { background: var(--s-surface); box-shadow: var(--s-shadow-raised-sm); font-weight: 600; color: var(--s-primary); }
.s-cascader__node--disabled { opacity: 0.45; cursor: not-allowed; }
.s-cascader__arrow { color: var(--s-ink-faint); font-size: 14px; }
</style>
