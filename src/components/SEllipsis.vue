<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  lines?: number
  maxWidth?: number | string
  showTooltip?: boolean
  expandable?: boolean
}>(), {
  text: '',
  lines: 1,
  maxWidth: '',
  showTooltip: true,
  expandable: false,
})

defineOptions({ name: 'SEllipsis' })

// 用 CSS -webkit-line-clamp 实现多行截断；需要判断是否溢出以决定是否显示 tooltip/展开
const innerEl = ref<HTMLElement | null>(null)
const overflow = ref(false)

function checkOverflow() {
  // line-clamp 作用在父级 .s-ellipsis 上，检测父级（clamp 后的容器）是否溢出
  const parent = innerEl.value?.parentElement
  if (!parent) return
  if (props.lines === 1) {
    overflow.value = innerEl.value ? innerEl.value.scrollWidth > innerEl.value.clientWidth + 1 : false
  } else {
    overflow.value = parent.scrollHeight > parent.clientHeight + 1
  }
}

onMounted(async () => {
  // 等待布局完成再检测溢出（line-clamp 需要渲染后才有真实高度）
  await nextTick()
  checkOverflow()
  await new Promise(r => setTimeout(r, 50))
  checkOverflow()
  // 图片/字体加载后尺寸可能变化，窗口 resize 时复查
  window.addEventListener('resize', checkOverflow)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOverflow)
})

const expanded = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
  // 展开后溢出状态自然消失
}

const clampStyle = computed(() => ({
  WebkitLineClamp: expanded.value ? 'unset' : String(props.lines),
  maxWidth: typeof props.maxWidth === 'number' ? props.maxWidth + 'px' : props.maxWidth || undefined,
}))
</script>

<template>
  <div class="s-ellipsis-wrap">
    <div class="s-ellipsis" :style="clampStyle" :class="{ 's-ellipsis--expanded': expanded }">
      <span
        ref="innerEl"
        class="s-ellipsis__inner"
        :class="{ 's-ellipsis__inner--single': lines === 1 }"
      >
        {{ text }}<slot />
      </span>
    </div>
    <span
      v-if="expandable && overflow && !expanded"
      class="s-ellipsis__more"
      @click="toggleExpand"
    >展开</span>
    <span
      v-if="expandable && expanded"
      class="s-ellipsis__more"
      @click="toggleExpand"
    >收起</span>
  </div>
</template>

<style scoped>
.s-ellipsis-wrap { display: flex; align-items: flex-start; }
.s-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  font-size: 13px;
  color: var(--s-ink);
  line-height: 1.6;
  position: relative;
  flex: 1;
  min-width: 0;
}
.s-ellipsis--expanded { display: block; }
.s-ellipsis__inner { display: inline; }
.s-ellipsis__inner--single {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.s-ellipsis__more {
  color: var(--s-primary);
  cursor: pointer;
  font-size: 12px;
  margin-left: 4px;
  white-space: nowrap;
}
.s-ellipsis__more:hover { text-decoration: underline; }
</style>
