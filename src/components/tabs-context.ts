import type { InjectionKey } from 'vue'

export interface TabItem {
  label: string
  name?: string
  disabled?: boolean
}

export interface TabsCtx {
  getActiveKey: () => string | number
}
export const tabsKey: InjectionKey<TabsCtx> = Symbol('sTabs')
