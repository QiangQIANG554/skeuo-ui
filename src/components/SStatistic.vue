<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  value?: number | string
  suffix?: string
  prefix?: string
  precision?: number
  trend?: 'up' | 'down' | 'flat'
  trendText?: string
  color?: string
}>(), {
  title: '',
  value: 0,
  suffix: '',
  prefix: '',
  precision: 0,
  trend: 'flat',
  trendText: '',
  color: '',
})

defineOptions({ name: 'SStatistic' })

const displayValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  return Number(props.value).toLocaleString('zh-CN', {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision,
  })
})

const trendArrow = computed(() => props.trend === 'up' ? '↗' : props.trend === 'down' ? '↘' : '→')
</script>

<template>
  <div class="s-stat">
    <div v-if="title" class="s-stat__title">{{ title }}</div>
    <div class="s-stat__value-row">
      <span v-if="prefix" class="s-stat__prefix">{{ prefix }}</span>
      <span class="s-stat__value" :style="color ? { color } : {}">{{ displayValue }}</span>
      <span v-if="suffix" class="s-stat__suffix">{{ suffix }}</span>
    </div>
    <div v-if="trendText" class="s-stat__trend" :class="`s-stat__trend--${trend}`">
      <span class="s-stat__arrow">{{ trendArrow }}</span>{{ trendText }}
    </div>
  </div>
</template>

<style scoped>
.s-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised);
}
.s-stat__title {
  font-size: 13px;
  color: var(--s-ink-soft);
}
.s-stat__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.s-stat__value {
  font-family: var(--s-font-serif);
  font-size: 30px;
  font-weight: 700;
  color: var(--s-ink);
  line-height: 1;
}
.s-stat__prefix, .s-stat__suffix {
  font-size: 14px;
  color: var(--s-ink-soft);
}
.s-stat__trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: var(--s-r-pill);
  width: fit-content;
}
.s-stat__arrow { font-weight: 700; }
.s-stat__trend--up { color: var(--s-danger); background: var(--s-bg); box-shadow: var(--s-shadow-inset); }
.s-stat__trend--down { color: var(--s-success); background: var(--s-bg); box-shadow: var(--s-shadow-inset); }
.s-stat__trend--flat { color: var(--s-ink-faint); background: var(--s-bg); box-shadow: var(--s-shadow-inset); }
</style>
