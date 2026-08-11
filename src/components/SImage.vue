<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  width?: number | string
  height?: number | string
  radius?: string
  preview?: boolean
  fit?: 'cover' | 'contain' | 'fill'
}>(), {
  src: '',
  alt: '',
  width: '100%',
  height: 'auto',
  radius: '',
  preview: true,
  fit: 'cover',
})

defineOptions({ name: 'SImage' })

// ---- 预览：点击放大，遮罩 + 图片 + 关闭 ----
const previewOpen = ref(false)

function openPreview() {
  if (!props.preview || !props.src) return
  previewOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closePreview() {
  previewOpen.value = false
  document.body.style.overflow = ''
}

function onMaskClick() {
  closePreview()
}
</script>

<template>
  <div class="s-image" :class="{ 's-image--previewable': preview }" :style="{ width: typeof width === 'number' ? width + 'px' : width, height: typeof height === 'number' ? height + 'px' : height, borderRadius: radius }">
    <img :src="src" :alt="alt" class="s-image__img" :style="{ borderRadius: radius, objectFit: fit }" @click="openPreview" />
    <span v-if="preview && src" class="s-image__zoom">⤢</span>
  </div>

  <!-- 预览遮罩 -->
  <Teleport to="body">
    <Transition name="img-preview">
      <div v-if="previewOpen" class="s-image__mask" @click="onMaskClick">
        <img :src="src" :alt="alt" class="s-image__preview-img" @click.stop />
        <button class="s-image__close" type="button" aria-label="关闭预览" @click="closePreview">✕</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.s-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: var(--s-surface-2);
  box-shadow: var(--s-shadow-inset);
  flex: none;
}
.s-image__img {
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
}
.s-image--previewable .s-image__img { cursor: zoom-in; }
.s-image__zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--s-ink);
  font-size: 13px;
  box-shadow: var(--s-shadow-raised-sm);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.s-image:hover .s-image__zoom { opacity: 1; }

.s-image__mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 22, 28, 0.78);
  backdrop-filter: blur(4px);
}
.s-image__preview-img {
  max-width: 82vw;
  max-height: 82vh;
  border-radius: var(--s-r-md);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}
.s-image__close {
  position: absolute;
  top: 22px;
  right: 26px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--s-ink);
  font-size: 15px;
  cursor: pointer;
  box-shadow: var(--s-shadow-raised-sm);
}
.s-image__close:hover { background: #fff; }

.img-preview-enter-active, .img-preview-leave-active { transition: opacity 0.25s; }
.img-preview-enter-from, .img-preview-leave-to { opacity: 0; }
</style>
