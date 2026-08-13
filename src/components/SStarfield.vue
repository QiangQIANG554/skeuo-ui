<script setup lang="ts">
/**
 * SStarfield — 3D 星空
 * 粒子从远处向屏幕飞驰（星际旅行感），越近越大越亮。
 * 零依赖：Canvas 2D + requestAnimationFrame，伪 3D 投影。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 星星数量 */
  count?: number
  /** 星星颜色（默认浅色/白色） */
  color?: string
  /** 飞行速度（0-1） */
  speed?: number
  /** 是否有鼠标牵引（星星向鼠标位置汇聚） */
  mouse?: boolean
}>(), {
  count: 200,
  color: '',
  speed: 0.6,
  mouse: false,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let mx = 0
let my = 0

interface Star {
  x: number
  y: number
  z: number
  px: number
  py: number
}

let stars: Star[] = []

function resolveColor(): string {
  if (props.color) return props.color
  // 默认用主题主色（浅色背景上可见）；深色主题下仍可用
  const cs = getComputedStyle(document.documentElement)
  const isDark = document.documentElement.dataset.theme === 'dark'
  if (isDark) return cs.getPropertyValue('--s-sh-light').trim() || '#ffffff'
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

  stars = []
  for (let i = 0; i < props.count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      px: 0,
      py: 0,
    })
  }
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = color

  const cx = width / 2
  const cy = height / 2
  const maxZ = Math.max(width, height)

  for (const s of stars) {
    // 向前移动：z 减小
    s.z -= props.speed * dpr * 2
    if (s.z <= 1) {
      s.z = maxZ
      s.x = Math.random() * width
      s.y = Math.random() * height
      s.px = 0
      s.py = 0
    }

    // 伪 3D 投影：从中心向外散开
    const scale = maxZ / s.z
    const sx = cx + (s.x - cx) * scale
    const sy = cy + (s.y - cy) * scale

    // 鼠标牵引：星星向鼠标方向偏移
    let ox = 0
    let oy = 0
    if (props.mouse) {
      ox = (mx * dpr - cx) * (1 / scale) * 0.2
      oy = (my * dpr - cy) * (1 / scale) * 0.2
    }

    // 亮度与大小随深度（浅色主题提高对比度）
    const depth = Math.max(0, 1 - s.z / maxZ)
    const size = Math.max(1, 3.5 * depth) * dpr
    ctx.globalAlpha = Math.max(0.35, depth)

    // 画拖尾（从上一帧位置到当前位置）
    if (s.px && s.py) {
      ctx.strokeStyle = color
      ctx.lineWidth = size * 0.5
      ctx.beginPath()
      ctx.moveTo(s.px + ox, s.py + oy)
      ctx.lineTo(sx + ox, sy + oy)
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(sx + ox, sy + oy, size, 0, Math.PI * 2)
    ctx.fill()

    s.px = sx + ox
    s.py = sy + oy
  }

  ctx.globalAlpha = 1
  raf = requestAnimationFrame(draw)
}

function onMove(e: MouseEvent) {
  if (!props.mouse) return
  const rect = wrap.value?.getBoundingClientRect()
  if (!rect) return
  mx = e.clientX - rect.left
  my = e.clientY - rect.top
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
  stars = []
})
</script>

<template>
  <div ref="wrap" class="s-starfield" @mousemove="onMove">
    <canvas ref="canvas" class="s-starfield__canvas" />
  </div>
</template>

<style scoped>
.s-starfield {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-starfield__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
