<script setup lang="ts">
/**
 * SLoaderRing — 环形粒子加载
 * 粒子沿圆环轨道旋转；转到"最大点"（固定角度）时放大，
 * 经过最大点时速度放慢，过后恢复——像行星掠过近日点。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 直径（px） */
  size?: number
  /** 显示粒子数量 */
  count?: number
  /** 尾部留白数量（粒子分布按 count+blankTail 均分，尾部 blankTail 个位置不画，间距不变） */
  blankTail?: number
  /** 粒子颜色（默认主题主色） */
  color?: string
  /** 基准旋转速度（弧度/帧） */
  speed?: number
  /** 粒子大小 */
  particleSize?: number
  /** 最大点角度（弧度，默认 -π/2 即顶部） */
  maxAngle?: number
  /** 最大点处粒子放大倍数（1 = 不放大） */
  boost?: number
  /** 经过最大点时最慢速度系数（0-1，越小越慢） */
  minSpeedFactor?: number
  /** 是否启用变速 + 放大效果 */
  enabled?: boolean
}>(), {
  size: 60,
  count: 12,
  blankTail: 0,
  color: '',
  speed: 0.014,
  particleSize: 4,
  maxAngle: -Math.PI / 2,
  boost: 2.15,
  minSpeedFactor: 0.3,
  enabled: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let angle = 0

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-primary').trim() || '#5f86a8'
}

/** 归一化角度差到 [-π, π] */
function normAngleDiff(a: number, b: number): number {
  let d = (a - b) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

function setup() {
  const c = canvas.value
  const w = wrap.value
  if (!c || !w) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = w.getBoundingClientRect()
  c.width = Math.max(1, Math.round(rect.width * dpr))
  c.height = Math.max(1, Math.round(rect.height * dpr))
  c.style.width = `${rect.width}px`
  c.style.height = `${rect.height}px`
  ctx = c.getContext('2d')
}

function draw() {
  if (!ctx) return
  const color = resolveColor()
  const w = canvas.value!
  ctx.clearRect(0, 0, w.width, w.height)

  // 变速：接近最大点时减速（正弦调制，最大点处最慢）
  const distToMax = Math.abs(normAngleDiff(angle, props.maxAngle))
  let speedFactor = 1
  if (props.enabled) {
    const slowZone = Math.PI / 2 // 最大点前后 90° 为减速区
    speedFactor = props.minSpeedFactor
      + (1 - props.minSpeedFactor) * Math.min(1, distToMax / slowZone)
  }
  angle += props.speed * speedFactor * dpr

  const cx = w.width / 2
  const cy = w.height / 2
  const r = (props.size * dpr) / 2 - props.particleSize * dpr

  // 粒子沿环分布（间距按 count+blankTail 均分，尾部留白；最大点处放大）
  const slotCount = props.count + props.blankTail // 总槽位数（决定间距）
  for (let i = 0; i < props.count; i++) {
    const a = angle + (i * Math.PI * 2) / slotCount
    const px = cx + Math.cos(a) * r
    const py = cy + Math.sin(a) * r

    // 距最大点的角度差（高斯放大）
    let scale = 1
    if (props.enabled) {
      const da = normAngleDiff(a, props.maxAngle)
      // 高斯峰：越靠近最大点放大越明显
      scale = 1 + (props.boost - 1) * Math.exp(-(da * da) / (2 * 0.45 * 0.45))
    }

    // 尾部粒子渐隐（基于总槽位相对位置）
    const rel = ((i / slotCount) - 0.5) * 2 // -1..1
    const alpha = Math.max(0.1, 1 - Math.abs(rel) * 0.9)

    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(px, py, props.particleSize * dpr * scale, 0, Math.PI * 2)
    ctx.fill()
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
  <div ref="wrap" class="s-loader-ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" class="s-loader-ring__canvas" />
  </div>
</template>

<style scoped>
.s-loader-ring {
  position: relative;
  display: inline-block;
}
.s-loader-ring__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
