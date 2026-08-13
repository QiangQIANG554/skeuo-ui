<script setup lang="ts">
/**
 * STextParticle — 文字粒子化
 * 文字打散成粒子 → 从随机位置聚合到文字形状；可再打散循环。
 * 零依赖：离屏 Canvas 采样文字像素坐标 + 主 Canvas 动画。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标文本 */
  text: string
  /** 粒子密度（每个采样点的间距 px，越小粒子越多） */
  density?: number
  /** 粒子颜色（默认主题主色） */
  color?: string
  /** 粒子大小 */
  size?: number
  /** 聚合速度（0-1，越大越快） */
  speed?: number
  /** 是否循环打散-聚合 */
  loop?: boolean
  /** 循环间隔 ms */
  loopDelay?: number
}>(), {
  text: '',
  density: 4,
  color: '',
  size: 2,
  speed: 0.06,
  loop: false,
  loopDelay: 3000,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let timer: ReturnType<typeof setTimeout> | null = null

interface P {
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
}

let particles: P[] = []

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-primary').trim() || '#5f86a8'
}

function sampleTextPixels(target: string): { x: number; y: number }[] {
  // 离屏 canvas：画文字 → 读像素 → 取非透明点
  const off = document.createElement('canvas')
  const offCtx = off.getContext('2d')!
  const fontPx = 64
  off.width = 1000
  off.height = 120
  offCtx.fillStyle = '#fff'
  offCtx.font = `bold ${fontPx}px ${getComputedStyle(document.documentElement).getPropertyValue('--s-font') || 'sans-serif'}`
  offCtx.textBaseline = 'middle'
  offCtx.fillText(target, 10, off.height / 2)

  const imgData = offCtx.getImageData(0, 0, off.width, off.height)
  const pts: { x: number; y: number }[] = []
  for (let y = 0; y < off.height; y += props.density) {
    for (let x = 0; x < off.width; x += props.density) {
      const a = imgData.data[(y * off.width + x) * 4 + 3]
      if (a > 128) {
        pts.push({ x, y })
      }
    }
  }
  return pts
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

function build() {
  const targets = sampleTextPixels(props.text)
  if (!targets.length) { particles = []; return }
  // 缩放目标到容器宽度（保持比例）
  const scale = Math.min(1, (width * 0.9) / 1000)
  const ox = (width - 1000 * scale) / 2
  const oy = (height - 120 * scale) / 2

  particles = targets.map((t) => {
    const tx = ox + t.x * scale
    const ty = oy + t.y * scale
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      tx,
      ty,
      vx: 0,
      vy: 0,
    }
  })
}

function scatter() {
  for (const p of particles) {
    p.x = Math.random() * width
    p.y = Math.random() * height
  }
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)
  const k = props.speed
  let settled = 0

  for (const p of particles) {
    // 向目标点弹性逼近
    p.vx += (p.tx - p.x) * k
    p.vy += (p.ty - p.y) * k
    p.vx *= 0.85
    p.vy *= 0.85
    p.x += p.vx
    p.y += p.vy
    if (Math.abs(p.x - p.tx) < 0.5 && Math.abs(p.y - p.ty) < 0.5) settled++

    ctx.globalAlpha = 0.9
    ctx.fillStyle = color
    ctx.fillRect(p.x, p.y, props.size * dpr, props.size * dpr)
  }

  ctx.globalAlpha = 1
  if (settled < particles.length) {
    raf = requestAnimationFrame(draw)
  } else {
    // 全部到位，若循环则打散重聚
    if (props.loop && particles.length) {
      timer = setTimeout(() => {
        scatter()
        raf = requestAnimationFrame(draw)
      }, props.loopDelay)
    }
  }
}

function play() {
  if (timer) clearTimeout(timer)
  if (raf) cancelAnimationFrame(raf)
  setup()
  build()
  if (!particles.length) return
  scatter()
  raf = requestAnimationFrame(draw)
}

watch(() => props.text, () => play(), { flush: 'post' })

onMounted(() => {
  play()
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (raf) cancelAnimationFrame(raf)
  particles = []
})

defineExpose({ play })
</script>

<template>
  <div ref="wrap" class="s-text-particle">
    <canvas ref="canvas" class="s-text-particle__canvas" />
  </div>
</template>

<style scoped>
.s-text-particle {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-text-particle__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
