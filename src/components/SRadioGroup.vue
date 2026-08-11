<script setup lang="ts">
import { provide } from 'vue'
import { radioGroupKey, type RadioGroupCtx } from './radio-group-context'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  disabled?: boolean
}>(), {
  modelValue: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', v: string | number): void
}>()

defineOptions({ name: 'SRadioGroup' })

const ctx: RadioGroupCtx = {
  name: `s-radio-${Math.random().toString(36).slice(2, 8)}`,
  modelValue: props.modelValue,
  disabled: props.disabled,
  update: (v) => {
    emit('update:modelValue', v)
    emit('change', v)
  },
}
provide(radioGroupKey, ctx)
</script>

<template>
  <div class="s-radio-group" role="radiogroup">
    <slot />
  </div>
</template>

<style scoped>
.s-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
