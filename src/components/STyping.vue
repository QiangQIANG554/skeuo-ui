<script setup lang="ts">
/**
 * STyping — 打字机
 * 文本逐字显示，带闪烁光标；支持循环/停留。
 * 零依赖：setTimeout + CSS 光标动画。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标文本 */
  text: string
  /** 打字速度（每字 ms） */
  speed?: number
  /** 是否显示光标 */
  cursor?: boolean
  /** 完成后是否循环重打 */
  loop?: boolean
  /** 循环间停留 ms */
  pause?: number
  /** 开始前延迟 ms */
  startDelay?: number
}>(), {
  text: '',
  speed: 60,
  cursor: true,
  loop: false,
  pause: 2000,
  startDelay: 0,
})

const el = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let cancelled = false

function type() {
  if (cancelled) return
  const node = el.value
  if (!node) return
  const target = props.text
  let i = 0

  function step() {
    if (cancelled) return
    if (!node) return
    i++
    node.textContent = target.slice(0, i)
    if (i < target.length) {
      timer = setTimeout(step, props.speed)
    } else if (props.loop) {
      timer = setTimeout(() => {
        if (!node) return
        node.textContent = ''
        i = 0
        step()
      }, props.pause)
    }
  }

  if (node) node.textContent = ''
  i = 0
  timer = setTimeout(step, props.startDelay)
}

watch(() => props.text, () => {
  if (timer) clearTimeout(timer)
  type()
}, { flush: 'post' })

onMounted(() => {
  type()
})

onBeforeUnmount(() => {
  cancelled = true
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <span ref="el" class="s-typing">
    <slot />
  </span>
</template>

<style scoped>
.s-typing {
  font-variant-numeric: tabular-nums;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
