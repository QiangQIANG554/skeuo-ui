<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percent?: number
  showLabel?: boolean
  type?: 'line' | 'circle'
  size?: number
  strokeWidth?: number
}>(), {
  percent: 0,
  showLabel: false,
  type: 'line',
  size: 120,
  strokeWidth: 10,
})

defineOptions({ name: 'SProgress' })

const width = computed(() => `${Math.max(0, Math.min(100, props.percent))}%`)

// 圆形进度
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => {
  const p = Math.max(0, Math.min(100, props.percent))
  return circumference.value * (1 - p / 100)
})
</script>

<template>
  <div v-if="type === 'line'" class="s-progress">
    <div class="s-progress__track">
      <div class="s-progress__bar" :style="{ width }" />
    </div>
    <span v-if="showLabel" class="s-progress__label">{{ percent }}%</span>
  </div>

  <div v-else class="s-progress-circle" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        class="s-progress-circle__track"
        :cx="size / 2" :cy="size / 2" :r="radius"
        :stroke-width="strokeWidth" fill="none"
      />
      <circle
        class="s-progress-circle__bar"
        :cx="size / 2" :cy="size / 2" :r="radius"
        :stroke-width="strokeWidth" fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <span v-if="showLabel" class="s-progress-circle__label">{{ percent }}%</span>
  </div>
</template>

<style scoped>
.s-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.s-progress__track {
  flex: 1;
  height: 16px;
  border-radius: var(--s-r-pill);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.s-progress__bar {
  height: 100%;
  border-radius: var(--s-r-pill);
  background: linear-gradient(90deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: 0 0 8px color-mix(in srgb, var(--s-primary) 40%, transparent);
  transition: width 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.s-progress__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--s-ink-soft);
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.s-progress-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.s-progress-circle__track {
  stroke: var(--s-bg-deep);
  filter: drop-shadow(2px 2px 3px var(--s-sh-dark)) drop-shadow(-1px -1px 2px var(--s-sh-light));
}
.s-progress-circle__bar {
  stroke: var(--s-primary);
  transition: stroke-dashoffset 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.s-progress-circle__label {
  position: absolute;
  font-size: 16px;
  font-weight: 700;
  color: var(--s-ink);
  font-variant-numeric: tabular-nums;
}
</style>
