<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
}

withDefaults(defineProps<{
  items?: BreadcrumbItem[]
  separator?: string
}>(), {
  items: () => [],
  separator: '/',
})

defineOptions({ name: 'SBreadcrumb' })
</script>

<template>
  <nav class="s-breadcrumb" aria-label="面包屑">
    <template v-for="(item, i) in items" :key="i">
      <a
        v-if="item.href && i < items.length - 1"
        class="s-breadcrumb__link"
        :href="item.href"
      >{{ item.label }}</a>
      <span v-else class="s-breadcrumb__current">{{ item.label }}</span>
      <span v-if="i < items.length - 1" class="s-breadcrumb__sep">{{ separator }}</span>
    </template>
    <slot v-if="!items.length" />
  </nav>
</template>

<style scoped>
.s-breadcrumb {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
}
.s-breadcrumb__link {
  color: var(--s-ink-soft);
  text-decoration: none;
  padding: 3px 8px;
  border-radius: var(--s-r-sm);
  transition: all 0.12s;
}
.s-breadcrumb__link:hover {
  color: var(--s-ink);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-breadcrumb__current {
  color: var(--s-ink);
  font-weight: 600;
  padding: 3px 8px;
}
.s-breadcrumb__sep {
  color: var(--s-ink-faint);
  user-select: none;
}
</style>
