<script setup lang="ts">
/**
 * SGlitch — 故障抖动
 * 文字周期性出现 RGB 分离错位 + 水平抖动，模拟信号故障。
 * 零依赖：CSS transform + 定时器，纯文本无需 Canvas。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标文本 */
  text: string
  /** 故障间隔 ms（每隔多久抖一次） */
  interval?: number
  /** 故障持续时间 ms */
  duration?: number
  /** 抖动强度（px） */
  intensity?: number
  /** 是否启用 RGB 色散 */
  rgb?: boolean
}>(), {
  text: '',
  interval: 2500,
  duration: 350,
  intensity: 3,
  rgb: true,
})

const el = ref<HTMLElement | null>(null)
let glitching = false
let timer: ReturnType<typeof setTimeout> | null = null

function applyGlitch() {
  const node = el.value
  if (!node || glitching) return
  glitching = true

  // 随机 RGB 色散
  if (props.rgb) {
    const spread = props.intensity * (2 + Math.random() * 2)
    const dir = Math.random() > 0.5 ? 1 : -1
    node.style.textShadow = `${-dir * spread}px 0 rgba(255,60,60,0.8), ${dir * spread}px 0 rgba(60,160,255,0.8)`
  }

  // 水平抖动几帧
  const jitterCount = 4 + Math.floor(Math.random() * 4)
  let j = 0
  const jitterTimer = setInterval(() => {
    j++
    if (j > jitterCount) {
      clearInterval(jitterTimer)
      node.style.transform = 'translateX(0)'
      node.style.textShadow = ''
      glitching = false
      // 排下一次故障
      timer = setTimeout(applyGlitch, props.interval)
      return
    }
    const dx = (Math.random() - 0.5) * props.intensity * 2
    node.style.transform = `translateX(${dx}px)`
  }, 35)
}

watch(() => props.text, () => {
  // 文本变化时强制立即故障一次
  if (timer) clearTimeout(timer)
  applyGlitch()
}, { flush: 'post' })

onMounted(() => {
  applyGlitch()
  timer = setTimeout(applyGlitch, props.interval)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  glitching = false
})
</script>

<template>
  <span ref="el" class="s-glitch" :style="{ display: 'inline-block', willChange: 'transform, text-shadow' }">{{ text }}</span>
</template>

<style scoped>
.s-glitch {
  font-variant-numeric: tabular-nums;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
