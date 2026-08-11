<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  rows?: number
  animated?: boolean
  avatar?: boolean
  title?: boolean
  width?: string
}>(), {
  rows: 3,
  animated: true,
  avatar: false,
  title: true,
  width: '100%',
})

defineOptions({ name: 'SSkeleton' })

const rowWidths = computed(() => {
  // 模拟真实段落：最后一行 60%，其余随机错落
  return Array.from({ length: props.rows }, (_, i) => {
    if (i === props.rows - 1 && props.rows > 1) return '60%'
    return ['92%', '100%', '84%', '96%'][i % 4]
  })
})
</script>

<template>
  <div class="s-skeleton" :class="{ 's-skeleton--animated': animated }" :style="{ width }">
    <div v-if="avatar" class="s-skeleton__avatar" />
    <div class="s-skeleton__body">
      <div v-if="title" class="s-skeleton__title" />
      <div
        v-for="(w, i) in rowWidths"
        :key="i"
        class="s-skeleton__row"
        :style="{ width: w }"
      />
    </div>
  </div>
</template>

<style scoped>
.s-skeleton {
  display: flex;
  gap: var(--s-sp-4);
  padding: var(--s-sp-4);
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-skeleton__avatar {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 50%;
  background: var(--s-bg-deep);
  box-shadow: var(--s-shadow-inset);
}
.s-skeleton__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.s-skeleton__title {
  height: 16px;
  width: 40%;
  border-radius: 6px;
  background: var(--s-bg-deep);
  box-shadow: var(--s-shadow-inset);
}
.s-skeleton__row {
  height: 12px;
  border-radius: 6px;
  background: var(--s-bg-deep);
  box-shadow: var(--s-shadow-inset);
}
.s-skeleton--animated .s-skeleton__title,
.s-skeleton--animated .s-skeleton__row,
.s-skeleton--animated .s-skeleton__avatar {
  position: relative;
  overflow: hidden;
}
.s-skeleton--animated .s-skeleton__title::after,
.s-skeleton--animated .s-skeleton__row::after,
.s-skeleton--animated .s-skeleton__avatar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--s-sh-light) 60%, transparent), transparent);
  animation: s-skeleton-shine 1.4s infinite;
}
@keyframes s-skeleton-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
