<script setup lang="ts">
import type { SelectOption } from '../types'

withDefaults(defineProps<{
  modelValue?: string | number
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  options: () => [],
  placeholder: '请选择',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', v: string | number): void
}>()

defineOptions({ name: 'SSelect' })

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <select
    class="s-select"
    :value="modelValue"
    :disabled="disabled"
    @change="onChange"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
    >{{ opt.label }}</option>
  </select>
</template>

<style scoped>
.s-select {
  appearance: none;
  -webkit-appearance: none;
  font-family: var(--s-font);
  font-size: 14px;
  color: var(--s-ink);
  background:
    linear-gradient(45deg, transparent 50%, var(--s-ink-soft) 50%),
    linear-gradient(135deg, var(--s-ink-soft) 50%, transparent 50%),
    var(--s-surface);
  background-position:
    calc(100% - 20px) 55%,
    calc(100% - 15px) 55%,
    0 0;
  background-size: 5px 5px, 5px 5px, 100% 100%;
  background-repeat: no-repeat;
  border: none;
  border-radius: var(--s-r-sm);
  box-shadow: var(--s-shadow-inset);
  padding: 10px 36px 10px 12px;
  outline: none;
  transition: box-shadow 0.15s;
  width: 100%;
  cursor: pointer;
}
.s-select:focus {
  box-shadow: var(--s-shadow-inset),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 30%, transparent);
}
.s-select[disabled] { opacity: 0.55; cursor: not-allowed; }
</style>
