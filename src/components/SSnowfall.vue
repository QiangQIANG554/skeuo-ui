<script setup lang="ts">
/**
 * SSnowfall — 雪花飘落
 * 雪花/花瓣从顶部生成，左右摇摆飘落、旋转，到底部消失。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 雪花数量 */
  count?: number
  /** 雪花颜色（默认浅色，白色） */
  color?: string
  /** 下落速度 px/帧 */
  speed?: number
  /** 摇摆幅度 px */
  sway?: number
  /** 雪花大小范围 [min, max] */
  size?: [number, number]
  /** 是否为圆形（false 为六角形线条） */
  circle?: boolean
}>(), {
  count: 60,
  color: '',
  speed: 0.7,
  sway: 2,
  size: () => [2, 6],
  circle: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0

interface Flake {
  x: number
  y: number
  r: number
  vy: number
  phase: number
  vphase: number
  swayAmp: number
  rot: number
  vrot: number
}

let flakes: Flake[] = []

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-sh-light').trim() || '#ffffff'
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
  flakes = []
  for (let i = 0; i < props.count; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (minR + Math.random() * (maxR - minR)) * dpr,
      vy: (0.5 + Math.random() * 0.8) * props.speed * dpr,
      phase: Math.random() * Math.PI * 2,
      vphase: (0.01 + Math.random() * 0.02) * dpr,
      swayAmp: (0.5 + Math.random()) * props.sway * dpr,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.05 * dpr,
    })
  }
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)

  for (const f of flakes) {
    f.y += f.vy
    f.phase += f.vphase
    f.rot += f.vrot
    f.x += Math.sin(f.phase) * f.swayAmp * 0.1
    if (f.y > height + f.r) {
      f.y = -f.r
      f.x = Math.random() * width
    }
    if (f.x < -f.r) f.x = width + f.r
    if (f.x > width + f.r) f.x = -f.r

    ctx.globalAlpha = 0.75
    ctx.fillStyle = color
    if (props.circle) {
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // 六角形线条雪花
      ctx.save()
      ctx.translate(f.x, f.y)
      ctx.rotate(f.rot)
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(1, dpr)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a) * f.r, Math.sin(a) * f.r)
        // 分叉
        ctx.moveTo(Math.cos(a) * f.r * 0.6, Math.sin(a) * f.r * 0.6)
        ctx.lineTo(Math.cos(a + 0.5) * f.r * 0.9, Math.sin(a + 0.5) * f.r * 0.9)
      }
      ctx.stroke()
      ctx.restore()
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
  flakes = []
})
</script>

<template>
  <div ref="wrap" class="s-snowfall">
    <canvas ref="canvas" class="s-snowfall__canvas" />
    <div v-if="$slots.default" class="s-snowfall__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-snowfall {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-snowfall__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-snowfall__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
