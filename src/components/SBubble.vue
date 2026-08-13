<script setup lang="ts">
/**
 * SBubble — 气泡上升
 * 气泡从容器底部生成，上升、左右摇摆、逐渐变大，到顶部破裂消失。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 气泡数量 */
  count?: number
  /** 气泡颜色（默认主题主色，半透明） */
  color?: string
  /** 上升速度 px/帧 */
  speed?: number
  /** 气泡大小范围 [min, max] px */
  size?: [number, number]
  /** 是否显示气泡高光 */
  highlight?: boolean
}>(), {
  count: 24,
  color: '',
  speed: 0.9,
  size: () => [4, 16],
  highlight: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0

interface Bubble {
  x: number
  y: number
  r: number
  vy: number
  phase: number
  vphase: number
  swayAmp: number
}

let bubbles: Bubble[] = []

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

  const [minR, maxR] = props.size
  bubbles = []
  for (let i = 0; i < props.count; i++) {
    bubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (minR + Math.random() * (maxR - minR)) * dpr,
      vy: (0.5 + Math.random() * 0.8) * props.speed * dpr,
      phase: Math.random() * Math.PI * 2,
      vphase: (0.02 + Math.random() * 0.02) * dpr,
      swayAmp: (0.5 + Math.random()) * 8 * dpr,
    })
  }
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)

  for (const b of bubbles) {
    b.y -= b.vy
    b.phase += b.vphase
    b.x += Math.sin(b.phase) * b.swayAmp * 0.08
    if (b.y < -b.r) {
      b.y = height + b.r
      b.x = Math.random() * width
    }

    // 气泡主体（半透明）
    ctx.globalAlpha = 0.18
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fill()

    // 气泡描边
    ctx.globalAlpha = 0.35
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(1, dpr * 0.8)
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.stroke()

    // 高光
    if (props.highlight) {
      ctx.globalAlpha = 0.6
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2)
      ctx.fill()
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
  bubbles = []
})
</script>

<template>
  <div ref="wrap" class="s-bubble">
    <canvas ref="canvas" class="s-bubble__canvas" />
    <div v-if="$slots.default" class="s-bubble__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-bubble {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-bubble__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-bubble__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
