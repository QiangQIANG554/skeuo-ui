<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
}>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  rows: 4,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

defineOptions({ name: 'STextarea' })

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <textarea
    class="s-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    @input="onInput"
  />
</template>

<style scoped>
.s-textarea {
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
  resize: vertical;
}
.s-textarea::placeholder { color: var(--s-ink-faint); }
.s-textarea:focus {
  box-shadow: var(--s-shadow-inset),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 30%, transparent);
}
.s-textarea[disabled] { opacity: 0.55; cursor: not-allowed; }
</style>
