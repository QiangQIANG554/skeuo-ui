<script setup lang="ts">
import { computed, provide, useSlots, type VNode } from 'vue'
import { isVNode, Fragment } from 'vue'
import { tabsKey, type TabItem } from './tabs-context'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  tabs?: TabItem[]
}>(), {
  modelValue: '',
  tabs: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()

defineOptions({ name: 'STabs' })

const slots = useSlots()

// 从默认插槽中收集 STab 子组件，得到完整的 tab 列表
function collectFromSlots(): TabItem[] {
  const children = (slots.default?.() ?? []) as VNode[]
  const items: TabItem[] = []
  const walk = (nodes: VNode[]) => {
    for (const n of nodes) {
      if (!isVNode(n)) continue
      if ((n.type as any)?.__name === 'STab') {
        items.push({
          label: (n.props?.label as string) ?? '',
          name: n.props?.name as string | undefined,
          disabled: n.props?.disabled as boolean | undefined,
        })
      } else if (n.type === Fragment && Array.isArray(n.children)) {
        walk(n.children as VNode[])
      }
    }
  }
  walk(children)
  return items
}

const allTabs = computed(() => (props.tabs.length ? props.tabs : collectFromSlots()))

const activeKey = computed<string | number>({
  get: () => {
    const first = allTabs.value[0]
    return props.modelValue || (first ? (first.name ?? first.label) : '')
  },
  set: (v) => emit('update:modelValue', v),
})

function select(item: TabItem) {
  if (item.disabled) return
  activeKey.value = item.name ?? item.label
}

provide(tabsKey, { getActiveKey: () => activeKey.value })
</script>

<template>
  <div class="s-tabs">
    <div class="s-tabs__nav" role="tablist">
      <button
        v-for="t in allTabs"
        :key="t.name ?? t.label"
        class="s-tabs__tab"
        :class="{ active: activeKey === (t.name ?? t.label) }"
        :disabled="t.disabled"
        role="tab"
        type="button"
        @click="select(t)"
      >{{ t.label }}</button>
    </div>
    <div class="s-tabs__panel">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-tabs { width: 100%; }
.s-tabs__nav {
  display: flex;
  gap: 6px;
  padding: 8px;
  border-radius: var(--s-r-lg);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
}
.s-tabs__tab {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--s-ink-soft);
  padding: 9px 0;
  border-radius: var(--s-r-md);
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: var(--s-font);
  transition: all 0.15s;
}
.s-tabs__tab:hover { color: var(--s-ink); }
.s-tabs__tab.active {
  color: var(--s-ink);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-tabs__tab[disabled] { opacity: 0.4; cursor: not-allowed; }
.s-tabs__panel { padding-top: var(--s-sp-4); }
</style>
