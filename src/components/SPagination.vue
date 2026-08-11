<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  total?: number
  pageSize?: number
  currentPage?: number
  pagerCount?: number
  disabled?: boolean
}>(), {
  total: 0,
  pageSize: 10,
  currentPage: 1,
  pagerCount: 7,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:currentPage', v: number): void
  (e: 'change', v: number): void
}>()

defineOptions({ name: 'SPagination' })

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// 生成页码序列，含省略号占位
const pages = computed<(number | 'prev-more' | 'next-more')[]>(() => {
  const count = pageCount.value
  if (count <= props.pagerCount) {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
  const half = Math.floor(props.pagerCount / 2)
  const current = props.currentPage
  let start = Math.max(1, current - half)
  let end = Math.min(count, start + props.pagerCount - 1)
  if (end - start + 1 < props.pagerCount) {
    start = Math.max(1, end - props.pagerCount + 1)
  }
  const list: (number | 'prev-more' | 'next-more')[] = []
  if (start > 1) {
    list.push(1)
    if (start > 2) list.push('prev-more')
  }
  for (let i = start; i <= end; i++) list.push(i)
  if (end < count) {
    if (end < count - 1) list.push('next-more')
    list.push(count)
  }
  return list
})

function go(page: number) {
  if (props.disabled || page < 1 || page > pageCount.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', page)
}
function jumpBack() { go(Math.max(1, props.currentPage - props.pagerCount)) }
function jumpForward() { go(Math.min(pageCount.value, props.currentPage + props.pagerCount)) }
</script>

<template>
  <nav class="s-pagination" aria-label="分页">
    <button
      class="s-pagination__btn"
      type="button"
      :disabled="disabled || currentPage <= 1"
      @click="go(currentPage - 1)"
    >‹</button>

    <template v-for="p in pages" :key="String(p)">
      <button
        v-if="p !== 'prev-more' && p !== 'next-more'"
        class="s-pagination__btn"
        :class="{ 's-pagination__btn--active': p === currentPage }"
        type="button"
        :disabled="disabled"
        @click="go(p)"
      >{{ p }}</button>
      <button
        v-else
        class="s-pagination__btn s-pagination__btn--more"
        type="button"
        :disabled="disabled"
        :title="p === 'prev-more' ? '向前跳页' : '向后跳页'"
        @click="p === 'prev-more' ? jumpBack() : jumpForward()"
      >⋯</button>
    </template>

    <button
      class="s-pagination__btn"
      type="button"
      :disabled="disabled || currentPage >= pageCount"
      @click="go(currentPage + 1)"
    >›</button>

    <span class="s-pagination__total">共 {{ total }} 条</span>
  </nav>
</template>

<style scoped>
.s-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.s-pagination__btn {
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
  border: none;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--s-font);
  cursor: pointer;
  transition: all 0.12s;
}
.s-pagination__btn:hover { color: var(--s-ink); }
.s-pagination__btn:active { box-shadow: var(--s-shadow-pressed); color: var(--s-ink); }
.s-pagination__btn--active {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 4px 4px 8px var(--s-sh-dark), -4px -4px 8px var(--s-sh-light);
}
.s-pagination__btn--active:active {
  background: var(--s-primary-deep);
  box-shadow: 3px 3px 6px var(--s-sh-dark) inset, -3px -3px 6px var(--s-sh-light) inset;
  color: #fff;
}
.s-pagination__btn--more { font-size: 12px; letter-spacing: 1px; }
.s-pagination__btn[disabled] { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.s-pagination__total {
  font-size: 12px;
  color: var(--s-ink-faint);
  margin-left: 4px;
  font-variant-numeric: tabular-nums;
}
</style>
