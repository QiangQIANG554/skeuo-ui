<script setup lang="ts">
export interface StepItem {
  title: string
  description?: string
}

const props = withDefaults(defineProps<{
  items?: StepItem[]
  active?: number
  direction?: 'horizontal' | 'vertical'
}>(), {
  items: () => [],
  active: 0,
  direction: 'horizontal',
})

defineOptions({ name: 'SSteps' })

function stateOf(i: number): 'done' | 'current' | 'todo' {
  if (i < props.active) return 'done'
  if (i === props.active) return 'current'
  return 'todo'
}
</script>

<template>
  <div class="s-steps" :class="`s-steps--${direction}`">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="s-steps__item"
      :class="`s-steps__item--${stateOf(i)}`"
    >
      <div class="s-steps__head">
        <span class="s-steps__dot">
          <span v-if="stateOf(i) === 'done'" class="s-steps__check">✓</span>
          <span v-else>{{ i + 1 }}</span>
        </span>
        <span v-if="i < items.length - 1" class="s-steps__line" />
      </div>
      <div class="s-steps__content">
        <div class="s-steps__title">{{ item.title }}</div>
        <div v-if="item.description" class="s-steps__desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-steps {
  display: flex;
}
.s-steps--horizontal { flex-direction: row; }
.s-steps--vertical { flex-direction: column; gap: var(--s-sp-4); }
.s-steps__item {
  flex: 1;
  display: flex;
  gap: 10px;
}
.s-steps--horizontal .s-steps__item { flex-direction: column; align-items: center; text-align: center; }
.s-steps--vertical .s-steps__item { align-items: flex-start; }
.s-steps__head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.s-steps--horizontal .s-steps__head { width: 100%; }
.s-steps--vertical .s-steps__head { flex-direction: column; height: 100%; }
.s-steps__dot {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
}
.s-steps__item--current .s-steps__dot {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light), 0 0 10px color-mix(in srgb, var(--s-primary) 40%, transparent);
}
.s-steps__item--done .s-steps__dot {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
  color: #fff;
}
.s-steps__line {
  flex: 1;
  height: 2px;
  min-width: 24px;
  background: var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
}
.s-steps__item--done .s-steps__line {
  background: color-mix(in srgb, var(--s-accent) 60%, var(--s-bg-deep));
}
.s-steps__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.s-steps__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-ink);
}
.s-steps__item--todo .s-steps__title { color: var(--s-ink-faint); }
.s-steps__desc {
  font-size: 12px;
  color: var(--s-ink-faint);
}
</style>
