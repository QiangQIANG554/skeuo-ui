<script setup lang="ts">
import { computed, inject } from 'vue'
import { tabsKey, type TabsCtx } from './tabs-context'

const props = withDefaults(defineProps<{
  label?: string
  name?: string | number
  disabled?: boolean
}>(), {
  label: '',
  name: '',
  disabled: false,
})

defineOptions({ name: 'STab' })

const ctx = inject<TabsCtx | undefined>(tabsKey, undefined)
const key = computed(() => props.name ?? props.label)

const active = computed(() => (ctx ? ctx.getActiveKey() === key.value : true))
</script>

<template>
  <div v-show="active" class="s-tab-pane" role="tabpanel">
    <slot />
  </div>
</template>

<style scoped>
.s-tab-pane { color: var(--s-ink); }
</style>
