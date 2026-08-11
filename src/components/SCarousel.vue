<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  items?: { title?: string; desc?: string; color?: string }[]
  height?: number
  autoplay?: boolean
  interval?: number
  showArrows?: boolean
  showIndicators?: boolean
  dragThreshold?: number   // 拖过容器宽度多少比例才切换（0.45 = 45%）
}>(), {
  items: () => [],
  height: 200,
  autoplay: true,
  interval: 3500,
  showArrows: true,
  showIndicators: true,
  dragThreshold: 0.45,
})

defineOptions({ name: 'SCarousel' })

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const count = computed(() => props.items.length)

function go(i: number) {
  current.value = (i + count.value) % count.value
}
function next() { go(current.value + 1) }
function prev() { go(current.value - 1) }

function startAutoplay() {
  if (!props.autoplay || count.value <= 1) return
  timer = setInterval(next, props.interval)
}
function stopAutoplay() {
  if (timer) { clearInterval(timer); timer = null }
}

onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)

// ==================== 拖拽滑动 ====================
// 按住图片左拖 → 下一张；右拖 → 上一张；跟手移动，拖过容器宽度 80% 松手才切换，否则回弹
const trackEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragOffset = ref(0)       // 跟手偏移（px，正=右移）
const dragStartIndex = ref(0)   // 按下时的索引
let startX = 0

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0 || count.value <= 1) return
  // 排除箭头/指示器上的点击（它们有独立功能，不该触发拖拽）
  const target = e.target as HTMLElement
  if (target.closest('.s-carousel__arrow') || target.closest('.s-carousel__dot')) return
  dragging.value = true
  startX = e.clientX
  dragStartIndex.value = current.value
  dragOffset.value = 0
  stopAutoplay()
  // mousemove/mouseup 挂到 document：拖出容器也不丢事件
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  let offset = e.clientX - startX
  // 边界阻尼：第一张往右拖 / 最后一张往左拖时减弱幅度，避免露出大片空白
  const width = trackEl.value?.clientWidth ?? 0
  const maxPull = width * 0.9
  if ((dragStartIndex.value === 0 && offset > 0) || (dragStartIndex.value === count.value - 1 && offset < 0)) {
    offset *= 0.35
  }
  dragOffset.value = Math.max(-maxPull, Math.min(maxPull, offset))
}

function onMouseUp() {
  if (!dragging.value) return
  const width = trackEl.value?.clientWidth ?? 0
  const threshold = width * props.dragThreshold

  // 判定切换方向：左拖(负) → 下一张；右拖(正) → 上一张；不足阈值 → 0 回弹
  const dir = (width > 0 && dragOffset.value <= -threshold) ? 1
    : (width > 0 && dragOffset.value >= threshold) ? -1
    : 0
  const target = (dragStartIndex.value + dir + count.value) % count.value

  // 关键修复：先恢复 transition（dragging=false），但保留 dragOffset 让 track 停在松开位置；
  // 下一帧（requestAnimationFrame）再切索引并清零偏移 → 过渡从当前拖动位置平滑滑到目标
  // 注意：拖动后【不】重启 autoplay——自动播放只由 mouseenter/mouseleave 控制，
  // 否则拖动完 3.5s 后图会被自动切走，体验像"没拖住"
  dragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  requestAnimationFrame(() => {
    dragOffset.value = 0
    current.value = target
  })
}

function onMouseLeave() {
  // 拖动中离开容器：不结束（document 监听会继续接收事件）
  if (dragging.value) return
  startAutoplay()
}

// track 位移：基础位置 + 拖拽跟手偏移
// 注意：非拖拽但 offset 未清零时（松手后的过渡帧）也要按偏移渲染，
// 否则 track 会先跳回原图再滑动，产生"回弹感"
const trackTransform = computed(() => {
  const base = -dragStartIndex.value * 100
  if (dragging.value || dragOffset.value !== 0) {
    return `translateX(calc(${base}% + ${dragOffset.value}px))`
  }
  return `translateX(${-current.value * 100}%)`
})

onBeforeUnmount(() => {
  stopAutoplay()
  stopDrag()
})
function stopDrag() {
  dragging.value = false
  dragOffset.value = 0
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

// 当前激活索引（供指示器/样式使用）
const activeIdx = computed(() => current.value)
</script>

<template>
  <div
    class="s-carousel"
    :class="{ 's-carousel--dragging': dragging }"
    :style="{ height: height + 'px' }"
    @mouseenter="stopAutoplay"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
  >
    <div
      ref="trackEl"
      class="s-carousel__track"
      :style="{ transform: trackTransform, transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.1, 0.64, 1)' }"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="s-carousel__slide"
        :class="{ 's-carousel__slide--active': i === activeIdx }"
        :style="item.color ? { background: `linear-gradient(145deg, ${item.color}, color-mix(in srgb, ${item.color} 70%, var(--s-sh-dark)))` } : {}"
      >
        <div v-if="item.title" class="s-carousel__title">{{ item.title }}</div>
        <div v-if="item.desc" class="s-carousel__desc">{{ item.desc }}</div>
        <slot :item="item" :index="i" />
      </div>
    </div>

    <!-- 左右箭头（点击切换，保留） -->
    <template v-if="showArrows && count > 1">
      <button class="s-carousel__arrow s-carousel__arrow--prev" type="button" aria-label="上一张" @click="prev">‹</button>
      <button class="s-carousel__arrow s-carousel__arrow--next" type="button" aria-label="下一张" @click="next">›</button>
    </template>

    <!-- 指示器 -->
    <div v-if="showIndicators && count > 1" class="s-carousel__indicators">
      <button
        v-for="(_, i) in items"
        :key="i"
        class="s-carousel__dot"
        :class="{ 's-carousel__dot--active': i === activeIdx }"
        type="button"
        :aria-label="`第 ${i + 1} 张`"
        @click="go(i)"
      />
    </div>

    <!-- 拖拽提示 -->
    <span v-if="showArrows && count > 1" class="s-carousel__hint">← 按住左右拖动切换 →</span>
  </div>
</template>

<style scoped>
.s-carousel {
  position: relative;
  width: 100%;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  overflow: hidden;
  user-select: none;
  touch-action: pan-y;
}
.s-carousel__track {
  display: flex;
  height: 100%;
  cursor: grab;
  will-change: transform;
}
.s-carousel--dragging .s-carousel__track { cursor: grabbing; }
.s-carousel__slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;   /* 关键：flex-basis 100% 包含 padding，slide 严格等于容器宽 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: linear-gradient(145deg, var(--s-surface), var(--s-surface-2));
  color: var(--s-ink);
  pointer-events: none;
}
.s-carousel__title {
  font-family: var(--s-font-serif);
  font-size: 22px;
  font-weight: 700;
  color: inherit;
  text-shadow: 1px 1px 2px var(--s-sh-dark), -1px -1px 2px var(--s-sh-light);
}
.s-carousel__desc {
  font-size: 14px;
  color: inherit;
  opacity: 0.85;
}
.s-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--s-surface);
  color: var(--s-ink-soft);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--s-font);
  opacity: 0;
  transition: opacity 0.2s, background 0.12s;
  z-index: 2;
}
.s-carousel:hover .s-carousel__arrow { opacity: 1; }
.s-carousel__arrow:hover { color: var(--s-ink); }
.s-carousel__arrow:active { color: var(--s-ink); background: var(--s-surface-2); }
.s-carousel__arrow--prev { left: 12px; }
.s-carousel__arrow--next { right: 12px; }
.s-carousel__indicators {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}
.s-carousel__dot {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: var(--s-bg-deep);
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}
.s-carousel__dot:hover { opacity: 0.9; }
.s-carousel__dot--active {
  width: 24px;
  border-radius: var(--s-r-pill);
  background: var(--s-primary);
  opacity: 1;
}
.s-carousel__hint {
  position: absolute;
  bottom: 12px;
  right: 14px;
  font-size: 11px;
  color: var(--s-ink-faint);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
  pointer-events: none;
}
.s-carousel:hover .s-carousel__hint { opacity: 1; }
</style>
