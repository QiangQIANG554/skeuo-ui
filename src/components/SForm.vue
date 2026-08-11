<script setup lang="ts">
import { provide } from 'vue'
import { formKey, type FormCtx, type FormFieldState, type FormRule } from './form-context'

const props = withDefaults(defineProps<{
  rules?: Record<string, FormRule[]>
  labelWidth?: string
  inline?: boolean
}>(), {
  rules: () => ({}),
  labelWidth: '90px',
  inline: false,
})

defineOptions({ name: 'SForm' })

const fields = new Map<string, FormFieldState>()

function register(name: string, state: FormFieldState) {
  fields.set(name, state)
}
function unregister(name: string) {
  fields.delete(name)
}

const ctx: FormCtx = {
  register,
  unregister,
  rules: props.rules,
}
provide(formKey, ctx)

/** 校验全部字段，返回是否全部通过 */
function validate(): boolean {
  let ok = true
  for (const [, state] of fields) {
    if (!state.validate()) ok = false
  }
  return ok
}

defineExpose({ validate, fields })
</script>

<template>
  <form class="s-form" :class="{ 's-form--inline': inline }" :style="{ '--s-form-label-width': labelWidth }" @submit.prevent>
    <slot :validate="validate" />
  </form>
</template>

<style scoped>
.s-form {
  display: flex;
  flex-direction: column;
  gap: var(--s-sp-3);
}
.s-form--inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
</style>
