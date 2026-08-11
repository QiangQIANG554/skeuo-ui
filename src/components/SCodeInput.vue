<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  length?: number
  numeric?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  length: 6,
  numeric: true,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'complete', v: string): void
}>()

defineOptions({ name: 'SCodeInput' })

// 内部格值数组，与 modelValue 双向同步
const values = ref<string[]>(props.modelValue.split('').slice(0, props.length))
const focusIndex = ref(-1)

watch(() => props.modelValue, (v) => {
  const next = v.split('').slice(0, props.length)
  for (let i = 0; i < props.length; i++) {
    values.value[i] = next[i] ?? ''
  }
})

function sync() {
  const v = values.value.join('')
  emit('update:modelValue', v)
  if (v.length === props.length) emit('complete', v)
}

function cleanChar(raw: string): string {
  let ch = raw.slice(-1)
  if (props.numeric) ch = ch.replace(/\D/g, '')
  return ch
}

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  let ch = cleanChar(el.value)
  if (!ch) {
    values.value[i] = ''
    sync()
    return
  }
  // 只保留一位（若粘贴进来多位则只取最后一位）
  values.value[i] = ch
  sync()
  // 自动跳到下一格
  if (i < props.length - 1) {
    focusIndex.value = i + 1
    nextTickFocus(i + 1)
  } else {
    el.blur()
  }
}

function onKeydown(i: number, e: KeyboardEvent) {
  // Backspace：当前格为空则回退上一格
  if (e.key === 'Backspace') {
    if (!values.value[i] && i > 0) {
      focusIndex.value = i - 1
      nextTickFocus(i - 1)
    }
    return
  }
  // 方向键移动
  if (e.key === 'ArrowLeft' && i > 0) {
    focusIndex.value = i - 1
    nextTickFocus(i - 1)
  }
  if (e.key === 'ArrowRight' && i < props.length - 1) {
    focusIndex.value = i + 1
    nextTickFocus(i + 1)
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = (e.clipboardData?.getData('text') ?? '').trim()
  if (!text) return
  let chars = props.numeric ? text.replace(/\D/g, '') : text
  chars = chars.slice(0, props.length)
  for (let i = 0; i < props.length; i++) {
    values.value[i] = chars[i] ?? ''
  }
  // 粘贴后聚焦到最后一个有效格的下一位
  const fillTo = Math.min(chars.length, props.length - 1)
  focusIndex.value = fillTo
  sync()
  if (chars.length === props.length) {
    nextTickFocus(props.length - 1)
    const el = document.querySelector<HTMLInputElement>('.s-code__cell--focus')
    el?.blur()
  } else {
    nextTickFocus(fillTo)
  }
}

function nextTickFocus(i: number) {
  requestAnimationFrame(() => {
    const cell = cellEls.value[i]
    cell?.focus()
    cell?.select()
  })
}

const cellEls = ref<HTMLInputElement[]>([])

const displayChars = computed(() => {
  const arr: string[] = []
  for (let i = 0; i < props.length; i++) arr.push(values.value[i] ?? '')
  return arr
})
</script>

<template>
  <div class="s-code" :class="{ 's-code--disabled': disabled }">
    <input
      v-for="(_, i) in length"
      :key="i"
      :ref="(el) => { if (el) (cellEls as any)[i] = el }"
      class="s-code__cell"
      :class="{
        's-code__cell--filled': displayChars[i] !== '',
        's-code__cell--focus': i === focusIndex,
      }"
      type="text"
      :inputmode="numeric ? 'numeric' : 'text'"
      autocomplete="one-time-code"
      :maxlength="1"
      :value="displayChars[i]"
      :disabled="disabled"
      :aria-label="`第 ${i + 1} 位验证码`"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @focus="focusIndex = i"
      @paste="onPaste"
    />
  </div>
</template>

<style scoped>
.s-code {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.s-code__cell {
  width: 46px;
  height: 52px;
  border: none;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  font-family: var(--s-font-serif);
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: var(--s-ink);
  caret-color: var(--s-primary);
  outline: none;
  transition: box-shadow 0.15s, background 0.15s, color 0.15s;
}
.s-code__cell--filled {
  color: var(--s-primary);
}
.s-code__cell--focus {
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-code__cell::placeholder {
  color: var(--s-ink-faint);
}
.s-code--disabled .s-code__cell {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
