<script setup lang="ts">
/**
 * SScan — 扫描线
 * 一条发光扫描线从上到下周期扫过内容，可带网格背景。
 * 零依赖：CSS 动画。
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 扫描速度（一次扫描 ms） */
  duration?: number
  /** 扫描线颜色 */
  color?: string
  /** 是否显示网格背景 */
  grid?: boolean
  /** 扫描线高度（px） */
  lineHeight?: number
}>(), {
  duration: 2500,
  color: '#5f86a8',
  grid: true,
  lineHeight: 3,
})

const gridStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${props.color}22 1px, transparent 1px), linear-gradient(to bottom, ${props.color}22 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
}))
</script>

<template>
  <div class="s-scan" :style="{ '--scan-dur': `${duration}ms`, '--scan-color': color, '--scan-h': `${lineHeight}px` }">
    <div v-if="grid" class="s-scan__grid" :style="gridStyle" />
    <div class="s-scan__line" />
    <div v-if="$slots.default" class="s-scan__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-scan {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-scan__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.s-scan__line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: var(--scan-h, 3px);
  background: var(--scan-color, #5f86a8);
  box-shadow: 0 0 12px 2px var(--scan-color, #5f86a8);
  opacity: 0.7;
  animation: s-scan-move var(--scan-dur, 2500ms) ease-in-out infinite;
  pointer-events: none;
}
.s-scan__content {
  position: relative;
  z-index: 1;
}
@keyframes s-scan-move {
  0% { top: -2%; opacity: 0; }
  8% { opacity: 0.7; }
  92% { opacity: 0.7; }
  100% { top: 100%; opacity: 0; }
}
</style>
