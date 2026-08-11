import type { InjectionKey } from 'vue'

export interface RadioGroupCtx {
  name: string
  modelValue: string | number
  disabled: boolean
  update: (v: string | number) => void
}
export const radioGroupKey: InjectionKey<RadioGroupCtx> = Symbol('sRadioGroup')
