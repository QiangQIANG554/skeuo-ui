<script setup lang="ts">
import { computed } from 'vue'

export type TimelineType = 'default' | 'primary' | 'accent' | 'danger' | 'success'

export interface TimelineItem {
  title: string
  description?: string
  time?: string
  type?: TimelineType
}

const props = withDefaults(defineProps<{
  items?: TimelineItem[]
  reverse?: boolean
}>(), {
  items: () => [],
  reverse: false,
})

defineOptions({ name: 'STimeline' })

const list = computed(() => (props.reverse ? [...props.items].reverse() : props.items))
</script>

<template>
  <ul class="s-timeline">
    <li v-for="(item, i) in list" :key="i" class="s-timeline__item">
      <div class="s-timeline__rail">
        <span class="s-timeline__dot" :class="`s-timeline__dot--${item.type ?? 'default'}`" />
        <span v-if="i < list.length - 1" class="s-timeline__line" />
      </div>
      <div class="s-timeline__content">
        <div class="s-timeline__title">{{ item.title }}</div>
        <div v-if="item.description" class="s-timeline__desc">{{ item.description }}</div>
        <div v-if="item.time" class="s-timeline__time">{{ item.time }}</div>
      </div>
    </li>
    <slot />
  </ul>
</template>

<style scoped>
.s-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}
.s-timeline__item {
  display: flex;
  gap: var(--sp-4, 16px);
}
.s-timeline__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: none;
  width: 22px;
}
.s-timeline__dot {
  width: 14px;
  height: 14px;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  margin-top: 3px;
}
.s-timeline__dot--primary {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
}
.s-timeline__dot--accent {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
}
.s-timeline__dot--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
}
.s-timeline__dot--success {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
  box-shadow: var(--s-shadow-raised-sm), 0 0 6px color-mix(in srgb, var(--s-accent) 50%, transparent);
}
.s-timeline__line {
  flex: 1;
  width: 2px;
  min-height: 24px;
  background: var(--s-bg-deep);
  box-shadow: 1px 0 0 var(--s-sh-light);
  margin: 4px 0;
}
.s-timeline__content {
  padding-bottom: var(--sp-5, 24px);
}
.s-timeline__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-ink);
}
.s-timeline__desc {
  font-size: 13px;
  color: var(--s-ink-soft);
  margin-top: 2px;
}
.s-timeline__time {
  font-size: 12px;
  color: var(--s-ink-faint);
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}
</style>
