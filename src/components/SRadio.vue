<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey, type RadioGroupCtx } from './radio-group-context'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  value?: string | number
  disabled?: boolean
}>(), {
  modelValue: false,
  label: '',
  value: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

defineOptions({ name: 'SRadio' })

const group = inject<RadioGroupCtx | undefined>(radioGroupKey, undefined)

// 组内模式：由 group 控制选中
const inGroup = computed(() => !!group)
const checked = computed(() =>
  inGroup.value
    ? group!.modelValue === props.value
    : props.modelValue,
)
const disabled = computed(() => props.disabled || (inGroup.value && group!.disabled))

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (inGroup.value) {
    group!.update(props.value)
  } else {
    emit('update:modelValue', target.checked)
  }
}
</script>

<template>
  <label class="s-radio" :class="{ 's-radio--disabled': disabled }">
    <input
      type="radio"
      :name="group?.name"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="s-radio__dot" />
    <span v-if="label || $slots.default" class="s-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.s-radio {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: var(--s-ink);
}
.s-radio input { position: absolute; opacity: 0; pointer-events: none; }
.s-radio__dot {
  width: 22px;
  height: 22px;
  flex: none;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.15s;
}
.s-radio:hover .s-radio__dot { box-shadow: var(--s-shadow-raised); }
.s-radio input:checked + .s-radio__dot {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: var(--s-shadow-pressed);
}
.s-radio input:checked + .s-radio__dot::after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff, #e8f1f8 60%);
}
.s-radio input:focus-visible + .s-radio__dot {
  box-shadow: var(--s-shadow-raised-sm),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 35%, transparent);
}
.s-radio--disabled { opacity: 0.5; cursor: not-allowed; }
</style>
