<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  label?: string
}>(), {
  direction: 'horizontal',
  label: '',
})

defineOptions({ name: 'SDivider' })

const cls = computed(() => [
  's-divider',
  `s-divider--${props.direction}`,
  { 's-divider--with-text': !!props.label },
])
</script>

<template>
  <div class="s-divider" :class="cls" role="separator">
    <span v-if="label" class="s-divider__text">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<style scoped>
.s-divider {
  display: flex;
  align-items: center;
  margin: var(--s-sp-4) 0;
  /* 内凹刻线：上暗下亮 */
  height: 1px;
  background: var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
  border: none;
}
.s-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 var(--s-sp-3);
  vertical-align: middle;
  background: var(--s-bg-deep);
  box-shadow: 1px 0 0 var(--s-sh-light);
}
.s-divider--with-text {
  height: auto;
  background: none;
  box-shadow: none;
  gap: var(--s-sp-3);
}
.s-divider--with-text::before,
.s-divider--with-text::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
}
.s-divider__text {
  font-size: 13px;
  font-weight: 600;
  color: var(--s-ink-soft);
  white-space: nowrap;
}
</style>
