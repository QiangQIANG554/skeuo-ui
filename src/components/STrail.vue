<script setup lang="ts">
/**
 * STrail — 鼠标拖尾
 * 鼠标移动时留下粒子拖尾，逐渐缩小、渐隐消散。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 拖尾粒子颜色（默认主题主色） */
  color?: string
  /** 粒子大小 */
  size?: number
  /** 每帧生成的粒子数（越大拖尾越浓密） */
  density?: number
  /** 粒子存活帧数（越大拖尾越长） */
  life?: number
  /** 粒子是否随鼠标移动而改变颜色 */
  rainbow?: boolean
}>(), {
  color: '',
  size: 4,
  density: 2,
  life: 40,
  rainbow: false,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let dpr = 1
let width = 0
let height = 0
let hue = 0

interface TrailDot {
  x: number
  y: number
  r: number
  life: number
  maxLife: number
  color: string
}

let dots: TrailDot[] = []

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
  ctx.clearRect(0, 0, width, height)

  dots = dots.filter((d) => {
    d.life -= 1
    if (d.life <= 0) return false
    const t = d.life / d.maxLife
    ctx!.globalAlpha = t * 0.7
    ctx!.fillStyle = d.color
    ctx!.beginPath()
    ctx!.arc(d.x, d.y, d.r * t * dpr, 0, Math.PI * 2)
    ctx!.fill()
    return true
  })

  if (dots.length || running) {
    raf = requestAnimationFrame(draw)
  } else {
    running = false
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, width, height)
  }
}

function onMove(e: MouseEvent) {
  const w = wrap.value
  if (!w) return
  if (!running) {
    running = true
    raf = requestAnimationFrame(draw)
  }
  const rect = w.getBoundingClientRect()
  const x = (e.clientX - rect.left) * dpr
  const y = (e.clientY - rect.top) * dpr
  if (props.rainbow) hue = (hue + 3) % 360

  for (let i = 0; i < props.density; i++) {
    const jitter = (Math.random() - 0.5) * props.size * 0.6
    dots.push({
      x: x + jitter,
      y: y + jitter,
      r: (props.size * (0.5 + Math.random() * 0.5)) * dpr,
      life: props.life,
      maxLife: props.life,
      color: props.rainbow ? `hsl(${hue}, 70%, 60%)` : resolveColor(),
    })
  }
}

function onLeave() {
  running = false
}

function onResize() {
  setup()
}

onMounted(() => {
  const w = wrap.value
  if (!w) return
  setup()
  w.addEventListener('mousemove', onMove)
  w.addEventListener('mouseleave', onLeave)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  const w = wrap.value
  if (w) {
    w.removeEventListener('mousemove', onMove)
    w.removeEventListener('mouseleave', onLeave)
  }
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
  dots = []
  running = false
})
</script>

<template>
  <div ref="wrap" class="s-trail">
    <canvas ref="canvas" class="s-trail__canvas" />
    <div v-if="$slots.default" class="s-trail__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-trail {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-trail__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-trail__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
