<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'default' | 'primary' | 'danger' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
  block?: boolean
}>(), {
  type: 'default',
  size: 'md',
  disabled: false,
  nativeType: 'button',
  block: false,
})

defineOptions({ name: 'SButton' })

const classes = computed(() => [
  's-btn',
  `s-btn--${props.type}`,
  `s-btn--${props.size}`,
  { 's-btn--block': props.block },
])
</script>

<template>
  <button
    class="s-btn"
    :class="classes"
    :type="nativeType"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.s-btn {
  font-family: var(--s-font);
  font-size: 14px;
  font-weight: 600;
  color: var(--s-ink);
  padding: 10px 22px;
  border-radius: var(--s-r-md);
  border: none;
  cursor: pointer;
  user-select: none;
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  transition: box-shadow 0.15s ease, transform 0.08s ease, color 0.15s;
  outline: none;
  white-space: nowrap;
}
.s-btn:hover { color: var(--s-ink-soft); }
.s-btn:active {
  transform: translateY(1px);
  box-shadow: var(--s-shadow-pressed);
  color: var(--s-ink);
}
.s-btn:focus-visible {
  box-shadow: var(--s-shadow-raised-sm),
    0 0 0 3px color-mix(in srgb, var(--s-primary) 35%, transparent);
}

/* ---- 变体：彩色钮用渐变模拟微凸，按下转纯色 ---- */
.s-btn--primary {
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  color: #f7fafc;
  box-shadow: 6px 6px 12px var(--s-sh-dark),
    -6px -6px 12px var(--s-sh-light),
    0 1px 2px color-mix(in srgb, var(--s-primary-deep) 40%, transparent) inset;
}
.s-btn--primary:hover { color: #fff; filter: brightness(1.04); }
.s-btn--primary:active {
  background: var(--s-primary-deep);
  box-shadow: 4px 4px 8px var(--s-sh-dark) inset,
    -4px -4px 8px var(--s-sh-light) inset;
  filter: none;
}
.s-btn--accent {
  background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep));
  color: #f2faf9;
  box-shadow: 6px 6px 12px var(--s-sh-dark),
    -6px -6px 12px var(--s-sh-light);
}
.s-btn--accent:active {
  background: var(--s-accent-deep);
  box-shadow: 4px 4px 8px var(--s-sh-dark) inset,
    -4px -4px 8px var(--s-sh-light) inset;
}
.s-btn--danger {
  background: linear-gradient(145deg, var(--s-danger), var(--s-danger-deep));
  color: #fff8f7;
  box-shadow: 6px 6px 12px var(--s-sh-dark),
    -6px -6px 12px var(--s-sh-light);
}
.s-btn--danger:active {
  background: var(--s-danger-deep);
  box-shadow: 4px 4px 8px var(--s-sh-dark) inset,
    -4px -4px 8px var(--s-sh-light) inset;
}
.s-btn--ghost {
  background: transparent;
  box-shadow: none;
  color: var(--s-ink-soft);
}
.s-btn--ghost:active {
  box-shadow: var(--s-shadow-inset);
  color: var(--s-ink);
}

/* ---- 尺寸 ---- */
.s-btn--sm { padding: 6px 16px; font-size: 13px; border-radius: var(--s-r-sm); }
.s-btn--lg { padding: 14px 34px; font-size: 16px; border-radius: var(--s-r-lg); }

/* ---- 状态 ---- */
.s-btn--block { display: block; width: 100%; }
.s-btn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.4);
  box-shadow: none;
  background: var(--s-surface-2);
  color: var(--s-ink-faint);
}
.s-btn[disabled]:active {
  transform: none;
  box-shadow: none;
}
</style>
