<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  format?: string        // 'HH:mm' 或 'HH:mm:ss'
  step?: number          // 分钟步长
}>(), {
  modelValue: '',
  placeholder: '选择时间',
  disabled: false,
  format: 'HH:mm',
  step: 5,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

defineOptions({ name: 'STimePicker' })

const open = ref(false)

const hours = computed(() => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')))
const minutes = computed(() => {
  const arr: string[] = []
  for (let m = 0; m < 60; m += props.step) arr.push(String(m).padStart(2, '0'))
  return arr
})

const [h, m] = props.modelValue ? props.modelValue.split(':') : ['', '']
const selH = ref(h || '09')
const selM = ref(m || '00')

function select(part: 'h' | 'm', v: string) {
  if (part === 'h') selH.value = v
  else selM.value = v
  emit('update:modelValue', props.format === 'HH:mm:ss' ? `${selH.value}:${selM.value}:00` : `${selH.value}:${selM.value}`)
}

function onOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.s-timepicker')
  if (!el) open.value = false
}
document.addEventListener('click', onOutside)
</script>

<template>
  <div class="s-timepicker" :class="{ 's-timepicker--open': open }">
    <div
      class="s-timepicker__trigger"
      :class="{ 's-timepicker__trigger--disabled': disabled }"
      @click="!disabled && (open = !open)"
    >
      <span class="s-timepicker__clock">🕐</span>
      <span :class="{ 's-timepicker__value--empty': !modelValue }">{{ modelValue || placeholder }}</span>
      <span class="s-timepicker__caret">▾</span>
    </div>

    <div v-if="open" class="s-timepicker__panel" @click.stop>
      <div class="s-timepicker__cols">
        <div class="s-timepicker__col">
          <div v-for="hh in hours" :key="hh" class="s-timepicker__opt" :class="{ 's-timepicker__opt--active': hh === selH }" @click="select('h', hh)">{{ hh }}</div>
        </div>
        <div class="s-timepicker__col">
          <div v-for="mm in minutes" :key="mm" class="s-timepicker__opt" :class="{ 's-timepicker__opt--active': mm === selM }" @click="select('m', mm)">{{ mm }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-timepicker { position: relative; display: inline-block; }
.s-timepicker__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
  min-width: 140px;
  user-select: none;
  font-size: 13px;
  color: var(--s-ink);
  transition: box-shadow 0.15s;
}
.s-timepicker__trigger:hover { box-shadow: var(--s-shadow-inset), 0 0 0 2px var(--s-primary-soft); }
.s-timepicker__trigger--disabled { opacity: 0.5; cursor: not-allowed; }
.s-timepicker__clock { font-size: 14px; }
.s-timepicker__value--empty { color: var(--s-ink-faint); }
.s-timepicker__caret { margin-left: auto; font-size: 11px; color: var(--s-ink-faint); }
.s-timepicker__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  padding: 10px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 10px 30px var(--s-sh-dark-strong);
  display: flex;
  gap: 8px;
}
.s-timepicker__cols { display: flex; gap: 8px; }
.s-timepicker__col {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: var(--s-r-sm);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  min-width: 64px;
}
.s-timepicker__opt {
  padding: 6px 10px;
  border-radius: var(--s-r-sm);
  text-align: center;
  font-size: 13px;
  color: var(--s-ink-soft);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.s-timepicker__opt:hover { background: var(--s-surface-2); color: var(--s-ink); }
.s-timepicker__opt--active {
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-primary);
  font-weight: 600;
}
</style>
