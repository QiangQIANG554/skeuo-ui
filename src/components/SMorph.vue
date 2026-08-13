<script setup lang="ts">
/**
 * SMorph — 形状变形
 * 元素形状在 圆 ↔ 方 ↔ 三角 之间平滑变形，可自动循环或按状态切换。
 * 零依赖：CSS border-radius + clip-path 过渡。
 */
import { computed, ref, watch } from 'vue'

type MorphShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star'

const props = withDefaults(defineProps<{
  /** 当前形状 */
  shape?: MorphShape
  /** 是否自动循环变形 */
  auto?: boolean
  /** 自动循环间隔 ms */
  interval?: number
  /** 变形过渡时长 ms */
  duration?: number
  /** 背景色（默认主题主色） */
  color?: string
  /** 尺寸（px，宽高同值） */
  size?: number
}>(), {
  shape: 'circle',
  auto: false,
  interval: 2000,
  duration: 500,
  color: '',
  size: 72,
})

const SHAPES: MorphShape[] = ['circle', 'square', 'triangle', 'diamond', 'star']
let timer: ReturnType<typeof setTimeout> | null = null

const current = ref<MorphShape>(props.shape)

// 各形状的 clip-path / border-radius 组合
const shapeStyle = computed(() => {
  const s = current.value
  const size = props.size
  switch (s) {
    case 'circle':
      return { borderRadius: '50%', clipPath: 'none' }
    case 'square':
      return { borderRadius: '16%', clipPath: 'none' }
    case 'triangle':
      return { borderRadius: '0%', clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)` }
    case 'diamond':
      return { borderRadius: '8%', clipPath: `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)` }
    case 'star':
      return { borderRadius: '0%', clipPath: starPath(size) }
  }
})

function starPath(size: number): string {
  const c = size / 2
  const R = c
  const r = c * 0.45
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const rad = (i * Math.PI) / 5 - Math.PI / 2
    const rr = i % 2 === 0 ? R : r
    pts.push(`${(c + Math.cos(rad) * rr).toFixed(2)}% ${(c + Math.sin(rad) * rr).toFixed(2)}%`)
  }
  return `polygon(${pts.join(', ')})`
}

function next() {
  const idx = SHAPES.indexOf(current.value)
  current.value = SHAPES[(idx + 1) % SHAPES.length]
  if (props.auto) timer = setTimeout(next, props.interval)
}

watch(() => props.shape, (v) => { current.value = v })
watch(current, () => {
  if (!props.auto && timer) clearTimeout(timer)
})

function resolveColor(): string {
  if (props.color) return props.color
  const cs = getComputedStyle(document.documentElement)
  return cs.getPropertyValue('--s-primary').trim() || '#5f86a8'
}
</script>

<template>
  <div
    class="s-morph"
    :style="{
      width: `${props.size}px`,
      height: `${props.size}px`,
      background: resolveColor(),
      transition: `border-radius ${props.duration}ms ease, clip-path ${props.duration}ms ease, transform ${props.duration}ms ease`,
      ...shapeStyle,
    }"
    @click="auto ? null : next()"
  />
</template>

<style scoped>
.s-morph {
  display: inline-block;
  cursor: pointer;
}
</style>
