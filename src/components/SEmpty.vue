<script setup lang="ts">
withDefaults(defineProps<{
  description?: string
  imageSize?: number
}>(), {
  description: '暂无数据',
  imageSize: 90,
})

defineOptions({ name: 'SEmpty' })
</script>

<template>
  <div class="s-empty">
    <!-- 拟物空状态插画：一个凹陷的"井" + 凸起的"文档" -->
    <div class="s-empty__art" :style="{ width: imageSize + 'px', height: imageSize * 0.8 + 'px' }">
      <div class="s-empty__well" />
      <div class="s-empty__doc">
        <div class="s-empty__line" style="width:55%"></div>
        <div class="s-empty__line" style="width:75%"></div>
        <div class="s-empty__line" style="width:45%"></div>
      </div>
    </div>
    <p class="s-empty__desc">
      <slot>{{ description }}</slot>
    </p>
    <div v-if="$slots.default" class="s-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.s-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--s-sp-6) var(--s-sp-4);
  text-align: center;
}
.s-empty__art {
  position: relative;
  margin-bottom: var(--s-sp-4);
}
/* 凹陷井 */
.s-empty__well {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 78%;
  height: 82%;
  transform: translate(-50%, -50%);
  border-radius: var(--s-r-lg);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
}
/* 凸起文档 */
.s-empty__doc {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 46%;
  height: 72%;
  transform: translate(-58%, -50%) rotate(-4deg);
  border-radius: var(--s-r-sm);
  background: linear-gradient(145deg, var(--s-sh-light), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
}
.s-empty__line {
  height: 5px;
  border-radius: 3px;
  background: var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
}
.s-empty__desc {
  font-size: 14px;
  color: var(--s-ink-faint);
  margin: 0;
}
.s-empty__action {
  margin-top: var(--s-sp-4);
}
</style>
