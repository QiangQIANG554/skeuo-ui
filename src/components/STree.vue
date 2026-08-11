<script setup lang="ts">
import { ref } from 'vue'

export interface TreeNode {
  label: string
  value: string | number
  children?: TreeNode[]
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<{
  data?: TreeNode[]
  defaultExpandAll?: boolean
  expandKeys?: (string | number)[]
}>(), {
  data: () => [],
  defaultExpandAll: false,
  expandKeys: () => [],
})

const emit = defineEmits<{
  (e: 'update:expandKeys', keys: (string | number)[]): void
  (e: 'select', node: TreeNode): void
}>()

defineOptions({ name: 'STree' })

const expanded = ref<(string | number)[]>(props.expandKeys.length ? [...props.expandKeys] : (props.defaultExpandAll ? allKeys(props.data) : []))

function allKeys(nodes: TreeNode[]): (string | number)[] {
  const keys: (string | number)[] = []
  for (const n of nodes) {
    keys.push(n.value)
    if (n.children) keys.push(...allKeys(n.children))
  }
  return keys
}

const selectedKey = ref<string | number | null>(null)

function toggle(node: TreeNode) {
  if (!node.children?.length) {
    selectedKey.value = node.value
    emit('select', node)
    return
  }
  const i = expanded.value.indexOf(node.value)
  if (i >= 0) {
    expanded.value.splice(i, 1)
  } else {
    expanded.value.push(node.value)
  }
  emit('update:expandKeys', [...expanded.value])
}

function isOpen(node: TreeNode) {
  return expanded.value.includes(node.value)
}
</script>

<template>
  <ul class="s-tree">
    <li v-for="node in data" :key="node.value" class="s-tree__item">
      <div
        class="s-tree__row"
        :class="{
          's-tree__row--selected': selectedKey === node.value,
          's-tree__row--disabled': node.disabled,
        }"
        :style="{ paddingLeft: '0px' }"
        @click="!node.disabled && toggle(node)"
      >
        <span class="s-tree__arrow" :class="{ 's-tree__arrow--open': isOpen(node), 's-tree__arrow--leaf': !node.children?.length }">
          {{ node.children?.length ? '▸' : '' }}
        </span>
        <span v-if="node.icon" class="s-tree__icon">{{ node.icon }}</span>
        <span class="s-tree__label">{{ node.label }}</span>
      </div>
      <ul v-if="node.children?.length && isOpen(node)" class="s-tree__children">
        <li v-for="child in node.children" :key="child.value" class="s-tree__item">
          <div
            class="s-tree__row"
            :class="{
              's-tree__row--selected': selectedKey === child.value,
              's-tree__row--disabled': child.disabled,
            }"
            @click="!child.disabled && toggle(child)"
          >
            <span class="s-tree__arrow" :class="{ 's-tree__arrow--open': isOpen(child), 's-tree__arrow--leaf': !child.children?.length }">
              {{ child.children?.length ? '▸' : '' }}
            </span>
            <span v-if="child.icon" class="s-tree__icon">{{ child.icon }}</span>
            <span class="s-tree__label">{{ child.label }}</span>
          </div>
          <ul v-if="child.children?.length && isOpen(child)" class="s-tree__children">
            <li v-for="grand in child.children" :key="grand.value" class="s-tree__item">
              <div
                class="s-tree__row"
                :class="{ 's-tree__row--selected': selectedKey === grand.value, 's-tree__row--disabled': grand.disabled }"
                @click="!grand.disabled && toggle(grand)"
              >
                <span class="s-tree__arrow s-tree__arrow--leaf">{{ grand.children?.length ? '▸' : '' }}</span>
                <span v-if="grand.icon" class="s-tree__icon">{{ grand.icon }}</span>
                <span class="s-tree__label">{{ grand.label }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.s-tree {
  list-style: none;
  margin: 0;
  padding: 0;
  user-select: none;
}
.s-tree__children {
  list-style: none;
  margin: 0;
  padding-left: 20px;
}
.s-tree__row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: var(--s-r-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--s-ink);
  transition: background 0.15s;
}
.s-tree__row:hover { background: var(--s-surface-2); }
.s-tree__row--selected {
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  font-weight: 600;
}
.s-tree__row--disabled { opacity: 0.45; cursor: not-allowed; }
.s-tree__arrow {
  width: 16px;
  flex: none;
  text-align: center;
  font-size: 11px;
  color: var(--s-ink-faint);
  transition: transform 0.2s;
}
.s-tree__arrow--open { transform: rotate(90deg); color: var(--s-ink-soft); }
.s-tree__arrow--leaf { visibility: hidden; }
.s-tree__icon { font-size: 14px; }
.s-tree__label { line-height: 1.5; }
</style>
