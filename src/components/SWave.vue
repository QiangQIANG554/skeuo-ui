<script setup lang="ts">
/**
 * SWave — 波浪线条
 * 正弦波浪线持续流动，可多条叠加，适合页头/装饰。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 波浪层数 */
  layers?: number
  /** 主色（默认主题主色） */
  color?: string
  /** 振幅（px） */
  amplitude?: number
  /** 波长（px，越大波浪越宽） */
  wavelength?: number
  /** 流动速度（px/帧） */
  speed?: number
  /** 线条高度位置（0-1，相对容器高度） */
  baseline?: number
  /** 是否填充（false 只画线条） */
  fill?: boolean
}>(), {
  layers: 2,
  color: '',
  amplitude: 18,
  wavelength: 140,
  speed: 1.2,
  baseline: 0.6,
  fill: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let offset = 0

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-primary').trim() || '#5f86a8'
}

function setup() {
  const c = canvas.value
  const w = wrap.value
  if (!c || !w) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = w.getBoundingClientRect()
  width = Math.max(1, Math.round(rect.width * dpr))
  height = Math.max(1, Math.round(rect.height * dpr))
  c.width = width
  c.height = height
  c.style.width = `${rect.width}px`
  c.style.height = `${rect.height}px`
  ctx = c.getContext('2d')
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)
  offset += props.speed * dpr

  const baseY = height * props.baseline
  const amp = props.amplitude * dpr
  const waveLen = props.wavelength * dpr

  for (let layer = 0; layer < props.layers; layer++) {
    const phase = (layer / props.layers) * Math.PI * 2
    const alpha = 0.35 + (0.3 / Math.max(1, props.layers)) * (props.layers - layer)

    ctx.beginPath()
    ctx.moveTo(0, height)
    for (let x = 0; x <= width; x += dpr * 2) {
      const y = baseY + Math.sin((x + offset + phase * waveLen) / waveLen * Math.PI * 2 + phase) * amp
      ctx.lineTo(x, y)
    }
    ctx.lineTo(width, height)
    ctx.closePath()

    if (props.fill) {
      ctx.globalAlpha = alpha * 0.45
      ctx.fillStyle = color
      ctx.fill()
    } else {
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(1, dpr * 1.2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
  raf = requestAnimationFrame(draw)
}

function onResize() {
  setup()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  setup()
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="wrap" class="s-wave">
    <canvas ref="canvas" class="s-wave__canvas" />
  </div>
</template>

<style scoped>
.s-wave {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-wave__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
