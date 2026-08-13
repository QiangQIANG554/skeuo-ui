<script setup lang="ts">
/**
 * SRipple — 水波涟漪
 * 点击元素时，触点泛起扩散的波纹环，逐渐淡出。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 波纹数量（每次点击） */
  count?: number
  /** 波纹颜色（默认主题主色） */
  color?: string
  /** 波纹扩散速度 px/帧 */
  speed?: number
  /** 波纹最大半径（px，0=自动按元素尺寸） */
  maxRadius?: number
  /** 波纹初始线宽 */
  lineWidth?: number
  /** 初始透明度 */
  opacity?: number
  /** 波纹存活帧数（越大波纹越持久，扩散越明显） */
  life?: number
  /** 波纹初始半径（px，默认从 2 开始扩散） */
  startRadius?: number
  /** 波纹可飞出元素四周的扩展范围（px，0=涟漪只限元素内） */
  expand?: number
  /** 是否点击任意位置都起涟漪（false 则只有点击元素自身） */
  anywhere?: boolean
}>(), {
  count: 2,
  color: '',
  speed: 1.6,
  maxRadius: 0,
  lineWidth: 2.5,
  opacity: 0.45,
  life: 75,
  startRadius: 2,
  expand: 0,
  anywhere: false,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let dpr = 1
let width = 0
let height = 0
let padX = 0 // canvas 相对 wrap 左上角的偏移（设备坐标，expand 时 < 0）
let padY = 0

interface Ripple {
  x: number
  y: number
  r: number
  maxR: number
  alpha: number
  life: number
  maxLife: number
}

let ripples: Ripple[] = []

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
  const expand = Math.round(props.expand * dpr)
  padX = -expand
  padY = -expand
  width = Math.max(1, Math.round(rect.width * dpr) + expand * 2)
  height = Math.max(1, Math.round(rect.height * dpr) + expand * 2)
  c.width = width
  c.height = height
  c.style.width = `${width / dpr}px`
  c.style.height = `${height / dpr}px`
  c.style.left = `${padX / dpr}px`
  c.style.top = `${padY / dpr}px`
  ctx = c.getContext('2d')
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  ripples = ripples.filter((r) => {
    r.r += props.speed * dpr
    r.life -= 1
    if (r.life <= 0 || r.r >= r.maxR) return false

    // 透明度随剩余寿命渐隐
    const t = Math.max(0, r.life / r.maxLife)
    ctx!.globalAlpha = Math.max(0, r.alpha * t)
    ctx!.strokeStyle = resolveColor()
    // 线宽随扩散由粗变细，更像真实水波
    const grow = r.r / r.maxR
    ctx!.lineWidth = Math.max(0.6, props.lineWidth * (1 - grow * 0.7)) * dpr
    ctx!.beginPath()
    ctx!.arc(r.x, r.y, r.r, 0, Math.PI * 2)
    ctx!.stroke()
    return true
  })

  if (ripples.length) {
    raf = requestAnimationFrame(draw)
  } else {
    running = false
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, width, height)
  }
}

function rippleAt(clientX: number, clientY: number) {
  const w = wrap.value
  if (!w) return
  setup()
  const rect = w.getBoundingClientRect()
  // 元素内点相对 canvas 左上角的坐标：padX/padY 为负偏移，减负 = 加扩展
  const x = (clientX - rect.left) * dpr - padX
  const y = (clientY - rect.top) * dpr - padY
  const autoMax = Math.max(width, height) * 0.9
  const maxR = (props.maxRadius || autoMax) * dpr

  for (let i = 0; i < props.count; i++) {
    ripples.push({
      x,
      y,
      r: props.startRadius * dpr + i * 6 * dpr,
      maxR,
      alpha: props.opacity * (1 - i * 0.25),
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
  rippleAt(e.clientX, e.clientY)
}

function onResize() {
  setup()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  setup()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
  ripples = []
  running = false
})
</script>

<template>
  <div
    ref="wrap"
    class="s-ripple"
    :class="{ 's-ripple--anywhere': anywhere }"
    @pointerdown="onPointerDown"
  >
    <canvas ref="canvas" class="s-ripple__canvas" />
    <div v-if="$slots.default" class="s-ripple__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-ripple {
  position: relative;
  display: inline-block;
}
.s-ripple--anywhere {
  display: block;
  width: 100%;
  height: 100%;
}
.s-ripple__canvas {
  position: absolute;
  inset: auto;
  pointer-events: none;
  z-index: 3;
}
.s-ripple__content {
  position: relative;
  z-index: 2;
}
</style>
