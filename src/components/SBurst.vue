<script setup lang="ts">
/**
 * SBurst — 点击粒子爆裂
 * 点击/按压元素时，粒子从触点向四周散开、受重力回落、渐隐消失。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 * canvas 比元素大 expand*2，粒子可飞出元素范围，不被裁剪。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 每次爆裂的粒子数量 */
  count?: number
  /** 粒子颜色（可传数组随机取色；默认从主题色读取） */
  colors?: string[]
  /** 粒子最大初速度 px/帧（60fps 基准） */
  speed?: number
  /** 重力加速度 px/帧²（>0 向下，<0 向上，0 无重力） */
  gravity?: number
  /** 粒子存活帧数 */
  life?: number
  /** 粒子半径范围 [min, max] */
  size?: [number, number]
  /** 粒子可飞出元素四周的扩展范围（px），越大爆裂越开 */
  expand?: number
  /** true 时 wrap 撑满父容器，适合做全屏点击粒子背景 */
  anywhere?: boolean
}>(), {
  count: 24,
  colors: () => [],
  speed: 6,
  gravity: 0.18,
  life: 90,
  size: () => [2, 5],
  expand: 80,
  anywhere: false,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let dpr = 1
let padX = 0 // canvas 相对 wrap 的偏移（左上角，px，设备坐标）
let padY = 0
let wrapW = 0 // wrap 尺寸（设备坐标）
let wrapH = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  life: number
  maxLife: number
}

let particles: Particle[] = []

function themeColors(): string[] {
  if (props.colors.length) return props.colors
  const cs = getComputedStyle(document.documentElement)
  const pick = (v: string) => cs.getPropertyValue(v).trim()
  return [
    pick('--s-primary') || '#5f86a8',
    pick('--s-accent') || '#6ba3a0',
    pick('--s-gold') || '#c2a15e',
  ]
}

function setupCanvas() {
  const c = canvas.value
  const w = wrap.value
  if (!c || !w) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = w.getBoundingClientRect()
  wrapW = Math.round(rect.width * dpr)
  wrapH = Math.round(rect.height * dpr)
  const expand = Math.round(props.expand * dpr)
  padX = -expand
  padY = -expand
  c.width = Math.max(1, wrapW + expand * 2)
  c.height = Math.max(1, wrapH + expand * 2)
  c.style.width = `${wrapW + expand * 2}px`
  c.style.height = `${wrapH + expand * 2}px`
  c.style.left = `${padX}px`
  c.style.top = `${padY}px`
  ctx = c.getContext('2d')
}

function draw() {
  if (!ctx || !canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0, 0, w, h)

  particles = particles.filter((p) => {
    p.life -= 1
    if (p.life <= 0) return false
    p.vy += props.gravity * dpr
    p.x += p.vx * dpr
    p.y += p.vy * dpr
    p.vx *= 0.985
    p.vy *= 0.985
    // 触底反弹一次（以元素底边为地面）
    const ground = padY + wrapH
    if (p.y > ground - p.r * dpr && p.vy > 0) {
      p.y = ground - p.r * dpr
      p.vy *= -0.45
    }
    const alpha = Math.max(0, Math.min(1, p.life / (p.maxLife * 0.5)))
    ctx!.globalAlpha = alpha
    ctx!.fillStyle = p.color
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2)
    ctx!.fill()
    return true
  })

  if (particles.length) {
    raf = requestAnimationFrame(draw)
  } else {
    running = false
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, w, h)
  }
}

function burst(clientX: number, clientY: number) {
  const c = canvas.value
  const w = wrap.value
  if (!c || !w) return
  setupCanvas()
  const rect = w.getBoundingClientRect()
  // 元素内点相对 canvas 左上角的坐标：padX/padY 为负偏移，减负 = 加扩展
  const bx = (clientX - rect.left) * dpr - padX
  const by = (clientY - rect.top) * dpr - padY
  const colors = themeColors()
  const [minR, maxR] = props.size

  for (let i = 0; i < props.count; i++) {
    const angle = Math.random() * Math.PI * 2
    const spd = (0.35 + Math.random() * 0.65) * props.speed * dpr
    particles.push({
      x: bx,
      y: by,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - props.speed * 0.35 * dpr,
      r: minR + Math.random() * (maxR - minR),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: props.life,
      maxLife: props.life,
    })
  }

  if (!running) {
    running = true
    raf = requestAnimationFrame(draw)
  }
}

function onPointerDown(e: PointerEvent) {
  burst(e.clientX, e.clientY)
}

onMounted(() => {
  setupCanvas()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  particles = []
  running = false
})
</script>

<template>
  <div
    ref="wrap"
    class="s-burst"
    :class="{ 's-burst--anywhere': anywhere }"
    @pointerdown="onPointerDown"
  >
    <canvas ref="canvas" class="s-burst__canvas" />
    <div v-if="$slots.default" class="s-burst__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-burst {
  position: relative;
  display: inline-block;
}
.s-burst--anywhere {
  display: block;
  width: 100%;
  height: 100%;
}
.s-burst__canvas {
  position: absolute;
  inset: auto;
  pointer-events: none;
  z-index: 3;
}
.s-burst__content {
  position: relative;
  z-index: 2;
}
</style>
