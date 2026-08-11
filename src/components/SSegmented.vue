<script setup lang="ts">
export interface SegmentedOption {
  label: string
  value: string | number
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options?: SegmentedOption[]
  disabled?: boolean
}>(), {
  modelValue: '',
  options: () => [],
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', v: string | number): void
}>()

defineOptions({ name: 'SSegmented' })

function select(opt: SegmentedOption) {
  if (props.disabled || opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
}
</script>

<template>
  <div class="s-segmented" :class="{ 's-segmented--disabled': disabled }" role="tablist">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="s-segmented__item"
      :class="{ 's-segmented__item--active': modelValue === opt.value }"
      type="button"
      :disabled="disabled || opt.disabled"
      role="tab"
      :aria-selected="modelValue === opt.value"
      @click="select(opt)"
    >
      <span v-if="opt.icon" class="s-segmented__icon">{{ opt.icon }}</span>
      <span class="s-segmented__label">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.s-segmented {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
}
.s-segmented__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: none;
  border-radius: var(--s-r-sm);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--s-font);
  color: var(--s-ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s;
}
.s-segmented__item:hover { color: var(--s-ink); }
.s-segmented__item--active {
  color: var(--s-ink);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-segmented__icon { font-size: 14px; line-height: 1; }
.s-segmented__item[disabled] { opacity: 0.4; cursor: not-allowed; }
.s-segmented--disabled { opacity: 0.6; }
</style>
