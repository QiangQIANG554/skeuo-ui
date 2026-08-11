<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  padding?: string
}>(), {
  title: '',
  padding: '',
})

defineOptions({ name: 'SCard' })
</script>

<template>
  <div class="s-card" :style="padding ? { padding } : undefined">
    <div v-if="title || $slots.title" class="s-card__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="s-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-card {
  background: var(--s-surface);
  border-radius: var(--s-r-lg);
  box-shadow: var(--s-shadow-raised);
  padding: var(--s-sp-5);
  color: var(--s-ink);
}
.s-card__title {
  font-family: var(--s-font-serif);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: var(--s-sp-2);
  letter-spacing: 0.5px;
  color: var(--s-ink);
}
.s-card__title::after {
  content: "";
  display: block;
  width: 44px;
  height: 3px;
  margin-top: 8px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--s-primary), var(--s-primary-light));
  box-shadow: 0 1px 2px color-mix(in srgb, var(--s-primary) 30%, transparent);
}
</style>
