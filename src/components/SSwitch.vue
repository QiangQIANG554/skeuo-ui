<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
}>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

defineOptions({ name: 'SSwitch' })

const checked = computed({
  get: () => props.modelValue,
  set: (v: boolean) => {
    emit('update:modelValue', v)
    emit('change', v)
  },
})
</script>

<template>
  <label class="s-switch" :class="{ 's-switch--disabled': disabled }">
    <input v-model="checked" type="checkbox" :disabled="disabled" />
    <span class="s-switch__track" />
    <span class="s-switch__knob" />
  </label>
</template>

<style scoped>
.s-switch {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 30px;
  flex: none;
  cursor: pointer;
}
.s-switch input { position: absolute; opacity: 0; }
.s-switch__track {
  position: absolute;
  inset: 0;
  background: var(--s-surface);
  border-radius: var(--s-r-pill);
  box-shadow: var(--s-shadow-inset);
  transition: background 0.2s;
}
.s-switch__knob {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.s-switch input:checked + .s-switch__track {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: var(--s-shadow-pressed);
}
.s-switch input:checked ~ .s-switch__knob { transform: translateX(24px); }
.s-switch input:focus-visible + .s-switch__track {
  box-shadow: var(--s-shadow-inset),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 35%, transparent);
}
.s-switch--disabled { opacity: 0.5; cursor: not-allowed; }
</style>
