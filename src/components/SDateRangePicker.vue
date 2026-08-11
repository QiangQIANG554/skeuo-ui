<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: [string, string]
  placeholder?: [string, string]
  disabled?: boolean
}>(), {
  modelValue: () => ['', ''] as [string, string],
  placeholder: () => ['开始日期', '结束日期'],
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: [string, string]): void
}>()

defineOptions({ name: 'SDateRangePicker' })

const open = ref(false)
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())
const hoverDate = ref('')

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']
const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

function fmt(y: number, m: number, d: number) {
  const mm = String((m + 12) % 12 + 1).padStart(2, '0')
  const yy = m < 0 ? y - 1 : m > 11 ? y + 1 : y
  return `${yy}-${mm}-${String(d).padStart(2, '0')}`
}

const cells = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const leading = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const list: { day: number; inMonth: boolean; date: string }[] = []
  for (let i = leading - 1; i >= 0; i--) list.push({ day: prevDays - i, inMonth: false, date: fmt(viewYear.value, viewMonth.value - 1, prevDays - i) })
  for (let d = 1; d <= daysInMonth; d++) list.push({ day: d, inMonth: true, date: fmt(viewYear.value, viewMonth.value, d) })
  let next = 1
  while (list.length < 42) list.push({ day: next, inMonth: false, date: fmt(viewYear.value, viewMonth.value + 1, next++) })
  return list
})

// 注意：不能解构 props.modelValue 为普通变量（非响应式，永远是初始值）
// 必须用 computed 或直接读 props，否则 pick 逻辑判断不到已选日期
const start = computed(() => props.modelValue[0])
const end = computed(() => props.modelValue[1])

function isInRange(date: string) {
  if (!start.value || !end.value) return false
  return date > start.value && date < end.value
}
function isHoverInRange(date: string) {
  if (!start.value || end.value || !hoverDate.value) return false
  return (date > start.value && date < hoverDate.value) || (date > hoverDate.value && date < start.value)
}

function pick(date: string) {
  if (!start.value || (start.value && end.value)) {
    emit('update:modelValue', [date, ''])
  } else {
    if (date < start.value) emit('update:modelValue', [date, start.value])
    else emit('update:modelValue', [start.value, date])
    open.value = false
  }
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else { viewMonth.value-- }
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else { viewMonth.value++ }
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-date-range')
  if (!el) open.value = false
}
document.addEventListener('click', onOutside)
</script>

<template>
  <div class="s-date-range" :class="{ 's-date-range--open': open }">
    <div class="s-date-range__trigger" :class="{ 's-date-range__trigger--disabled': disabled }" @click="!disabled && (open = !open)">
      <span class="s-date-range__icon">📅</span>
      <span :class="{ 's-date-range__val--empty': !start && !end }">
        {{ start && end ? `${start} ~ ${end}` : (start || placeholder[0]) + ' ~ ' + (end || placeholder[1]) }}
      </span>
      <span class="s-date-range__caret">▾</span>
    </div>

    <div v-if="open" class="s-date-range__panel" @click.stop>
      <div class="s-date-range__head">
        <button class="s-date-range__nav" type="button" @click="prevMonth">‹</button>
        <span class="s-date-range__label">{{ monthLabel }}</span>
        <button class="s-date-range__nav" type="button" @click="nextMonth">›</button>
      </div>
      <div class="s-date-range__week">
        <span v-for="w in weekLabels" :key="w">{{ w }}</span>
      </div>
      <div class="s-date-range__grid">
        <div
          v-for="(c, i) in cells"
          :key="i"
          class="s-date-range__cell"
          :class="{
            's-date-range__cell--muted': !c.inMonth,
            's-date-range__cell--start': c.date === start,
            's-date-range__cell--end': c.date === end,
            's-date-range__cell--in': isInRange(c.date) || isHoverInRange(c.date),
          }"
          @mouseenter="hoverDate = c.date"
          @click="pick(c.date)"
        >{{ c.day }}</div>
      </div>
      <div v-if="start && !end" class="s-date-range__tip">请选择结束日期</div>
    </div>
  </div>
</template>

<style scoped>
.s-date-range { position: relative; display: inline-block; }
.s-date-range__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
  min-width: 230px;
  font-size: 13px;
  color: var(--s-ink);
  user-select: none;
  transition: box-shadow 0.15s;
}
.s-date-range__trigger:hover { box-shadow: var(--s-shadow-inset), 0 0 0 2px var(--s-primary-soft); }
.s-date-range__trigger--disabled { opacity: 0.5; cursor: not-allowed; }
.s-date-range__icon { font-size: 14px; }
.s-date-range__val--empty { color: var(--s-ink-faint); }
.s-date-range__caret { margin-left: auto; font-size: 11px; color: var(--s-ink-faint); }
.s-date-range__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1200;
  padding: 12px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 12px 32px var(--s-sh-dark-strong);
  width: 280px;
}
.s-date-range__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.s-date-range__label { font-family: var(--s-font-serif); font-size: 15px; font-weight: 700; color: var(--s-ink); }
.s-date-range__nav {
  width: 26px; height: 26px; border: none; border-radius: 50%;
  background: var(--s-bg); box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft); cursor: pointer; font-size: 13px; font-family: var(--s-font);
}
.s-date-range__week { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
.s-date-range__week span { text-align: center; font-size: 11px; color: var(--s-ink-faint); padding: 4px 0; }
.s-date-range__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.s-date-range__cell {
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  color: var(--s-ink);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.s-date-range__cell:hover { background: var(--s-surface-2); }
.s-date-range__cell--muted { color: var(--s-ink-faint); opacity: 0.5; }
.s-date-range__cell--in { background: var(--s-primary-soft, rgba(90,120,160,0.15)); }
.s-date-range__cell--start, .s-date-range__cell--end {
  background: var(--s-primary);
  color: #fff;
  font-weight: 700;
  box-shadow: var(--s-shadow-raised-sm);
}
.s-date-range__tip { text-align: center; font-size: 12px; color: var(--s-primary); margin-top: 8px; }
</style>
