<script setup lang="ts">
/**
 * SMagnetic — 磁吸变形
 * 鼠标靠近时元素向光标方向轻微偏移 + 轻微缩放，离开后回弹。
 * 纯 Canvas 无需，这里用 transform 实现（轻量、GPU 加速、可包裹任意内容）。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 磁吸强度 0-1，越大偏移越明显 */
  strength?: number
  /** 生效的鼠标感应半径（px），超出后回弹 */
  radius?: number
  /** 是否启用缩放变形 */
  scale?: boolean
  /** 最大缩放倍率 */
  maxScale?: number
  /** 回弹缓动速度（0-1，越大回弹越快） */
  ease?: number
}>(), {
  strength: 0.25,
  radius: 160,
  scale: true,
  maxScale: 1.06,
  ease: 0.12,
})

const root = ref<HTMLElement | null>(null)
let raf = 0
let cx = 0
let cy = 0
let targetX = 0
let targetY = 0
let targetScale = 1
let scaleNow = 1
let inside = false

function tick() {
  // 指数缓动趋近目标
  const k = props.ease
  cx += (targetX - cx) * k
  cy += (targetY - cy) * k
  scaleNow += (targetScale - scaleNow) * k

  const el = root.value
  if (el) {
    el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${scaleNow.toFixed(4)})`
  }

  // 接近目标后停止动画，省 CPU
  if (Math.abs(targetX - cx) < 0.05 && Math.abs(targetY - cy) < 0.05
    && Math.abs(targetScale - scaleNow) < 0.0005) {
    raf = 0
    return
  }
  raf = requestAnimationFrame(tick)
}

function ensureLoop() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function onMove(e: MouseEvent) {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const mx = e.clientX
  const my = e.clientY

  // 中心点到鼠标的距离
  const rcx = r.left + r.width / 2
  const rcy = r.top + r.height / 2
  const dx = mx - rcx
  const dy = my - rcy
  const dist = Math.hypot(dx, dy)

  if (dist < props.radius) {
    inside = true
    const t = (1 - dist / props.radius) * props.strength
    targetX = dx * t
    targetY = dy * t
    targetScale = props.scale ? 1 + (props.maxScale - 1) * (1 - dist / props.radius) : 1
    ensureLoop()
  } else if (inside) {
    inside = false
    targetX = 0
    targetY = 0
    targetScale = 1
    ensureLoop()
  }
}

function onLeave() {
  inside = false
  targetX = 0
  targetY = 0
  targetScale = 1
  ensureLoop()
}

onMounted(() => {
  const el = root.value
  if (!el) return
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  const el = root.value
  if (el) {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="s-magnetic" :style="{ willChange: 'transform' }">
    <slot />
  </div>
</template>

<style scoped>
.s-magnetic {
  display: inline-block;
  transform: translate3d(0, 0, 0) scale(1);
  transition: none;
}
</style>
