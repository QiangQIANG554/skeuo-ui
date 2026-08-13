<script setup lang="ts">
/**
 * SParticles — 背景粒子场
 * 漂浮粒子 + 近距离连线（星座效果）+ 鼠标吸引/排斥交互。
 * 零依赖：Canvas 2D + requestAnimationFrame，自动适配容器尺寸与 DPR。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 粒子数量 */
  count?: number
  /** 粒子颜色（默认主题色） */
  color?: string
  /** 连线最大距离（px），超过不连线 */
  linkDistance?: number
  /** 连线透明度（0-1） */
  linkOpacity?: number
  /** 粒子最大速度 px/帧 */
  speed?: number
  /** 粒子半径（px） */
  size?: number
  /** 鼠标交互：'attract' 吸引 / 'repel' 排斥 / 'none' 关闭 */
  mouse?: 'attract' | 'repel' | 'none'
  /** 鼠标影响半径（px） */
  mouseRadius?: number
}>(), {
  count: 60,
  color: '',
  linkDistance: 130,
  linkOpacity: 0.16,
  speed: 0.5,
  size: 2,
  mouse: 'attract',
  mouseRadius: 160,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let mouseX = -9999
let mouseY = -9999
let mouseInside = false

interface P {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

let pts: P[] = []

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-primary').trim() || '#5f86a8'
}

function resize() {
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

function init() {
  pts = []
  for (let i = 0; i < props.count; i++) {
    pts.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * props.speed * dpr,
      vy: (Math.random() - 0.5) * props.speed * dpr,
      r: Math.max(1, props.size * dpr),
    })
  }
}

function step() {
  const color = resolveColor()
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // 更新位置
  for (const p of pts) {
    p.x += p.vx
    p.y += p.vy
    // 边界反弹
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
    p.x = Math.max(0, Math.min(width, p.x))
    p.y = Math.max(0, Math.min(height, p.y))

    // 鼠标交互
    if (mouseInside && props.mouse !== 'none') {
      const dx = p.x - mouseX * dpr
      const dy = p.y - mouseY * dpr
      const dist = Math.hypot(dx, dy)
      const radius = props.mouseRadius * dpr
      if (dist < radius && dist > 0.01) {
        const force = (1 - dist / radius) * 1.2 * dpr
        if (props.mouse === 'attract') {
          p.vx -= (dx / dist) * force
          p.vy -= (dy / dist) * force
        } else {
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }
    // 速度上限
    const maxV = props.speed * 1.6 * dpr
    const v = Math.hypot(p.vx, p.vy)
    if (v > maxV) {
      p.vx = (p.vx / v) * maxV
      p.vy = (p.vy / v) * maxV
    }

    // 画点
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.55
    ctx.fill()
  }

  // 连线（O(n²)，count 控制在几百以内无压力）
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i]
      const b = pts[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.hypot(dx, dy)
      const maxLink = props.linkDistance * dpr
      if (dist < maxLink) {
        const alpha = props.linkOpacity * (1 - dist / maxLink)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = color
        ctx.lineWidth = Math.max(0.6, dpr * 0.8)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1
  raf = requestAnimationFrame(step)
}

function onMouseMove(e: MouseEvent) {
  const rect = wrap.value?.getBoundingClientRect()
  if (!rect) return
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  mouseInside = true
}

function onMouseLeave() {
  mouseInside = false
  mouseX = -9999
  mouseY = -9999
}

function onResize() {
  resize()
  init()
}

onMounted(() => {
  const w = wrap.value
  if (!w) return
  resize()
  init()
  w.addEventListener('mousemove', onMouseMove)
  w.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('resize', onResize)
  raf = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  const w = wrap.value
  if (w) {
    w.removeEventListener('mousemove', onMouseMove)
    w.removeEventListener('mouseleave', onMouseLeave)
  }
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
  pts = []
})
</script>

<template>
  <div ref="wrap" class="s-particles">
    <canvas ref="canvas" class="s-particles__canvas" />
    <div v-if="$slots.default" class="s-particles__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-particles {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-particles__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.s-particles__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
