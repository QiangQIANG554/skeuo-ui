<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  text?: string
  size?: number | string
  shape?: 'circle' | 'square'
}>(), {
  src: '',
  alt: '',
  text: '',
  size: 40,
  shape: 'circle',
})

defineOptions({ name: 'SAvatar' })

const failed = ref(false)
const sizeStyle = computed(() => {
  const px = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: px, height: px, fontSize: typeof props.size === 'number' ? `${props.size * 0.42}px` : '16px' }
})

// 文字头像取首字符；图片加载失败时回退到文字
const initial = computed(() => props.text || props.alt || '?')
</script>

<template>
  <span class="s-avatar" :class="`s-avatar--${shape}`" :style="sizeStyle">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      class="s-avatar__img"
      @error="failed = true"
    />
    <span v-else class="s-avatar__text">{{ initial.charAt(0) }}</span>
  </span>
</template>

<style scoped>
.s-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  color: var(--s-ink-soft);
  font-weight: 600;
  overflow: hidden;
  user-select: none;
}
.s-avatar--circle { border-radius: 50%; }
.s-avatar--square { border-radius: var(--s-r-sm); }
.s-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.s-avatar__text {
  line-height: 1;
}
</style>
