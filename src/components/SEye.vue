<script setup lang="ts">
/**
 * SEye — 眼球跟随
 * 眼球（眼眶 + 瞳孔）跟随鼠标转动，瞳孔有高光。适合 404 页/登录页彩蛋。
 * 零依赖：CSS + 监听鼠标位置。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 眼球直径（px） */
  size?: number
  /** 瞳孔最大位移（占眼球半径比例，0-1） */
  pupilRange?: number
  /** 瞳孔颜色（默认深色） */
  pupilColor?: string
  /** 虹膜颜色 */
  irisColor?: string
  /** 是否两只眼睛 */
  pair?: boolean
}>(), {
  size: 48,
  pupilRange: 0.45,
  pupilColor: '#3a4150',
  irisColor: '#5f86a8',
  pair: false,
})

const root = ref<HTMLElement | null>(null)
let raf = 0
let mouseX = 0
let mouseY = 0
let tx = 0
let ty = 0

function onMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  if (!raf) raf = requestAnimationFrame(tick)
}

function tick() {
  raf = 0
  const wrap = root.value
  if (!wrap) return
  const rect = wrap.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  // 归一化方向：鼠标相对眼球容器中心
  let dx = mouseX - cx
  let dy = mouseY - cy
  const dist = Math.hypot(dx, dy) || 1
  dx /= dist
  dy /= dist

  // 平滑跟随
  tx += (dx - tx) * 0.12
  ty += (dy - ty) * 0.12

  const max = (props.size / 2) * props.pupilRange
  const balls = wrap.querySelectorAll<HTMLElement>('.s-eye__ball')
  for (const ball of balls) {
    const pupil = ball.querySelector('.s-eye__pupil') as HTMLElement | null
    if (pupil) {
      pupil.style.transform = `translate(${tx * max}px, ${ty * max}px)`
    }
  }
}

function onResize() {
  // 重新定位容器中心，无需处理，tick 每次重新取 rect
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="s-eye" :class="{ 's-eye--pair': pair }">
    <div v-for="i in (pair ? 2 : 1)" :key="i" class="s-eye__ball" :style="{ width: `${size}px`, height: `${size}px` }">
      <div class="s-eye__iris" :style="{ background: irisColor }">
        <div class="s-eye__pupil" :style="{ background: pupilColor }">
          <div class="s-eye__shine" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-eye {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.s-eye__ball {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, #dfe4ea);
  box-shadow: var(--s-shadow-raised-sm);
  overflow: hidden;
}
.s-eye__iris {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-eye__pupil {
  position: relative;
  width: 42%;
  height: 42%;
  border-radius: 50%;
  transition: transform 0.12s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-eye__shine {
  position: absolute;
  top: 12%;
  left: 18%;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}
</style>
