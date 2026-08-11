import type { InjectionKey } from 'vue'

export type FormRule = {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

export interface FormFieldState {
  validate: () => boolean
  clearValidate: () => void
}

export interface FormCtx {
  register: (name: string, state: FormFieldState) => void
  unregister: (name: string) => void
  rules: Record<string, FormRule[]>
}
export const formKey: InjectionKey<FormCtx> = Symbol('sForm')
