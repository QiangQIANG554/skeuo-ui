<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface AnchorLink {
  key: string
  title: string
}

const props = withDefaults(defineProps<{
  links?: AnchorLink[]
  container?: string        // 滚动容器选择器，默认 window
  offset?: number           // 顶部偏移量
  scrollGap?: number        // 距离顶部多少时判定激活
}>(), {
  links: () => [],
  container: '',
  offset: 0,
  scrollGap: 80,
})

const emit = defineEmits<{
  (e: 'change', key: string): void
}>()

defineOptions({ name: 'SAnchor' })

const active = ref('')

function getScroller(): HTMLElement | Window {
  if (props.container) {
    return document.querySelector(props.container) as HTMLElement ?? window
  }
  return window
}

function getScrollTop(): number {
  const s = getScroller()
  if (s === window) return window.scrollY || document.documentElement.scrollTop
  return (s as HTMLElement).scrollTop
}

function onScroll() {
  const top = getScrollTop() + props.scrollGap
  let current = ''
  for (const link of props.links) {
    const el = document.getElementById(link.key)
    if (!el) continue
    if (el.offsetTop <= top) current = link.key
  }
  if (current !== active.value) {
    active.value = current
    emit('change', current)
  }
}

function go(link: AnchorLink) {
  const el = document.getElementById(link.key)
  if (!el) return
  const s = getScroller()
  const target = s === window
    ? el.getBoundingClientRect().top + window.scrollY - props.offset
    : el.offsetTop - props.offset
  if (s === window) {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    ;(s as HTMLElement).scrollTo({ top: target, behavior: 'smooth' })
  }
  active.value = link.key
}

onMounted(() => {
  const s = getScroller()
  s.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  const s = getScroller()
  s.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="s-anchor" aria-label="页面导航">
    <button
      v-for="link in links"
      :key="link.key"
      class="s-anchor__link"
      :class="{ 's-anchor__link--active': active === link.key }"
      type="button"
      @click="go(link)"
    >
      <span class="s-anchor__dot" />
      <span class="s-anchor__text">{{ link.title }}</span>
    </button>
  </nav>
</template>

<style scoped>
.s-anchor {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  width: fit-content;
}
.s-anchor__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border: none;
  border-radius: var(--s-r-sm);
  background: transparent;
  font-size: 13px;
  color: var(--s-ink-soft);
  cursor: pointer;
  font-family: var(--s-font);
  text-align: left;
  transition: background 0.12s, color 0.12s;
}
.s-anchor__link:hover { background: var(--s-bg); color: var(--s-ink); }
.s-anchor__link--active { color: var(--s-primary); font-weight: 600; }
.s-anchor__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--s-bg-deep);
  box-shadow: var(--s-shadow-inset);
  flex: none;
  transition: background 0.15s, box-shadow 0.15s;
}
.s-anchor__link--active .s-anchor__dot {
  background: var(--s-primary);
  box-shadow: var(--s-shadow-raised-sm);
}
</style>
