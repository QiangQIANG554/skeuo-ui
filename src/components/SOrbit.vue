<script setup lang="ts">
/**
 * SOrbit — 轨道粒子
 * 粒子绕中心点旋转，可多层轨道（行星/电子围绕原子核）。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 轨道层数 */
  layers?: number
  /** 每层粒子数 */
  perLayer?: number
  /** 基础轨道半径（px） */
  radius?: number
  /** 轨道半径递增（px） */
  radiusStep?: number
  /** 旋转速度（弧度/帧） */
  speed?: number
  /** 中心点颜色（默认主题主色） */
  color?: string
  /** 是否显示轨道线 */
  showOrbit?: boolean
}>(), {
  layers: 3,
  perLayer: 4,
  radius: 36,
  radiusStep: 26,
  speed: 0.02,
  color: '',
  showOrbit: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let angle = 0

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
  angle += props.speed * dpr

  const cx = width / 2
  const cy = height / 2

  // 中心核
  ctx.globalAlpha = 1
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, 5 * dpr, 0, Math.PI * 2)
  ctx.fill()

  for (let layer = 0; layer < props.layers; layer++) {
    const r = (props.radius + layer * props.radiusStep) * dpr

    // 轨道线
    if (props.showOrbit) {
      ctx.globalAlpha = 0.18
      ctx.strokeStyle = color
      ctx.lineWidth = dpr
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 该层粒子，按固定相位分布
    const phaseOffset = layer * 0.8
    for (let i = 0; i < props.perLayer; i++) {
      const a = angle + phaseOffset + (i * Math.PI * 2) / props.perLayer
      const px = cx + Math.cos(a) * r
      const py = cy + Math.sin(a) * r * 0.4 // 椭圆投影，模拟 3D 倾斜
      const depth = 0.5 + 0.5 * Math.sin(a) // 前后遮挡：后侧淡、前侧亮
      ctx.globalAlpha = 0.25 + depth * 0.7
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(px, py, 3.5 * dpr * (0.6 + depth * 0.4), 0, Math.PI * 2)
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
})
</script>

<template>
  <div ref="wrap" class="s-orbit">
    <canvas ref="canvas" class="s-orbit__canvas" />
  </div>
</template>

<style scoped>
.s-orbit {
  position: relative;
  width: 100%;
}
.s-orbit__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
