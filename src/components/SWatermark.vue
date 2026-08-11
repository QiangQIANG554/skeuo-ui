<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  content?: string
  fontSize?: number
  color?: string
  rotate?: number
  gap?: number
  opacity?: number
  fullscreen?: boolean
}>(), {
  content: '保密',
  fontSize: 14,
  color: 'rgba(0,0,0,0.1)',
  rotate: -25,
  gap: 100,
  opacity: 1,
  fullscreen: false,
})

defineOptions({ name: 'SWatermark' })

const el = ref<HTMLElement | null>(null)
const wrap = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

function render() {
  const node = el.value
  if (!node) return
  const canvas = document.createElement('canvas')
  const text = props.content
  const font = `${props.fontSize}px sans-serif`
  // 估算文本宽度决定画布大小
  const ctx = canvas.getContext('2d')!
  ctx.font = font
  const w = ctx.measureText(text).width + props.gap * 0.6
  const h = props.fontSize * 2 + props.gap * 0.5
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.font = font
  ctx.globalAlpha = props.opacity
  ctx.fillStyle = props.color
  ctx.translate(w / 2, h / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 0)

  node.style.backgroundImage = `url(${canvas.toDataURL()})`
  node.style.backgroundRepeat = 'repeat'
  node.style.backgroundSize = `${w}px ${h}px`
}

watch(() => [props.content, props.fontSize, props.color, props.rotate, props.gap, props.opacity], () => render())

onMounted(() => {
  render()
  if (typeof ResizeObserver !== 'undefined' && el.value) {
    ro = new ResizeObserver(() => render())
    ro.observe(el.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
})

// 通过 expose 让外部可以重新渲染
defineExpose({ render })
</script>

<template>
  <div ref="wrap" class="s-watermark" :class="{ 's-watermark--fullscreen': fullscreen }">
    <div v-if="!fullscreen" ref="el" class="s-watermark__layer" />
    <div v-if="fullscreen" ref="el" class="s-watermark__layer s-watermark__layer--fixed" />
    <div class="s-watermark__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-watermark { position: relative; }
.s-watermark--fullscreen { min-height: 100%; }
.s-watermark__layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.s-watermark__layer--fixed {
  position: fixed;
  z-index: 9999;
  inset: 0;
}
.s-watermark__content { position: relative; z-index: 2; }
</style>
