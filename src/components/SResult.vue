<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'success' | 'error' | 'warning' | 'info' | 'empty' | '404'
  title?: string
  description?: string
  image?: string
  imageSize?: number
}>(), {
  type: 'success',
  title: '',
  description: '',
  image: '',
  imageSize: 96,
})

defineOptions({ name: 'SResult' })

const icons: Record<string, { icon: string; cls: string }> = {
  success: { icon: '✓', cls: 'success' },
  error: { icon: '✕', cls: 'error' },
  warning: { icon: '!', cls: 'warning' },
  info: { icon: 'i', cls: 'info' },
  empty: { icon: '○', cls: 'empty' },
  '404': { icon: '404', cls: 'nf' },
}

const display = computed(() => icons[props.type] ?? icons.info)
</script>

<template>
  <div class="s-result">
    <div v-if="image" class="s-result__image" :style="{ width: imageSize + 'px', height: imageSize + 'px' }">
      <img :src="image" :alt="title" />
    </div>
    <div v-else class="s-result__icon" :class="`s-result__icon--${display.cls}`" :style="{ width: imageSize + 'px', height: imageSize + 'px' }">
      {{ display.icon }}
    </div>
    <h3 v-if="title" class="s-result__title">{{ title }}</h3>
    <p v-if="description" class="s-result__desc">{{ description }}</p>
    <div v-if="$slots.default" class="s-result__extra">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px;
  gap: 14px;
}
.s-result__image {
  border-radius: var(--s-r-md);
  overflow: hidden;
  box-shadow: var(--s-shadow-raised-sm);
}
.s-result__image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.s-result__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: var(--s-font-serif);
  font-weight: 700;
  font-size: 34px;
  color: #fff;
}
.s-result__icon--success { background: linear-gradient(145deg, var(--s-success), var(--s-success-deep)); box-shadow: 4px 4px 10px var(--s-sh-dark), -4px -4px 10px var(--s-sh-light); }
.s-result__icon--error { background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep)); box-shadow: 4px 4px 10px var(--s-sh-dark), -4px -4px 10px var(--s-sh-light); }
.s-result__icon--warning { background: linear-gradient(145deg, var(--s-warning), var(--s-warning-deep)); box-shadow: 4px 4px 10px var(--s-sh-dark), -4px -4px 10px var(--s-sh-light); }
.s-result__icon--info { background: linear-gradient(145deg, var(--s-primary), var(--s-primary-deep)); box-shadow: 4px 4px 10px var(--s-sh-dark), -4px -4px 10px var(--s-sh-light); }
.s-result__icon--empty { background: var(--s-bg-deep); color: var(--s-ink-faint); box-shadow: var(--s-shadow-inset); }
.s-result__icon--nf { background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep)); box-shadow: 4px 4px 10px var(--s-sh-dark), -4px -4px 10px var(--s-sh-light); font-size: 26px; }
.s-result__title { margin: 0; font-family: var(--s-font-serif); font-size: 22px; color: var(--s-ink); }
.s-result__desc { margin: 0; font-size: 13px; color: var(--s-ink-soft); max-width: 380px; line-height: 1.7; }
.s-result__extra { margin-top: 6px; display: flex; gap: 10px; justify-content: center; }
</style>
