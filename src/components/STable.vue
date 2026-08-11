<script setup lang="ts">
import { computed } from 'vue'

export interface TableColumn {
  prop: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  slotName?: string
}

const props = withDefaults(defineProps<{
  data?: Record<string, any>[]
  columns?: TableColumn[]
  stripe?: boolean
  borderless?: boolean
}>(), {
  data: () => [],
  columns: () => [],
  stripe: true,
  borderless: false,
})

defineOptions({ name: 'STable' })

// 支持两种用法：
// 1. columns prop 驱动（推荐）
// 2. 默认插槽放 STableColumn（此处简化：仅支持 prop 方式）
function cellValue(row: Record<string, any>, col: TableColumn) {
  return row[col.prop]
}

const hasData = computed(() => props.data.length > 0)
</script>

<template>
  <div class="s-table-wrap" :class="{ 's-table-wrap--borderless': borderless }">
    <table class="s-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.prop"
            :style="{ width: col.width, textAlign: col.align ?? 'left' }"
          >{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in data" :key="ri" :class="{ 's-table__row--stripe': stripe && ri % 2 === 1 }">
          <td
            v-for="col in columns"
            :key="col.prop"
            :style="{ textAlign: col.align ?? 'left' }"
          >
            <slot :name="col.slotName" :row="row" :column="col" :value="cellValue(row, col)">
              {{ cellValue(row, col) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!hasData" class="s-table__empty">
      <slot name="empty">暂无数据</slot>
    </div>
  </div>
</template>

<style scoped>
.s-table-wrap {
  width: 100%;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  overflow: hidden;
  padding: 4px;
}
.s-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.s-table th {
  text-align: left;
  padding: 11px 14px;
  font-weight: 600;
  color: var(--s-ink-soft);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  white-space: nowrap;
}
.s-table th:first-child { border-radius: var(--s-r-sm) 0 0 var(--s-r-sm); }
.s-table th:last-child { border-radius: 0 var(--s-r-sm) var(--s-r-sm) 0; }
.s-table td {
  padding: 10px 14px;
  color: var(--s-ink);
  border-bottom: 1px solid var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
}
.s-table__row--stripe td {
  background: color-mix(in srgb, var(--s-surface-2) 55%, transparent);
}
.s-table tbody tr:last-child td { border-bottom: none; box-shadow: none; }
.s-table__empty {
  padding: var(--s-sp-6);
  text-align: center;
  color: var(--s-ink-faint);
  font-size: 13px;
}
</style>
