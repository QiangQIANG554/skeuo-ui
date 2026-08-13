<script setup lang="ts">
/**
 * SProgressFX — 进度条特效
 * 粒子填充式进度条：粒子从左侧流入、堆积成进度，带闪烁尾迹。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 进度 0-100 */
  percent?: number
  /** 粒子颜色（默认主题主色） */
  color?: string
  /** 粒子大小 */
  size?: number
  /** 粒子流入速度 */
  flowSpeed?: number
  /** 高度（px） */
  height?: number
  /** 是否显示百分比文字 */
  showLabel?: boolean
}>(), {
  percent: 0,
  color: '',
  size: 4,
  flowSpeed: 1.2,
  height: 14,
  showLabel: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let canvasH = 0

interface FlowParticle {
  x: number
  y: number
  r: number
  vx: number
  life: number
  maxLife: number
}

let flows: FlowParticle[] = []

const percentClamped = computed(() => Math.max(0, Math.min(100, props.percent)))

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
  canvasH = Math.max(1, Math.round(rect.height * dpr))
  c.width = width
  c.height = canvasH
  c.style.width = `${rect.width}px`
  c.style.height = `${rect.height}px`
  ctx = c.getContext('2d')
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  const pct = percentClamped.value / 100
  ctx.clearRect(0, 0, width, canvasH)

  const cy = canvasH / 2
  const trackH = props.height * dpr
  const radius = trackH / 2 // 胶囊圆头半径

  // 底部轨道（胶囊）
  ctx.globalAlpha = 0.22
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.arcTo(width, 0, width, canvasH, radius)
  ctx.arcTo(width, canvasH, 0, canvasH, radius)
  ctx.arcTo(0, canvasH, 0, 0, radius)
  ctx.arcTo(0, 0, width, 0, radius)
  ctx.closePath()
  ctx.fill()

  // 已填充部分（圆头胶囊）
  const fillW = Math.max(0, width * pct)
  ctx.globalAlpha = 0.92
  ctx.fillStyle = color
  if (fillW > radius * 2) {
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.arcTo(fillW, 0, fillW, canvasH, radius)
    ctx.arcTo(fillW, canvasH, 0, canvasH, radius)
    ctx.arcTo(0, canvasH, 0, 0, radius)
    ctx.arcTo(0, 0, fillW, 0, radius)
    ctx.closePath()
    ctx.fill()
  } else if (fillW > 0) {
    // 进度很小时画一个圆点
    ctx.beginPath()
    ctx.arc(fillW, cy, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 进度点：右边缘凸出的发光圆点（珠子效果）
  if (fillW > 1) {
    const px = Math.min(fillW, width - radius) // 100% 时贴右缘
    const glow = 0.5 + 0.5 * Math.sin(Date.now() / 110)
    const beadR = radius * 1.12

    // 外发光光晕（径向渐变）
    const haloR = radius * 2.1
    const halo = ctx.createRadialGradient(px, cy, radius * 0.4, px, cy, haloR)
    halo.addColorStop(0, `rgba(255,255,255,${0.5 + glow * 0.3})`)
    halo.addColorStop(0.4, `rgba(255,255,255,${0.2 + glow * 0.15})`)
    halo.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.globalAlpha = 1
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(px, cy, haloR, 0, Math.PI * 2)
    ctx.fill()

    // 头部珠体（白色实心圆点，略凸出轨道）
    ctx.globalAlpha = 0.95
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(px, cy, beadR, 0, Math.PI * 2)
    ctx.fill()
    // 头部高光（左上亮斑）
    ctx.globalAlpha = 0.85
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.arc(px - beadR * 0.28, cy - beadR * 0.28, beadR * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // 消散粒子（从进度点向左流动消散，更密集）
  for (const f of flows) {
    f.x += f.vx // vx 为负 → 向起点方向移动
    f.life += 1
    if (f.life > f.maxLife || f.x < 0 || f.x > fillW) continue
    const t = 1 - f.life / f.maxLife
    ctx.globalAlpha = 0.65 * t
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(f.x, f.y, f.r * dpr * (0.5 + t * 0.6), 0, Math.PI * 2)
    ctx.fill()
  }
  flows = flows.filter((f) => f.life <= f.maxLife && f.x >= 0 && f.x <= fillW)

  ctx.globalAlpha = 1
  raf = requestAnimationFrame(draw)
}

function spawnFlows() {
  // 粒子从进度点（右端）生成，向左（起点方向）飘散；每次生成 2-3 个更密集
  const cy = canvasH / 2
  const trackH = props.height * dpr
  const fillW = width * (percentClamped.value / 100)
  if (fillW > 14 * dpr) {
    const n = 2 + Math.floor(Math.random() * 2) // 2-3 个/次
    for (let i = 0; i < n; i++) {
      flows.push({
        x: fillW - Math.random() * 8 * dpr,
        y: cy + (Math.random() - 0.5) * trackH * 0.8,
        r: props.size * 0.5 * (0.6 + Math.random() * 0.6),
        vx: -props.flowSpeed * dpr * (0.5 + Math.random() * 0.7),
        life: 0,
        maxLife: 30 + Math.random() * 20,
      })
    }
  }
}

let spawnTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  window.addEventListener('resize', setup)
  setup()
  raf = requestAnimationFrame(draw)
  spawnTimer = setInterval(spawnFlows, 40)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setup)
  if (raf) cancelAnimationFrame(raf)
  if (spawnTimer) clearInterval(spawnTimer)
  flows = []
})
</script>

<template>
  <div class="s-progress-fx">
    <div ref="wrap" class="s-progress-fx__track" :style="{ height: `${props.height}px` }">
      <canvas ref="canvas" class="s-progress-fx__canvas" />
    </div>
    <div v-if="showLabel" class="s-progress-fx__label">{{ Math.round(percentClamped) }}%</div>
  </div>
</template>

<style scoped>
.s-progress-fx {
  width: 100%;
}
.s-progress-fx__track {
  position: relative;
  width: 100%;
  border-radius: var(--s-r-pill, 999px);
  overflow: hidden;
}
.s-progress-fx__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.s-progress-fx__label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--s-ink-soft, #7a8290);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
