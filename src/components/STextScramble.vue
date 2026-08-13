<script setup lang="ts">
/**
 * STextScramble — 文字乱码解码
 * 目标文本逐字符从随机字符解码为最终内容，支持循环动画。
 * 零依赖：requestAnimationFrame。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标文本 */
  text: string
  /** 乱码字符集（默认 ASCII 全字符） */
  charset?: string
  /** 解码速度：越大越快 */
  speed?: number
  /** 是否循环播放（循环时每次重新乱码再解码） */
  loop?: boolean
  /** 循环间隔 ms */
  loopDelay?: number
  /** 完成后是否保留最终文本（loop=false 时始终保留） */
  keep?: boolean
}>(), {
  text: '',
  charset: '!<>-_\\/[]{}—=+*^?#________',
  speed: 1,
  loop: false,
  loopDelay: 2000,
  keep: true,
})

const el = ref<HTMLElement | null>(null)
let raf = 0
let frame = 0
let timer: ReturnType<typeof setTimeout> | null = null
let cancelled = false

function randomChar(): string {
  const charset = props.charset
  return charset[Math.floor(Math.random() * charset.length)]
}

function animate() {
  if (cancelled) return
  const node = el.value
  if (!node) return

  const target = props.text
  const progress = frame * props.speed
  // 每个字符完成解码的时间点不同：前半段先解码前面的字符
  let out = ''
  for (let i = 0; i < target.length; i++) {
    if (target[i] === ' ') {
      out += ' '
      continue
    }
    const charDone = progress - i * 4
    if (charDone >= 30) {
      out += target[i]
    } else if (charDone >= 0) {
      out += randomChar()
    } else {
      out += ' '
    }
  }
  node.textContent = out
  frame++

  const allDone = target.length === 0 || (() => {
    for (let i = 0; i < target.length; i++) {
      if (target[i] !== ' ' && frame * props.speed - i * 4 < 30) return false
    }
    return true
  })()

  if (!allDone) {
    raf = requestAnimationFrame(animate)
  } else {
    // 完成：显示最终文本
    node.textContent = target
    if (props.loop) {
      timer = setTimeout(() => {
        frame = 0
        raf = requestAnimationFrame(animate)
      }, props.loopDelay)
    }
  }
}

function play() {
  cancelled = false
  if (timer) { clearTimeout(timer); timer = null }
  if (raf) cancelAnimationFrame(raf)
  frame = 0
  raf = requestAnimationFrame(animate)
}

watch(() => props.text, () => play(), { flush: 'post' })

onMounted(() => {
  play()
})

onBeforeUnmount(() => {
  cancelled = true
  if (raf) cancelAnimationFrame(raf)
  if (timer) clearTimeout(timer)
})

defineExpose({ play })
</script>

<template>
  <span ref="el" class="s-text-scramble"><slot>{{ text }}</slot></span>
</template>

<style scoped>
.s-text-scramble {
  font-variant-numeric: tabular-nums;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
