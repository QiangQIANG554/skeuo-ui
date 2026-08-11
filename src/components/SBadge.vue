<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: string | number
  max?: number
  dot?: boolean
  hidden?: boolean
}>(), {
  value: '',
  max: 99,
  dot: false,
  hidden: false,
})

defineOptions({ name: 'SBadge' })

const display = computed(() => {
  if (props.dot) return ''
  const n = Number(props.value)
  if (!Number.isNaN(n) && n > props.max) return `${props.max}+`
  return String(props.value)
})
</script>

<template>
  <span class="s-badge" :class="{ 's-badge--dot': dot }">
    <slot />
    <sup
      v-if="!hidden && (dot || value !== '' && value !== 0)"
      class="s-badge__sup"
      :class="{ 's-badge__sup--dot': dot }"
    >{{ display }}</sup>
  </span>
</template>

<style scoped>
.s-badge {
  position: relative;
  display: inline-flex;
}
.s-badge__sup {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--s-r-pill);
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-shadow:
    var(--s-shadow-raised-sm),
    0 0 6px color-mix(in srgb, var(--s-danger) 50%, transparent);
  font-variant-numeric: tabular-nums;
}
.s-badge__sup--dot {
  min-width: 10px;
  width: 10px;
  height: 10px;
  padding: 0;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  line-height: 1;
  background: radial-gradient(circle at 35% 30%, #ff9d95, var(--s-danger) 60%, var(--s-danger-deep));
  box-shadow: 0 0 4px color-mix(in srgb, var(--s-danger) 60%, transparent);
}
</style>
