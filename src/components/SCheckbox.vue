<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
}>(), {
  modelValue: false,
  label: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

defineOptions({ name: 'SCheckbox' })

const checked = computed({
  get: () => props.modelValue,
  set: (v: boolean) => {
    emit('update:modelValue', v)
    emit('change', v)
  },
})
</script>

<template>
  <label class="s-check" :class="{ 's-check--disabled': disabled }">
    <input v-model="checked" type="checkbox" :disabled="disabled" />
    <span class="s-check__box" />
    <span v-if="label || $slots.default" class="s-check__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.s-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: var(--s-ink);
}
.s-check input { position: absolute; opacity: 0; pointer-events: none; }
.s-check__box {
  width: 22px;
  height: 22px;
  flex: none;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--s-r-sm);
  transition: all 0.15s;
}
.s-check:hover .s-check__box { box-shadow: var(--s-shadow-raised); }
.s-check input:checked + .s-check__box {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: var(--s-shadow-pressed);
}
.s-check input:checked + .s-check__box::after {
  content: "";
  width: 10px;
  height: 6px;
  border-left: 2.5px solid #fff;
  border-bottom: 2.5px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
}
.s-check input:focus-visible + .s-check__box {
  box-shadow: var(--s-shadow-raised-sm),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 35%, transparent);
}
.s-check--disabled { opacity: 0.5; cursor: not-allowed; }
</style>
