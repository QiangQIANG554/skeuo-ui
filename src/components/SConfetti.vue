<script setup lang="ts">
/**
 * SConfetti — 彩带庆祝
 * 纸屑/彩带从顶部或中心爆开，带旋转、重力、摆动飘落。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 是否自动开始（false 则通过 ref 调用 start()） */
  auto?: boolean
  /** 纸屑数量 */
  count?: number
  /** 纸屑颜色（默认主题色组） */
  colors?: string[]
  /** 爆开初速度 px/帧 */
  speed?: number
  /** 重力 px/帧² */
  gravity?: number
  /** 飘落摆动幅度（0-1） */
  sway?: number
  /** 持续帧数（0 = 一直飘直到全部落地） */
  duration?: number
}>(), {
  auto: true,
  count: 120,
  colors: () => [],
  speed: 7,
  gravity: 0.14,
  sway: 0.6,
  duration: 0,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let dpr = 1
let width = 0
let height = 0

interface Confetto {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  rot: number
  vr: number
  color: string
  phase: number
  shape: 'rect' | 'circle'
  life: number
}

let pieces: Confetto[] = []

function resolveColors(): string[] {
  if (props.colors.length) return props.colors
  const cs = getComputedStyle(document.documentElement)
  const pick = (v: string) => cs.getPropertyValue(v).trim()
  return [
    pick('--s-primary') || '#5f86a8',
    pick('--s-accent') || '#6ba3a0',
    pick('--s-success') || '#5c9a8f',
    pick('--s-warning') || '#c9a45e',
    pick('--s-danger') || '#c07b74',
  ]
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

function start() {
  const w = wrap.value
  if (!w) return
  setup()
  const colors = resolveColors()
  pieces = []
  const cx = width / 2
  const cy = height * 0.2

  for (let i = 0; i < props.count; i++) {
    const angle = Math.random() * Math.PI * 2
    const spd = (0.4 + Math.random() * 0.6) * props.speed * dpr
    pieces.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd * 0.6,
      w: (4 + Math.random() * 6) * dpr,
      h: (2 + Math.random() * 4) * dpr,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25 * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      shape: Math.random() < 0.7 ? 'rect' : 'circle',
      life: props.duration || 240 + Math.random() * 120,
    })
  }

  if (!running) {
    running = true
    raf = requestAnimationFrame(draw)
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  pieces = pieces.filter((p) => {
    p.life -= 1
    if (p.life <= 0) return false
    p.vy += props.gravity * dpr
    p.vx *= 0.99
    p.x += p.vx
    p.y += p.vy
    p.rot += p.vr
    // 摆动：水平方向加正弦摆动
    p.phase += 0.06
    p.x += Math.sin(p.phase) * props.sway * dpr * 0.5

    ctx!.save()
    ctx!.translate(p.x, p.y)
    ctx!.rotate(p.rot)
    ctx!.globalAlpha = Math.max(0, Math.min(1, p.life / 60))
    ctx!.fillStyle = p.color
    if (p.shape === 'rect') {
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    } else {
      ctx!.beginPath()
      ctx!.arc(0, 0, p.w / 2, 0, Math.PI * 2)
      ctx!.fill()
    }
    ctx!.restore()
    return true
  })

  if (pieces.length) {
    raf = requestAnimationFrame(draw)
  } else {
    running = false
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, width, height)
  }
}

function onResize() {
  setup()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  if (props.auto) start()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
  pieces = []
  running = false
})

defineExpose({ start })
</script>

<template>
  <div ref="wrap" class="s-confetti">
    <canvas ref="canvas" class="s-confetti__canvas" />
    <div v-if="$slots.default" class="s-confetti__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-confetti {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-confetti__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-confetti__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
