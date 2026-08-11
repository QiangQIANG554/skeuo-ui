<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  modelValue: '',
  placeholder: '搜索…',
  disabled: false,
  clearable: true,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'search', keyword: string): void
  (e: 'clear'): void
}>()

defineOptions({ name: 'SSearch' })

// 内部兜底文本：未绑 v-model 时也能正常工作
const localText = ref(props.modelValue)
watch(() => props.modelValue, (v) => { localText.value = v })

const inputEl = ref<HTMLInputElement | null>(null)

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  localText.value = v
  emit('update:modelValue', v)
}
function doSearch() {
  emit('search', localText.value)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') doSearch()
}
function onClear() {
  localText.value = ''
  emit('update:modelValue', '')
  emit('clear')
  inputEl.value?.focus()
}
</script>

<template>
  <div class="s-search" :class="`s-search--${size}`">
    <span class="s-search__icon">⌕</span>
    <input
      ref="inputEl"
      class="s-search__input"
      :value="localText"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button
      v-if="clearable && localText"
      class="s-search__clear"
      type="button"
      tabindex="-1"
      aria-label="清空"
      @click="onClear"
    >✕</button>
    <button class="s-search__btn" type="button" :disabled="disabled" @click="doSearch">
      搜索
    </button>
  </div>
</template>

<style scoped>
.s-search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 12px;
  border-radius: var(--s-r-pill);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  width: 100%;
  max-width: 420px;
}
.s-search__icon {
  color: var(--s-ink-faint);
  font-size: 16px;
  line-height: 1;
  user-select: none;
}
.s-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--s-ink);
  font-size: 14px;
  font-family: var(--s-font);
  outline: none;
  padding: 6px 0;
}
.s-search__input::placeholder { color: var(--s-ink-faint); }
.s-search__input[disabled] { opacity: 0.55; cursor: not-allowed; }
.s-search__clear {
  flex: none;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
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
.s-search__clear:hover { color: var(--s-danger); }
.s-search__btn {
  flex: none;
  border: none;
  border-radius: var(--s-r-pill);
  padding: 7px 18px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--s-font);
  color: #f7fafc;
  cursor: pointer;
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: 3px 3px 6px var(--s-sh-dark), -3px -3px 6px var(--s-sh-light);
  transition: all 0.12s;
}
.s-search__btn:active {
  background: var(--s-primary-deep);
  box-shadow: 3px 3px 6px var(--s-sh-dark) inset, -3px -3px 6px var(--s-sh-light) inset;
}
.s-search__btn[disabled] { opacity: 0.5; cursor: not-allowed; }
.s-search--sm { max-width: 280px; }
.s-search--lg { max-width: 560px; }
.s-search--lg .s-search__input { font-size: 15px; }
.s-search--lg .s-search__btn { padding: 9px 24px; font-size: 14px; }
</style>
