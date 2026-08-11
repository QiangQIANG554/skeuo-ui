<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from './message'

export interface UploadFile {
  name: string
  size: number
  status: 'ready' | 'success' | 'error'
}

const props = withDefaults(defineProps<{
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSizeMB?: number
}>(), {
  accept: '',
  multiple: false,
  disabled: false,
  maxSizeMB: 10,
})

const emit = defineEmits<{
  (e: 'change', files: UploadFile[]): void
  (e: 'remove', file: UploadFile): void
}>()

defineOptions({ name: 'SUpload' })

const files = ref<UploadFile[]>([])
const inputEl = ref<HTMLInputElement | null>(null)

function fmtSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function onPick() {
  if (props.disabled) return
  inputEl.value?.click()
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = Array.from(target.files ?? [])
  target.value = ''
  if (!raw.length) return

  for (const f of raw) {
    if (f.size > props.maxSizeMB * 1024 * 1024) {
      message.error(`「${f.name}」超过 ${props.maxSizeMB}MB 限制`)
      continue
    }
    files.value.push({ name: f.name, size: f.size, status: 'ready' })
  }
  emit('change', [...files.value])
}

function remove(f: UploadFile) {
  const idx = files.value.indexOf(f)
  if (idx >= 0) files.value.splice(idx, 1)
  emit('remove', f)
  emit('change', [...files.value])
}

const fileList = computed(() => files.value)
</script>

<template>
  <div class="s-upload" :class="{ 's-upload--disabled': disabled }">
    <input
      ref="inputEl"
      type="file"
      class="s-upload__input"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />
    <!-- 上传区：凹陷槽，点击选择 -->
    <div class="s-upload__drop" role="button" tabindex="0" @click="onPick" @keydown.enter="onPick">
      <span class="s-upload__icon">＋</span>
      <span class="s-upload__hint">点击选择文件<template v-if="multiple">（可多选）</template></span>
      <span class="s-upload__limit">≤ {{ maxSizeMB }}MB</span>
    </div>
    <!-- 文件列表 -->
    <ul v-if="fileList.length" class="s-upload__list">
      <li v-for="(f, i) in fileList" :key="i" class="s-upload__file">
        <span class="s-upload__file-name">{{ f.name }}</span>
        <span class="s-upload__file-size">{{ fmtSize(f.size) }}</span>
        <button class="s-upload__file-rm" type="button" aria-label="移除" @click="remove(f)">✕</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.s-upload__input {
  display: none;
}
.s-upload__drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--s-sp-5);
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
  color: var(--s-ink-soft);
  transition: all 0.15s;
  text-align: center;
}
.s-upload__drop:hover { color: var(--s-ink); }
.s-upload__drop:active { box-shadow: var(--s-shadow-pressed); }
.s-upload__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 300;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-primary);
}
.s-upload__hint { font-size: 13px; font-weight: 600; }
.s-upload__limit { font-size: 11px; color: var(--s-ink-faint); }
.s-upload__list {
  list-style: none;
  margin: var(--s-sp-3) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.s-upload__file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--s-r-sm);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  font-size: 13px;
}
.s-upload__file-name {
  flex: 1;
  color: var(--s-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.s-upload__file-size { color: var(--s-ink-faint); font-size: 12px; }
.s-upload__file-rm {
  border: none;
  background: transparent;
  color: var(--s-ink-faint);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
}
.s-upload__file-rm:hover { color: var(--s-danger); }
.s-upload--disabled { opacity: 0.6; }
.s-upload--disabled .s-upload__drop { cursor: not-allowed; }
</style>
