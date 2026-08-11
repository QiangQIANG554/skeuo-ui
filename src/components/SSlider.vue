<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  modelValue2?: number      // Range 模式第二个值
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  range?: boolean
}>(), {
  modelValue: 0,
  modelValue2: 100,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  range: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'update:modelValue2', v: number): void
  (e: 'change', v: number): void
}>()

defineOptions({ name: 'SSlider' })

// ---- 单滑块 ----
const value = computed({
  get: () => props.modelValue,
  set: (v: number) => {
    emit('update:modelValue', v)
    emit('change', v)
  },
})
const trackFill = computed(() => {
  const pct = ((props.modelValue - props.min) / (props.max - props.min)) * 100
  return `${Math.max(0, Math.min(100, pct))}%`
})

// ---- Range 双滑块 ----
const lo = ref(props.modelValue)
const hi = ref(props.modelValue2)
const rangeStyle = computed(() => {
  const a = Math.min(lo.value, hi.value)
  const b = Math.max(lo.value, hi.value)
  const left = ((a - props.min) / (props.max - props.min)) * 100
  const width = ((b - a) / (props.max - props.min)) * 100
  return { left: `${Math.max(0, Math.min(100, left))}%`, width: `${Math.max(0, Math.min(100, width))}%` }
})
function onLo(e: Event) {
  lo.value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', lo.value)
}
function onHi(e: Event) {
  hi.value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue2', hi.value)
}
</script>

<template>
  <!-- ============ Range 双滑块 ============ -->
  <div v-if="range" class="s-slider s-slider--range" :class="{ 's-slider--disabled': disabled }">
    <div class="s-slider__track">
      <div class="s-slider__fill" :style="rangeStyle" />
    </div>
    <input
      class="s-slider__input s-slider__input--lo"
      type="range"
      :min="min" :max="max" :step="step"
      :value="lo"
      :disabled="disabled"
      @input="onLo"
    />
    <input
      class="s-slider__input s-slider__input--hi"
      type="range"
      :min="min" :max="max" :step="step"
      :value="hi"
      :disabled="disabled"
      @input="onHi"
    />
  </div>

  <!-- ============ 单滑块 ============ -->
  <div v-else class="s-slider" :class="{ 's-slider--disabled': disabled }">
    <div class="s-slider__track">
      <div class="s-slider__fill" :style="{ width: trackFill }" />
    </div>
    <input
      class="s-slider__input"
      type="range"
      :min="min" :max="max" :step="step"
      :value="modelValue"
      :disabled="disabled"
      @input="value = Number(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.s-slider {
  position: relative;
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
}
.s-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  border-radius: var(--s-r-pill);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.s-slider__fill {
  position: absolute;
  height: 100%;
  border-radius: var(--s-r-pill);
  background: linear-gradient(90deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: 0 0 6px color-mix(in srgb, var(--s-primary) 35%, transparent);
  transition: width 0.1s, left 0.1s;
}
.s-slider__input {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  z-index: 1;
  width: 100%;
  height: 28px;
  background: transparent;
  cursor: pointer;
  margin: 0;
}
.s-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  transition: transform 0.1s;
}
.s-slider__input:active::-webkit-slider-thumb {
  transform: scale(0.92);
  box-shadow: var(--s-shadow-pressed);
}
.s-slider__input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
}
.s-slider__input:focus-visible {
  outline: none;
  border-radius: var(--s-r-pill);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-primary) 35%, transparent);
}
.s-slider--disabled { opacity: 0.5; }
.s-slider--disabled .s-slider__input { cursor: not-allowed; }

/* Range 模式：两个滑块叠在同一轨道，透明底 + 可见手柄 */
.s-slider--range .s-slider__input {
  position: absolute;
  inset: 0;
  background: transparent;
}
.s-slider--range .s-slider__input--lo { z-index: 2; }
.s-slider--range .s-slider__input--hi { z-index: 1; }
.s-slider--range .s-slider__input::-webkit-slider-thumb {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  border: 3px solid var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
</style>
