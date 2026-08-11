<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string        // 'YYYY-MM-DD'
  markedDates?: string[]     // 高亮日期
  disabledDates?: string[]
}>(), {
  modelValue: '',
  markedDates: () => [],
  disabledDates: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', date: string): void
}>()

defineOptions({ name: 'SCalendar' })

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())  // 0-11

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

// 生成当前月视图的格子：前补 + 当月 + 后补
const cells = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  // 周一为起始：getDay() 0=周日 → 偏移
  const leading = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const list: { day: number; inMonth: boolean; date: string }[] = []
  // 前月补位
  const prevMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = leading - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    list.push({ day: d, inMonth: false, date: fmt(viewYear.value, viewMonth.value - 1, d) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    list.push({ day: d, inMonth: true, date: fmt(viewYear.value, viewMonth.value, d) })
  }
  // 后月补位到 42 格
  let next = 1
  while (list.length < 42) {
    list.push({ day: next, inMonth: false, date: fmt(viewYear.value, viewMonth.value + 1, next) })
    next++
  }
  return list
})

function fmt(y: number, m: number, d: number) {
  const mm = String((m + 12) % 12 + 1).padStart(2, '0')
  const yy = m < 0 ? y - 1 : m > 11 ? y + 1 : y
  return `${yy}-${mm}-${String(d).padStart(2, '0')}`
}

const isToday = (date: string) => date === fmt(today.getFullYear(), today.getMonth(), today.getDate())

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else { viewMonth.value-- }
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else { viewMonth.value++ }
}

function pick(c: { date: string }) {
  if (props.disabledDates.includes(c.date)) return
  emit('update:modelValue', c.date)
  emit('select', c.date)
}
</script>

<template>
  <div class="s-cal">
    <div class="s-cal__head">
      <button class="s-cal__nav" type="button" aria-label="上个月" @click="prevMonth">‹</button>
      <span class="s-cal__label">{{ monthLabel }}</span>
      <button class="s-cal__nav" type="button" aria-label="下个月" @click="nextMonth">›</button>
    </div>
    <div class="s-cal__week">
      <span v-for="w in weekLabels" :key="w" class="s-cal__week-label">{{ w }}</span>
    </div>
    <div class="s-cal__grid">
      <div
        v-for="(c, i) in cells"
        :key="i"
        class="s-cal__cell"
        :class="{
          's-cal__cell--muted': !c.inMonth,
          's-cal__cell--today': isToday(c.date),
          's-cal__cell--selected': c.date === modelValue,
          's-cal__cell--marked': markedDates.includes(c.date),
          's-cal__cell--disabled': disabledDates.includes(c.date),
        }"
        @click="pick(c)"
      >
        {{ c.day }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-cal {
  padding: 16px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised);
  user-select: none;
}
.s-cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.s-cal__label { font-family: var(--s-font-serif); font-size: 16px; font-weight: 700; color: var(--s-ink); }
.s-cal__nav {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--s-bg);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  cursor: pointer;
  font-size: 14px;
  font-family: var(--s-font);
}
.s-cal__nav:active { box-shadow: var(--s-shadow-pressed); }
.s-cal__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}
.s-cal__week-label {
  text-align: center;
  font-size: 11px;
  color: var(--s-ink-faint);
  padding: 6px 0;
}
.s-cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.s-cal__cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--s-r-sm);
  font-size: 13px;
  color: var(--s-ink);
  cursor: pointer;
  transition: background 0.12s, box-shadow 0.12s, color 0.12s;
}
.s-cal__cell:hover { background: var(--s-surface-2); }
.s-cal__cell--muted { color: var(--s-ink-faint); opacity: 0.55; }
.s-cal__cell--today { box-shadow: inset 0 0 0 1.5px var(--s-primary); color: var(--s-primary); font-weight: 600; }
.s-cal__cell--selected { background: var(--s-primary); color: #fff; box-shadow: var(--s-shadow-raised-sm); font-weight: 700; }
.s-cal__cell--marked::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--s-primary);
  position: absolute;
}
.s-cal__cell { position: relative; }
.s-cal__cell--marked.s-cal__cell--selected::after { background: #fff; }
.s-cal__cell--disabled { opacity: 0.3; cursor: not-allowed; }
</style>
