<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, computed, getCurrentInstance, nextTick } from 'vue'
import { formKey, type FormCtx, type FormRule } from './form-context'

const props = withDefaults(defineProps<{
  label?: string
  prop?: string
  required?: boolean
  rules?: FormRule[]
}>(), {
  label: '',
  prop: '',
  required: false,
  rules: () => [],
})

defineOptions({ name: 'SFormItem' })

const form = inject<FormCtx | undefined>(formKey, undefined)

const slotValue = ref<any>()
const error = ref('')
const instance = getCurrentInstance()!

// 从当前组件的 subTree 中找第一个绑定了 v-model 的子组件实例
// （subTree 是真实渲染过的 vnode 树，.component 已赋值）
function findModelVNode(node: any): any {
  if (!node) return null
  if (node.props && 'modelValue' in node.props && node.component) {
    return node.component
  }
  if (node.subTree) {
    const r = findModelVNode(node.subTree)
    if (r) return r
  }
  if (Array.isArray(node.children)) {
    for (const c of node.children) {
      const r = findModelVNode(c)
      if (r) return r
    }
  }
  return null
}

let inner: any = null
function syncModel() {
  inner = findModelVNode(instance.subTree)
  if (inner) {
    slotValue.value = inner.props.modelValue
  }
}

function validate(): boolean {
  // 实时读取子组件当前的 modelValue（v-model 更新后 props 同步变化）
  const value = inner ? inner.props.modelValue : slotValue.value
  const allRules: FormRule[] = [
    ...props.rules,
    ...(form && props.prop ? form.rules[props.prop] ?? [] : []),
  ]

  if (props.required && !allRules.some(r => r.required)) {
    allRules.unshift({ required: true, message: `${props.label || '此项'}不能为空` })
  }

  for (const rule of allRules) {
    if (rule.required && (value === '' || value === undefined || value === null)) {
      error.value = rule.message ?? '此项不能为空'
      return false
    }
    if (value !== '' && value !== undefined && value !== null) {
      if (rule.min !== undefined && Number(value) < rule.min) {
        error.value = rule.message ?? `不能小于 ${rule.min}`
        return false
      }
      if (rule.max !== undefined && Number(value) > rule.max) {
        error.value = rule.message ?? `不能大于 ${rule.max}`
        return false
      }
      if (rule.pattern && !rule.pattern.test(String(value))) {
        error.value = rule.message ?? '格式不正确'
        return false
      }
      if (rule.validator) {
        const res = rule.validator(value)
        if (res !== true) {
          error.value = typeof res === 'string' ? res : '校验未通过'
          return false
        }
      }
    }
  }
  error.value = ''
  return true
}

function clearValidate() {
  error.value = ''
}

const state = { validate, clearValidate }

onMounted(async () => {
  await nextTick()
  syncModel()
  form?.register(props.prop || props.label, state)
})
onBeforeUnmount(() => {
  form?.unregister(props.prop || props.label)
})

const hasError = computed(() => !!error.value)
</script>

<template>
  <div class="s-form-item" :class="{ 's-form-item--error': hasError, 's-form-item--required': required }">
    <label v-if="label" class="s-form-item__label">{{ label }}</label>
    <div class="s-form-item__content">
      <slot :validate="validate" :clearValidate="clearValidate" />
      <div v-if="hasError" class="s-form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.s-form-item {
  display: flex;
  align-items: flex-start;
  gap: var(--s-sp-3);
}
.s-form-item__label {
  flex: none;
  width: var(--s-form-label-width, 90px);
  padding-top: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--s-ink-soft);
  text-align: right;
}
.s-form-item--required .s-form-item__label::before {
  content: "*";
  color: var(--s-danger);
  margin-right: 3px;
}
.s-form-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.s-form-item__error {
  font-size: 12px;
  color: var(--s-danger);
  padding-left: 4px;
}
.s-form-item--error :deep(.s-input__inner),
.s-form-item--error :deep(.s-textarea),
.s-form-item--error :deep(.s-select) {
  box-shadow: var(--s-shadow-inset),
    0 0 0 3px color-mix(in srgb, var(--s-danger) 25%, transparent);
}
</style>
