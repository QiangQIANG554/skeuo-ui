<script setup lang="ts">
/**
 * SParallax — 鼠标视差
 * 容器内多层元素按不同速度随鼠标移动，营造深度感。
 * 用法：<SParallax><div data-depth="0.3">前景</div><div data-depth="-0.2">背景</div></SParallax>
 * 零依赖：transform + requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 最大位移（px） */
  maxShift?: number
  /** 惯性（0-1，越大跟随越快） */
  ease?: number
}>(), {
  maxShift: 24,
  ease: 0.1,
})

const root = ref<HTMLElement | null>(null)
let raf = 0
let mouseX = 0
let mouseY = 0
let curX = 0
let curY = 0
let layers: { el: HTMLElement; depth: number }[] = []

function collect() {
  const node = root.value
  if (!node) return
  layers = []
  node.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
    const depth = parseFloat(el.dataset.depth || '0')
    layers.push({ el, depth })
  })
}

function onMove(e: MouseEvent) {
  const node = root.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  // 归一化鼠标位置 -1..1（相对容器中心）
  mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  if (!raf) raf = requestAnimationFrame(tick)
}

function tick() {
  raf = 0
  curX += (mouseX - curX) * props.ease
  curY += (mouseY - curY) * props.ease

  for (const layer of layers) {
    const shift = props.maxShift * layer.depth
    layer.el.style.transform = `translate3d(${curX * shift}px, ${curY * shift}px, 0)`
  }

  // 接近目标后停止
  if (Math.abs(mouseX - curX) > 0.001 || Math.abs(mouseY - curY) > 0.001) {
    raf = requestAnimationFrame(tick)
  }
}

function onLeave() {
  mouseX = 0
  mouseY = 0
  if (!raf) raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const node = root.value
  if (!node) return
  collect()
  node.addEventListener('mousemove', onMove)
  node.addEventListener('mouseleave', onLeave)
  // 观察插槽变化（子元素增删时重新收集）
  const obs = new MutationObserver(collect)
  obs.observe(node, { childList: true, subtree: true })
  ;(node as any).__parallaxObs = obs
})

onBeforeUnmount(() => {
  const node = root.value
  if (node) {
    node.removeEventListener('mousemove', onMove)
    node.removeEventListener('mouseleave', onLeave)
    ;(node as any).__parallaxObs?.disconnect()
  }
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="s-parallax">
    <slot />
  </div>
</template>

<style scoped>
.s-parallax {
  position: relative;
  overflow: hidden;
}
</style>
