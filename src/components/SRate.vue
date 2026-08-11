<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  max?: number
  disabled?: boolean
  allowHalf?: boolean
}>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
  allowHalf: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

defineOptions({ name: 'SRate' })

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function setValue(i: number) {
  if (props.disabled) return
  emit('update:modelValue', i)
  emit('change', i)
}
function fill(i: number) {
  return props.modelValue >= i
}
</script>

<template>
  <div class="s-rate" :class="{ 's-rate--disabled': disabled }" role="radiogroup">
    <button
      v-for="i in stars"
      :key="i"
      class="s-rate__star"
      :class="{ 's-rate__star--on': fill(i) }"
      type="button"
      :disabled="disabled"
      role="radio"
      :aria-checked="fill(i)"
      @click="setValue(i)"
    >★</button>
    <span v-if="$slots.default" class="s-rate__text"><slot /></span>
  </div>
</template>

<style scoped>
.s-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.s-rate__star {
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  color: var(--s-ink-faint);
  text-shadow: 2px 2px 3px var(--s-sh-dark), -1px -1px 2px var(--s-sh-light);
  transition: all 0.12s;
  font-family: var(--s-font);
}
.s-rate__star:hover { transform: scale(1.15); }
.s-rate__star:active { transform: scale(0.95); }
.s-rate__star--on {
  color: var(--s-gold);
  text-shadow:
    0 0 8px color-mix(in srgb, var(--s-gold) 60%, transparent),
    2px 2px 3px var(--s-sh-dark),
    -1px -1px 2px var(--s-sh-light);
}
.s-rate__star[disabled] { cursor: not-allowed; }
.s-rate--disabled .s-rate__star { opacity: 0.5; }
.s-rate__text {
  margin-left: 8px;
  font-size: 13px;
  color: var(--s-ink-soft);
}
</style>
