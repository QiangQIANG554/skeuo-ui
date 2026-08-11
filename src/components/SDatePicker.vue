<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '选择日期',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

defineOptions({ name: 'SDatePicker' })

const open = ref(false)
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth()) // 0-11

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

function pad(n: number) { return String(n).padStart(2, '0') }
function fmt(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}` }

// 当前视图月的所有日期格子（含前后月补位）
const grid = computed<{ day: number; month: number; year: number; inView: boolean }[]>(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const startWeek = firstDay.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells: { day: number; month: number; year: number; inView: boolean }[] = []

  const prevMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = startWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const m = viewMonth.value === 0 ? 11 : viewMonth.value - 1
    const y = viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value
    cells.push({ day: d, month: m, year: y, inView: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth.value, year: viewYear.value, inView: true })
  }
  const tail = 7 - (cells.length % 7 || 7)
  for (let d = 1; d <= tail; d++) {
    const m = viewMonth.value === 11 ? 0 : viewMonth.value + 1
    const y = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value
    cells.push({ day: d, month: m, year: y, inView: false })
  }
  return cells
})

const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

function isToday(cell: { day: number; month: number; year: number }) {
  const now = new Date()
  return cell.year === now.getFullYear() && cell.month === now.getMonth() && cell.day === now.getDate()
}
function isSelected(cell: { day: number; month: number; year: number }) {
  return props.modelValue === fmt(cell.year, cell.month, cell.day)
}

function select(cell: { day: number; month: number; year: number; inView: boolean }) {
  const v = fmt(cell.year, cell.month, cell.day)
  emit('update:modelValue', v)
  emit('change', v)
  open.value = false
}

function toggle() {
  if (props.disabled) return
  if (!open.value && props.modelValue) {
    const [y, m] = props.modelValue.split('-').map(Number)
    if (y && m) { viewYear.value = y; viewMonth.value = m - 1 }
  }
  open.value = !open.value
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-datepicker')
  if (!el) open.value = false
}
document.addEventListener('click', onOutside)
onBeforeUnmount(() => {
  document.removeEventListener('click', onOutside)
})
</script>

<template>
  <div class="s-datepicker">
    <div class="s-datepicker__trigger" @click="toggle">
      <span class="s-datepicker__icon">📅</span>
      <input
        class="s-datepicker__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
      />
      <span class="s-datepicker__caret">▾</span>
    </div>

    <Transition name="dp">
      <div v-if="open" class="s-datepicker__panel">
        <div class="s-datepicker__nav">
          <button class="s-datepicker__nav-btn" type="button" @click="prevMonth">‹</button>
          <span class="s-datepicker__nav-label">{{ monthLabel }}</span>
          <button class="s-datepicker__nav-btn" type="button" @click="nextMonth">›</button>
        </div>
        <div class="s-datepicker__week">
          <span v-for="w in WEEK" :key="w" class="s-datepicker__week-cell">{{ w }}</span>
        </div>
        <div class="s-datepicker__grid">
          <button
            v-for="(cell, i) in grid"
            :key="i"
            class="s-datepicker__cell"
            :class="{
              's-datepicker__cell--outside': !cell.inView,
              's-datepicker__cell--today': isToday(cell),
              's-datepicker__cell--selected': isSelected(cell),
            }"
            type="button"
            @click="select(cell)"
          >{{ cell.day }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.s-datepicker {
  position: relative;
  display: inline-block;
  width: 100%;
}
.s-datepicker__trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
}
.s-datepicker__icon { font-size: 14px; line-height: 1; }
.s-datepicker__input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--s-ink);
  font-size: 14px;
  font-family: var(--s-font);
  outline: none;
  cursor: pointer;
}
.s-datepicker__input::placeholder { color: var(--s-ink-faint); }
.s-datepicker__input[disabled] { opacity: 0.55; cursor: not-allowed; }
.s-datepicker__caret { color: var(--s-ink-faint); font-size: 12px; }
.s-datepicker__panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 2000;
  width: 280px;
  padding: 14px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 8px 24px var(--s-sh-dark-strong);
  color: var(--s-ink);
}
.s-datepicker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.s-datepicker__nav-label { font-size: 14px; font-weight: 700; }
.s-datepicker__nav-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  cursor: pointer;
  font-size: 14px;
  font-family: var(--s-font);
}
.s-datepicker__nav-btn:active { box-shadow: var(--s-shadow-pressed); }
.s-datepicker__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}
.s-datepicker__week-cell {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--s-ink-faint);
  padding: 4px 0;
}
.s-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.s-datepicker__cell {
  height: 30px;
  border: none;
  border-radius: var(--s-r-sm);
  background: transparent;
  color: var(--s-ink);
  font-size: 13px;
  font-family: var(--s-font);
  cursor: pointer;
  transition: all 0.1s;
}
.s-datepicker__cell:hover { background: var(--s-surface-2); box-shadow: var(--s-shadow-inset); }
.s-datepicker__cell--outside { color: var(--s-ink-faint); opacity: 0.5; }
.s-datepicker__cell--today {
  color: var(--s-primary);
  font-weight: 700;
  box-shadow: var(--s-shadow-raised-sm);
}
.s-datepicker__cell--selected {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  font-weight: 700;
  box-shadow: 3px 3px 6px var(--s-sh-dark), -3px -3px 6px var(--s-sh-light);
}

.dp-enter-active, .dp-leave-active { transition: all 0.16s cubic-bezier(0.34, 1.3, 0.64, 1); }
.dp-enter-from, .dp-leave-to { opacity: 0; transform: translateY(-6px) scale(0.96); }
</style>
