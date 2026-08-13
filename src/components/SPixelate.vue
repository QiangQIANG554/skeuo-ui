<script setup lang="ts">
/**
 * SPixelate — 像素化
 * 图片/内容以马赛克块状显示，逐帧细化到清晰（或反向像素化）。
 * 零依赖：Canvas 2D，把图片绘制成小方块。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 图片来源（URL 或 base64） */
  src: string
  /** 动画方向：'reveal' 像素化→清晰 / 'hide' 清晰→像素化 */
  direction?: 'reveal' | 'hide'
  /** 动画时长 ms */
  duration?: number
  /** 是否循环（清晰→像素化→清晰） */
  loop?: boolean
  /** 循环间隔 ms */
  loopDelay?: number
}>(), {
  src: '',
  direction: 'reveal',
  duration: 2000,
  loop: false,
  loopDelay: 2000,
})

const wrap = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let dpr = 1
let width = 0
let height = 0
let img: HTMLImageElement | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let loaded = false

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

function loadImage(): Promise<void> {
  return new Promise((resolve) => {
    if (!props.src) { resolve(); return }
    const i = new Image()
    i.crossOrigin = 'anonymous'
    i.onload = () => { img = i; loaded = true; resolve() }
    i.onerror = () => resolve()
    i.src = props.src
  })
}

function drawFrame(progress: number) {
  // progress: 0=像素化最粗, 1=完全清晰
  if (!ctx || !img || !loaded) return
  ctx.clearRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = false

  if (progress >= 1) {
    // 完全清晰：直接画原图
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(img, 0, 0, width, height)
    return
  }

  // 方块数从少到多（像素块从大到小）
  const maxBlocks = 2
  const minBlocks = 30
  const blocks = Math.max(1, Math.round(maxBlocks + (minBlocks - maxBlocks) * progress))
  const tinyW = Math.max(1, blocks)
  const tinyH = Math.max(1, Math.round(blocks * (height / width)))

  // 画到临时小 canvas → 放大回主 canvas（像素块效果）
  const tmp = document.createElement('canvas')
  tmp.width = tinyW
  tmp.height = tinyH
  const tmpCtx = tmp.getContext('2d')!
  tmpCtx.drawImage(img, 0, 0, tinyW, tinyH)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tmp, 0, 0, width, height)
}

function play() {
  if (raf) cancelAnimationFrame(raf)
  if (timer) clearTimeout(timer)
  setup()
  if (!loaded && props.src) {
    loadImage().then(() => {
      animateOnce()
    })
  } else {
    animateOnce()
  }
}

function animateOnce() {
  const start = performance.now()
  const dur = props.duration

  function step(now: number) {
    if (!ctx || !img) return
    const t = Math.min(1, (now - start) / dur)
    let progress = t
    if (props.direction === 'hide') progress = 1 - t
    drawFrame(progress)

    if (t < 1) {
      raf = requestAnimationFrame(step)
    } else {
      if (props.direction === 'hide') {
        // 隐藏完成后清空
        ctx.clearRect(0, 0, width, height)
      }
      if (props.loop) {
        timer = setTimeout(() => {
          props.direction === 'hide'
            ? animateReverse()
            : animateOnce()
        }, props.loopDelay)
      }
    }
  }

  function animateReverse() {
    const rstart = performance.now()
    function rstep(now: number) {
      if (!ctx || !img) return
      const t = Math.min(1, (now - rstart) / dur)
      drawFrame(1 - t) // hide: 1→0
      if (t < 1) {
        raf = requestAnimationFrame(rstep)
      } else {
        if (props.loop) {
          timer = setTimeout(() => animateOnce(), props.loopDelay)
        }
      }
    }
    raf = requestAnimationFrame(rstep)
  }

  raf = requestAnimationFrame(step)
}

watch(() => props.src, () => {
  loaded = false
  img = null
  play()
}, { flush: 'post' })

onMounted(() => {
  play()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (timer) clearTimeout(timer)
})

defineExpose({ play })
</script>

<template>
  <div ref="wrap" class="s-pixelate">
    <canvas ref="canvas" class="s-pixelate__canvas" />
    <p v-if="!src" class="s-pixelate__empty">SPixelate · 请传入图片 src</p>
  </div>
</template>

<style scoped>
.s-pixelate {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-pixelate__canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.s-pixelate__empty {
  position: absolute;
  color: var(--s-ink-faint, #a3aab6);
  font-size: 13px;
}
</style>
