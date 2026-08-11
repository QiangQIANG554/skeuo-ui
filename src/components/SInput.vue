<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'password' | 'number'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'clear'): void
}>()

defineOptions({ name: 'SInput' })

const classes = computed(() => ['s-input', { 's-input--disabled': props.disabled }])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="s-input-wrap" :class="classes">
    <input
      class="s-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
    />
    <button
      v-if="clearable && modelValue && !disabled"
      class="s-input__clear"
      tabindex="-1"
      type="button"
      aria-label="清空"
      @click="onClear"
    >✕</button>
  </div>
</template>

<style scoped>
.s-input-wrap {
  position: relative;
  width: 100%;
  display: inline-flex;
}
.s-input__inner {
  font-family: var(--s-font);
  font-size: 14px;
  color: var(--s-ink);
  background: var(--s-surface);
  border: none;
  border-radius: var(--s-r-sm);
  box-shadow: var(--s-shadow-inset);
  padding: 10px 12px;
  outline: none;
  transition: box-shadow 0.15s;
  width: 100%;
}
.s-input__inner::placeholder { color: var(--s-ink-faint); }
.s-input__inner:focus {
  box-shadow: var(--s-shadow-inset),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 30%, transparent);
}
.s-input__inner[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
.s-input-wrap.s-input--disabled .s-input__inner { opacity: 0.55; cursor: not-allowed; }

.s-input__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-faint);
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.s-input__clear:hover { color: var(--s-danger); }
</style>
