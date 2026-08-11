<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultColors?: string[]
  disabled?: boolean
}>(), {
  modelValue: '',
  defaultColors: () => ['#5f86a8', '#6ba3a0', '#b58f5a', '#c96f4a', '#7a6ba8', '#4a8f6b', '#b55a7a', '#8a8a8a'],
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

defineOptions({ name: 'SColorPicker' })

const open = ref(false)

// 预设色 + 最近自定义色
const customColors = ref<string[]>([])
const hue = ref(210)
const sat = ref(70)
const light = ref(60)

function pick(c: string) {
  emit('update:modelValue', c)
  if (!props.defaultColors.includes(c) && !customColors.value.includes(c)) {
    customColors.value.unshift(c)
    if (customColors.value.length > 8) customColors.value.pop()
  }
  open.value = false
}

// 当前 hue 色带
const hueStrip = computed(() => {
  const stops: string[] = []
  for (let h = 0; h <= 360; h += 60) stops.push(`hsl(${h}, 100%, 60%)`)
  return `linear-gradient(to right, ${stops.join(', ')})`
})

// 根据当前 hue 生成的饱和度/亮度面板背景
const svBg = computed(() => {
  return `linear-gradient(to top, #000, hsla(${hue.value}, 100%, 60%, 0)), linear-gradient(to right, #fff, hsla(${hue.value}, 100%, 60%, 0))`
})

const currentHsl = computed(() => `hsl(${hue.value}, ${sat.value}%, ${light.value}%)`)

function onSvClick(e: MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
  sat.value = Math.round(x * 100)
  light.value = Math.round((1 - y) * 100)
  emit('update:modelValue', currentHsl.value)
}

function onHueClick(e: MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  hue.value = Math.round(x * 360)
  emit('update:modelValue', currentHsl.value)
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-colorpicker')
  if (!el) open.value = false
}
document.addEventListener('click', onOutside)
</script>

<template>
  <div class="s-colorpicker" :class="{ 's-colorpicker--open': open }">
    <div class="s-colorpicker__trigger" :class="{ 's-colorpicker__trigger--disabled': disabled }" @click="!disabled && (open = !open)">
      <span class="s-colorpicker__swatch" :style="{ background: modelValue || 'transparent' }" />
      <span class="s-colorpicker__value">{{ modelValue || '选择颜色' }}</span>
      <span class="s-colorpicker__caret">▾</span>
    </div>

    <div v-if="open" class="s-colorpicker__panel" @click.stop>
      <!-- 饱和度/亮度面板 -->
      <div class="s-colorpicker__sv" :style="{ background: svBg }" @click="onSvClick($event, $event.currentTarget as HTMLElement)">
        <span
          class="s-colorpicker__sv-dot"
          :style="{ left: sat + '%', top: (100 - light) + '%', background: currentHsl }"
        />
      </div>
      <!-- 色相条 -->
      <div class="s-colorpicker__hue" :style="{ background: hueStrip }" @click="onHueClick($event, $event.currentTarget as HTMLElement)" />
      <!-- 预设色 -->
      <div class="s-colorpicker__presets">
        <span
          v-for="c in defaultColors"
          :key="c"
          class="s-colorpicker__preset"
          :class="{ 's-colorpicker__preset--active': modelValue === c }"
          :style="{ background: c }"
          @click="pick(c)"
        />
        <span
          v-for="c in customColors"
          :key="'c' + c"
          class="s-colorpicker__preset"
          :style="{ background: c }"
          @click="pick(c)"
        />
      </div>
      <div class="s-colorpicker__footer">
        <span class="s-colorpicker__current" :style="{ background: modelValue }" />
        <code class="s-colorpicker__hex">{{ modelValue || '—' }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-colorpicker { position: relative; display: inline-block; }
.s-colorpicker__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
  min-width: 150px;
  font-size: 13px;
  color: var(--s-ink);
  user-select: none;
}
.s-colorpicker__trigger:hover { box-shadow: var(--s-shadow-inset), 0 0 0 2px var(--s-primary-soft); }
.s-colorpicker__trigger--disabled { opacity: 0.5; cursor: not-allowed; }
.s-colorpicker__swatch {
  width: 20px; height: 20px; border-radius: 6px;
  box-shadow: var(--s-shadow-raised-sm);
  border: 1px solid rgba(0,0,0,0.08);
}
.s-colorpicker__value { font-size: 12px; color: var(--s-ink-soft); }
.s-colorpicker__caret { margin-left: auto; font-size: 11px; color: var(--s-ink-faint); }
.s-colorpicker__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1200;
  width: 220px;
  padding: 12px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 12px 32px var(--s-sh-dark-strong);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.s-colorpicker__sv {
  position: relative;
  height: 120px;
  border-radius: var(--s-r-sm);
  cursor: crosshair;
  box-shadow: var(--s-shadow-inset);
}
.s-colorpicker__sv-dot {
  position: absolute;
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.s-colorpicker__hue {
  height: 14px;
  border-radius: var(--s-r-pill);
  cursor: pointer;
  box-shadow: var(--s-shadow-inset);
}
.s-colorpicker__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.s-colorpicker__preset {
  width: 22px; height: 22px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: var(--s-shadow-raised-sm);
  transition: transform 0.12s;
}
.s-colorpicker__preset:hover { transform: scale(1.15); }
.s-colorpicker__preset--active { outline: 2px solid var(--s-primary); outline-offset: 2px; }
.s-colorpicker__footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.s-colorpicker__current {
  width: 18px; height: 18px;
  border-radius: 4px;
  box-shadow: var(--s-shadow-inset);
}
.s-colorpicker__hex { font-size: 12px; color: var(--s-ink-soft); font-family: ui-monospace, Consolas, monospace; }
</style>
