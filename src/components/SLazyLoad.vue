<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  placeholder?: string
  error?: string
  threshold?: number     // 0-1，进入视口多少触发
  once?: boolean
  fit?: 'cover' | 'contain' | 'fill'
  alt?: string
}>(), {
  src: '',
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlM2U4Ii8+PC9zdmc+',
  error: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTRlN2VjIi8+PHRleHQgeD0iMTUwIiB5PSIxMDUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPumcgOimgO+8gTwvdGV4dD48L3N2Zz4=',
  threshold: 0,
  once: true,
  fit: 'cover',
  alt: '',
})

defineOptions({ name: 'SLazyLoad' })

const loaded = ref(false)
const failed = ref(false)
const el = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value) return
  if (typeof IntersectionObserver === 'undefined') {
    loaded.value = true
    return
  }
  io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loaded.value = true
      if (props.once) io?.disconnect()
    }
  }, { rootMargin: '200px', threshold: props.threshold })
  io.observe(el.value)
})

onBeforeUnmount(() => io?.disconnect())

function onImgError() {
  failed.value = true
}
</script>

<template>
  <div ref="el" class="s-lazy">
    <img
      v-if="loaded && !failed"
      :src="src"
      :alt="alt"
      class="s-lazy__img"
      :style="{ objectFit: fit }"
      loading="lazy"
      @error="onImgError"
    />
    <img v-else :src="failed ? error : placeholder" alt="" class="s-lazy__img" :style="{ objectFit: fit }" />
  </div>
</template>

<style scoped>
.s-lazy { overflow: hidden; display: block; }
.s-lazy__img {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity 0.3s;
}
</style>
