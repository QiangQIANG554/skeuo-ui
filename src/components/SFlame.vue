<script setup lang="ts">
/**
 * SFlame — 火焰粒子
 * 粒子从底部火源生成，上升、摇曳、变色（黄→橙→红→黑），模拟火焰。
 * 零依赖：Canvas 2D + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 每秒粒子生成量 */
  intensity?: number
  /** 火焰高度（px） */
  height?: number
  /** 火焰宽度（px） */
  width?: number
  /** 粒子上升速度 px/帧 */
  speed?: number
  /** 火焰底部颜色（内焰） */
  colorInner?: string
  /** 火焰顶部颜色（外焰） */
  colorOuter?: string
}>(), {
  intensity: 30,
  height: 120,
  width: 60,
  speed: 1.6,
  colorInner: '#f5b04c',
  colorOuter: '#e2542a',
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let cw = 0
let ch = 0
let lastSpawn = 0
let frame = 0

interface Flame {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  life: number
  maxLife: number
  color: string
}

let flames: Flame[] = []

function setup() {
  const c = canvas.value
  const w = wrap.value
  if (!c || !w) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = w.getBoundingClientRect()
  cw = Math.max(1, Math.round(rect.width * dpr))
  ch = Math.max(1, Math.round(rect.height * dpr))
  c.width = cw
  c.height = ch
  c.style.width = `${rect.width}px`
  c.style.height = `${rect.height}px`
  ctx = c.getContext('2d')
}

function spawn() {
  const w = props.width * dpr
  const cx = cw / 2
  for (let i = 0; i < props.intensity; i++) {
    const t = Math.random()
    flames.push({
      x: cx + (Math.random() - 0.5) * w,
      y: ch - 2 * dpr,
      r: (2 + Math.random() * 4) * dpr,
      vy: -(0.7 + Math.random() * 0.6) * props.speed * dpr,
      vx: (Math.random() - 0.5) * 0.6 * dpr,
      life: 0,
      maxLife: 40 + Math.random() * 40,
      color: t < 0.5 ? props.colorInner : props.colorOuter,
    })
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, cw, ch)
  frame++
  lastSpawn += props.intensity * 0.5
  if (lastSpawn >= 1) {
    spawn()
    lastSpawn -= 1
  }

  flames = flames.filter((f) => {
    f.life += 1
    if (f.life >= f.maxLife) return false
    f.y += f.vy
    f.x += f.vx + Math.sin(frame * 0.05 + f.life * 0.1) * 0.15 * dpr
    // 越往上越小越透明
    const t = 1 - f.life / f.maxLife
    const size = f.r * (0.3 + t * 0.7)

    // 颜色渐变：内焰亮 → 外焰暗（随机混合 + 底部加白芯）
    ctx!.globalAlpha = t * 0.8
    if (f.life < 6) {
      ctx!.fillStyle = '#fdecc8' // 白热芯
    } else {
      ctx!.fillStyle = f.color
    }
    ctx!.beginPath()
    ctx!.arc(f.x, f.y, size, 0, Math.PI * 2)
    ctx!.fill()
    return true
  })

  // 限制数量
  if (flames.length > 800) flames.splice(0, flames.length - 800)
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
  flames = []
})
</script>

<template>
  <div ref="wrap" class="s-flame">
    <canvas ref="canvas" class="s-flame__canvas" />
  </div>
</template>

<style scoped>
.s-flame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.s-flame__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
