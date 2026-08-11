<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  showBack?: boolean
  backText?: string
}>(), {
  title: '',
  subtitle: '',
  showBack: true,
  backText: '返回',
})

const emit = defineEmits<{
  (e: 'back'): void
}>()

defineOptions({ name: 'SPageHeader' })
</script>

<template>
  <div class="s-page-header">
    <button v-if="showBack" class="s-page-header__back" type="button" @click="emit('back')">
      <span class="s-page-header__arrow">←</span>
      <span>{{ backText }}</span>
    </button>
    <div class="s-page-header__main">
      <h2 v-if="title" class="s-page-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="s-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="s-page-header__extra">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.s-page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised);
}
.s-page-header__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: var(--s-ink-soft);
  font-size: 13px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--s-r-pill);
  transition: background 0.15s, color 0.15s;
  font-family: var(--s-font);
  flex: none;
}
.s-page-header__back:hover { background: var(--s-bg); color: var(--s-ink); }
.s-page-header__arrow { font-size: 15px; }
.s-page-header__main { flex: 1; min-width: 0; }
.s-page-header__title {
  margin: 0;
  font-family: var(--s-font-serif);
  font-size: 18px;
  color: var(--s-ink);
}
.s-page-header__subtitle {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--s-ink-faint);
}
.s-page-header__extra {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
</style>
