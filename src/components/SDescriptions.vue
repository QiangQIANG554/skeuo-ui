<script setup lang="ts">
export interface DescriptionsItem {
  label: string
  value?: string | number
  span?: number
}

withDefaults(defineProps<{
  title?: string
  items?: DescriptionsItem[]
  column?: number
  bordered?: boolean
}>(), {
  title: '',
  items: () => [],
  column: 2,
  bordered: false,
})

defineOptions({ name: 'SDescriptions' })
</script>

<template>
  <div class="s-desc" :class="{ 's-desc--bordered': bordered }">
    <div v-if="title" class="s-desc__title">{{ title }}</div>
    <div
      class="s-desc__grid"
      :style="{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }"
    >
      <template v-for="item in items" :key="item.label + String(item.value)">
        <div class="s-desc__cell" :class="{ 's-desc__cell--span': item.span && item.span > 1 }" :style="item.span ? { gridColumn: `span ${item.span}` } : {}">
          <span class="s-desc__label">{{ item.label }}</span>
          <span class="s-desc__value">{{ item.value ?? '—' }}</span>
        </div>
      </template>
      <slot v-if="$slots.default" />
    </div>
  </div>
</template>

<style scoped>
.s-desc { display: flex; flex-direction: column; gap: 12px; }
.s-desc__title {
  font-family: var(--s-font-serif);
  font-size: 16px;
  font-weight: 700;
  color: var(--s-ink);
}
.s-desc__grid {
  display: grid;
  gap: 1px;
  background: var(--s-bg-deep);
  border-radius: var(--s-r-md);
  overflow: hidden;
}
.s-desc__cell {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: var(--s-surface);
}
.s-desc--bordered .s-desc__cell { box-shadow: inset 0 0 0 1px var(--s-bg-deep); }
.s-desc__label {
  flex: none;
  min-width: 90px;
  font-size: 13px;
  color: var(--s-ink-faint);
}
.s-desc__value {
  font-size: 13px;
  color: var(--s-ink);
}
</style>
