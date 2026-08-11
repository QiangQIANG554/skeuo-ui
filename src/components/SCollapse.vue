<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: (string | number)[]
  accordion?: boolean
}>(), {
  modelValue: () => [],
  accordion: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: (string | number)[]): void
}>()

defineOptions({ name: 'SCollapse' })

const openKeys = ref<(string | number)[]>(props.modelValue)

watch(() => props.modelValue, (v) => { openKeys.value = [...v] })

function toggle(name: string | number) {
  const cur = [...openKeys.value]
  const idx = cur.indexOf(name)
  if (idx >= 0) {
    cur.splice(idx, 1)
  } else {
    if (props.accordion) cur.length = 0
    cur.push(name)
  }
  openKeys.value = cur
  emit('update:modelValue', cur)
}

function isOpen(name: string | number) {
  return openKeys.value.includes(name)
}

defineExpose({ toggle, isOpen })
</script>

<template>
  <div class="s-collapse">
    <slot :toggle="toggle" :isOpen="isOpen" :openKeys="openKeys" />
  </div>
</template>

<style scoped>
.s-collapse {
  display: flex;
  flex-direction: column;
  gap: var(--s-sp-3);
}
</style>
