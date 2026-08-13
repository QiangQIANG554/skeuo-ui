<script setup lang="ts">
/**
 * SRain — 雨滴下落
 * 雨滴从顶部斜落，带拖尾；可切换流星样式。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 雨滴数量 */
  count?: number
  /** 雨滴颜色（默认主题主色，浅色） */
  color?: string
  /** 下落速度 px/帧 */
  speed?: number
  /** 倾斜角度（-1 到 1，正右倾） */
  slant?: number
  /** 流星模式：尾部更长 */
  meteor?: boolean
  /** 流星渐变 */
  meteorGradient?: boolean
}>(), {
  count: 50,
  color: '',
  speed: 5,
  slant: 0.2,
  meteor: false,
  meteorGradient: false,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0

interface Drop {
  x: number
  y: number
  len: number
  vx: number
  vy: number
}

let drops: Drop[] = []

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

  const vx = props.slant * props.speed * dpr
  const vy = props.speed * dpr
  drops = []
  for (let i = 0; i < props.count; i++) {
    drops.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: (props.meteor ? 30 : 10 + Math.random() * 10) * dpr,
      vx: vx * (0.8 + Math.random() * 0.4),
      vy: vy * (0.8 + Math.random() * 0.4),
    })
  }
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)

  for (const d of drops) {
    d.x += d.vx
    d.y += d.vy
    // 超出边界后重置
    if (d.y > height + d.len || d.x > width + d.len || d.x < -d.len) {
      d.x = Math.random() * width
      d.y = -d.len
      d.vx = (props.slant * props.speed * (0.8 + Math.random() * 0.4)) * dpr
      d.vy = (props.speed * (0.8 + Math.random() * 0.4)) * dpr
    }

    const nx = -d.vx
    const ny = -d.vy
    const norm = Math.hypot(nx, ny) || 1
    const tailX = d.x + (nx / norm) * d.len
    const tailY = d.y + (ny / norm) * d.len

    if (props.meteor && props.meteorGradient) {
      const grad = ctx.createLinearGradient(d.x, d.y, tailX, tailY)
      grad.addColorStop(0, color)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.strokeStyle = grad
    } else {
      ctx.strokeStyle = color
    }

    ctx.globalAlpha = props.meteor ? 0.85 : 0.5
    ctx.lineWidth = Math.max(1, dpr * (props.meteor ? 1.6 : 1.2))
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(tailX, tailY)
    ctx.stroke()
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
  drops = []
})
</script>

<template>
  <div ref="wrap" class="s-rain">
    <canvas ref="canvas" class="s-rain__canvas" />
    <div v-if="$slots.default" class="s-rain__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-rain {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-rain__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-rain__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
