<script setup lang="ts">
import { ref, computed } from 'vue'

export interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  data?: TransferItem[]
  modelValue?: (string | number)[]
  titles?: [string, string]
  searchable?: boolean
}>(), {
  data: () => [],
  modelValue: () => [],
  titles: () => ['待选择', '已选择'],
  searchable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: (string | number)[]): void
}>()

defineOptions({ name: 'STransfer' })

const leftSearch = ref('')
const rightSearch = ref('')
const leftChecked = ref<(string | number)[]>([])
const rightChecked = ref<(string | number)[]>([])

const selectedSet = computed(() => new Set(props.modelValue))

const leftList = computed(() => props.data.filter(d => !selectedSet.value.has(d.key)))
const rightList = computed(() => props.data.filter(d => selectedSet.value.has(d.key)))

const filteredLeft = computed(() => {
  if (!leftSearch.value) return leftList.value
  return leftList.value.filter(d => d.label.includes(leftSearch.value))
})
const filteredRight = computed(() => {
  if (!rightSearch.value) return rightList.value
  return rightList.value.filter(d => d.label.includes(rightSearch.value))
})

function toggleLeft(key: string | number) {
  const i = leftChecked.value.indexOf(key)
  if (i >= 0) leftChecked.value.splice(i, 1)
  else leftChecked.value.push(key)
}
function toggleRight(key: string | number) {
  const i = rightChecked.value.indexOf(key)
  if (i >= 0) rightChecked.value.splice(i, 1)
  else rightChecked.value.push(key)
}

// 右侧 -> 左：移除
function toLeft() {
  const newVal = props.modelValue.filter(k => !rightChecked.value.includes(k))
  emit('update:modelValue', newVal)
  rightChecked.value = []
}
// 左侧 -> 右：添加
function toRight() {
  const addable = leftChecked.value.filter(k => {
    const item = props.data.find(d => d.key === k)
    return item && !item.disabled
  })
  emit('update:modelValue', [...props.modelValue, ...addable])
  leftChecked.value = []
}
</script>

<template>
  <div class="s-transfer">
    <div class="s-transfer__panel">
      <div class="s-transfer__head">
        <span class="s-transfer__title">{{ titles[0] }}（{{ leftList.length }}）</span>
      </div>
      <input v-if="searchable" v-model="leftSearch" class="s-transfer__search" placeholder="搜索…" />
      <div class="s-transfer__list">
        <div
          v-for="item in filteredLeft"
          :key="item.key"
          class="s-transfer__item"
          :class="{ 's-transfer__item--checked': leftChecked.includes(item.key), 's-transfer__item--disabled': item.disabled }"
          @click="!item.disabled && toggleLeft(item.key)"
        >
          <span class="s-transfer__check">{{ leftChecked.includes(item.key) ? '✓' : '' }}</span>
          <span class="s-transfer__label">{{ item.label }}</span>
        </div>
        <div v-if="!filteredLeft.length" class="s-transfer__empty">暂无数据</div>
      </div>
    </div>

    <div class="s-transfer__actions">
      <button class="s-transfer__btn" type="button" :disabled="!rightChecked.length" @click="toLeft">‹</button>
      <button class="s-transfer__btn" type="button" :disabled="!leftChecked.length" @click="toRight">›</button>
    </div>

    <div class="s-transfer__panel">
      <div class="s-transfer__head">
        <span class="s-transfer__title">{{ titles[1] }}（{{ rightList.length }}）</span>
      </div>
      <input v-if="searchable" v-model="rightSearch" class="s-transfer__search" placeholder="搜索…" />
      <div class="s-transfer__list">
        <div
          v-for="item in filteredRight"
          :key="item.key"
          class="s-transfer__item"
          :class="{ 's-transfer__item--checked': rightChecked.includes(item.key), 's-transfer__item--disabled': item.disabled }"
          @click="!item.disabled && toggleRight(item.key)"
        >
          <span class="s-transfer__check">{{ rightChecked.includes(item.key) ? '✓' : '' }}</span>
          <span class="s-transfer__label">{{ item.label }}</span>
        </div>
        <div v-if="!filteredRight.length" class="s-transfer__empty">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s-transfer { display: flex; gap: 12px; align-items: stretch; }
.s-transfer__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.s-transfer__head {
  padding: 10px 14px;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-transfer__title { font-size: 13px; font-weight: 600; color: var(--s-ink); }
.s-transfer__search {
  margin: 8px;
  padding: 6px 10px;
  border: none;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  font-size: 12px;
  color: var(--s-ink);
  outline: none;
  font-family: var(--s-font);
}
.s-transfer__list {
  flex: 1;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.s-transfer__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--s-r-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--s-ink);
  transition: background 0.12s;
}
.s-transfer__item:hover { background: var(--s-surface-2); }
.s-transfer__item--checked { background: var(--s-surface); box-shadow: var(--s-shadow-raised-sm); }
.s-transfer__item--disabled { opacity: 0.45; cursor: not-allowed; }
.s-transfer__check {
  width: 16px;
  height: 16px;
  flex: none;
  border-radius: 4px;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--s-primary);
}
.s-transfer__item--checked .s-transfer__check { background: var(--s-primary); color: #fff; }
.s-transfer__empty { text-align: center; color: var(--s-ink-faint); font-size: 12px; padding: 24px 0; }
.s-transfer__actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}
.s-transfer__btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  font-size: 16px;
  cursor: pointer;
  font-family: var(--s-font);
  transition: box-shadow 0.12s, color 0.12s;
}
.s-transfer__btn:hover:not(:disabled) { color: var(--s-primary); box-shadow: var(--s-shadow-raised); }
.s-transfer__btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
