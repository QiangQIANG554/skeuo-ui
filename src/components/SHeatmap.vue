<script setup lang="ts">
/**
 * SHeatmap — 鼠标热力残影
 * 鼠标移动/点击时在触点叠加暖色光晕，像热力图一样逐渐淡出。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 热力半径（px） */
  radius?: number
  /** 强度（0-1） */
  intensity?: number
  /** 衰减速度（0-1，越大消失越快） */
  fade?: number
  /** 是否点击时增强 */
  clickBoost?: boolean
}>(), {
  radius: 60,
  intensity: 0.35,
  fade: 0.02,
  clickBoost: true,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let lastDraw = 0

interface HeatSpot {
  x: number
  y: number
  r: number
  alpha: number
}

let spots: HeatSpot[] = []

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

  spots = spots.filter((s) => {
    s.alpha -= props.fade
    if (s.alpha <= 0) return false
    const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
    grad.addColorStop(0, `rgba(240, 120, 60, ${s.alpha})`)
    grad.addColorStop(0.6, `rgba(240, 150, 80, ${s.alpha * 0.4})`)
    grad.addColorStop(1, 'rgba(240, 160, 90, 0)')
    ctx!.globalAlpha = 1
    ctx!.fillStyle = grad
    ctx!.beginPath()
    ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx!.fill()
    return true
  })

  if (spots.length) {
    raf = requestAnimationFrame(draw)
  } else {
    ctx.clearRect(0, 0, width, height)
  }
}

function addSpot(clientX: number, clientY: number, boost = 1) {
  const w = wrap.value
  if (!w) return
  if (!spots.length) {
    raf = requestAnimationFrame(draw)
  }
  const rect = w.getBoundingClientRect()
  spots.push({
    x: (clientX - rect.left) * dpr,
    y: (clientY - rect.top) * dpr,
    r: props.radius * dpr * (0.8 + Math.random() * 0.4),
    alpha: props.intensity * boost,
  })
  // 限制数量防内存增长
  if (spots.length > 200) spots.splice(0, spots.length - 200)
}

function onMove(e: MouseEvent) {
  // 节流：约每 3 帧加一个点
  const now = performance.now()
  if (now - lastDraw < 50) return
  lastDraw = now
  addSpot(e.clientX, e.clientY)
}

function onDown(e: PointerEvent) {
  addSpot(e.clientX, e.clientY, props.clickBoost ? 1.6 : 1)
}

function onResize() {
  setup()
}

onMounted(() => {
  const w = wrap.value
  if (!w) return
  setup()
  w.addEventListener('mousemove', onMove)
  w.addEventListener('pointerdown', onDown as EventListener)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  const w = wrap.value
  if (w) {
    w.removeEventListener('mousemove', onMove)
    w.removeEventListener('pointerdown', onDown as EventListener)
  }
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
  spots = []
})
</script>

<template>
  <div ref="wrap" class="s-heatmap">
    <canvas ref="canvas" class="s-heatmap__canvas" />
    <div v-if="$slots.default" class="s-heatmap__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-heatmap {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.s-heatmap__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.s-heatmap__content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}
</style>
