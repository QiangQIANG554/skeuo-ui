<script setup lang="ts">
/**
 * SWaveText — 波浪文字
 * 文字逐字上下浮动（正弦波），像水波一样流动。
 * 零依赖：CSS 动画 + 字符 span。
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标文本 */
  text: string
  /** 波动幅度（px） */
  amplitude?: number
  /** 波动周期（每个字相差的度数，越大越波浪） */
  phase?: number
  /** 动画时长（一轮起伏 ms） */
  duration?: number
  /** 字号（px） */
  fontSize?: number
}>(), {
  text: '',
  amplitude: 8,
  phase: 12,
  duration: 1600,
  fontSize: 28,
})

const chars = computed(() => Array.from(props.text))

function delayFor(i: number): string {
  return `${(i * props.phase) * (props.duration / 360)}ms`
}
</script>

<template>
  <span class="s-wave-text" :style="{ fontSize: `${fontSize}px` }">
    <span
      v-for="(ch, i) in chars"
      :key="`${i}-${ch}`"
      class="s-wave-text__char"
      :style="{
        animationDelay: delayFor(i),
        '--amp': `${amplitude}px`,
        '--dur': `${duration}ms`,
      }"
    >{{ ch }}</span>
  </span>
</template>

<style scoped>
.s-wave-text {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-word;
}
.s-wave-text__char {
  display: inline-block;
  animation: s-wave-float var(--dur, 1600ms) ease-in-out infinite;
}
@keyframes s-wave-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-1 * var(--amp, 8px))); }
}
</style>
