<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  value?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: boolean
  start?: number
}>(), {
  value: 0,
  duration: 1200,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: true,
  start: 0,
})

defineOptions({ name: 'SNumberAnimate' })

const display = ref(format(props.start))
let rafId = 0

function format(n: number): string {
  const fixed = n.toFixed(props.decimals)
  if (!props.separator) return fixed
  const [int, dec] = fixed.split('.')
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec !== undefined ? `${withSep}.${dec}` : withSep
}

function animate(to: number) {
  cancelAnimationFrame(rafId)
  const from = Number(display.value.replace(/,/g, '')) || 0
  const startTime = performance.now()
  const diff = to - from
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / props.duration)
    // easeOutCubic
    const eased = 1 - Math.pow(1 - t, 3)
    display.value = format(from + diff * eased)
    if (t < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

watch(() => props.value, (v) => animate(v))
onMounted(() => animate(props.value))
</script>

<template>
  <span class="s-number-animate">
    <span v-if="prefix" class="s-number-animate__prefix">{{ prefix }}</span>
    <span class="s-number-animate__value">{{ display }}</span>
    <span v-if="suffix" class="s-number-animate__suffix">{{ suffix }}</span>
  </span>
</template>

<style scoped>
.s-number-animate {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--s-font-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--s-ink);
  font-variant-numeric: tabular-nums;
}
.s-number-animate__prefix, .s-number-animate__suffix {
  font-size: 14px;
  color: var(--s-ink-soft);
  font-weight: 400;
  font-family: var(--s-font);
}
</style>
