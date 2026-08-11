<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  precision?: number
}>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
  disabled: false,
  precision: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

defineOptions({ name: 'SInputNumber' })

const display = computed({
  get: () => String(props.modelValue),
  set: (v: string) => {
    const n = parseFloat(v)
    if (!Number.isNaN(n)) {
      let val = n
      if (props.precision > 0) val = parseFloat(n.toFixed(props.precision))
      val = Math.min(props.max, Math.max(props.min, val))
      emit('update:modelValue', val)
      emit('change', val)
    }
  },
})

function add(delta: number) {
  if (props.disabled) return
  let val = props.modelValue + delta
  if (props.precision > 0) val = parseFloat(val.toFixed(props.precision))
  val = Math.min(props.max, Math.max(props.min, val))
  emit('update:modelValue', val)
  emit('change', val)
}
function stepUp() { add(props.step) }
function stepDown() { add(-props.step) }
</script>

<template>
  <div class="s-input-number" :class="{ 's-input-number--disabled': disabled }">
    <button
      class="s-input-number__btn s-input-number__btn--dec"
      type="button"
      :disabled="disabled || modelValue <= min"
      @click="stepDown"
    >−</button>
    <input
      class="s-input-number__input"
      type="text"
      inputmode="decimal"
      :value="display"
      :disabled="disabled"
      @input="display = ($event.target as HTMLInputElement).value"
    />
    <button
      class="s-input-number__btn s-input-number__btn--inc"
      type="button"
      :disabled="disabled || modelValue >= max"
      @click="stepUp"
    >+</button>
  </div>
</template>

<style scoped>
.s-input-number {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
}
.s-input-number__btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  font-family: var(--s-font);
  transition: all 0.12s;
}
.s-input-number__btn:hover { color: var(--s-ink); }
.s-input-number__btn:active { box-shadow: var(--s-shadow-pressed); color: var(--s-ink); }
.s-input-number__btn[disabled] { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
.s-input-number__input {
  width: 64px;
  border: none;
  background: transparent;
  color: var(--s-ink);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  font-family: var(--s-font);
  outline: none;
  font-variant-numeric: tabular-nums;
}
.s-input-number__input:disabled { opacity: 0.5; cursor: not-allowed; }
.s-input-number--disabled { opacity: 0.6; }
</style>
