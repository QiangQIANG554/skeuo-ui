import { createVNode, render } from 'vue'
import SConfirmDialog from './SConfirmDialog.vue'

export type ConfirmOptions = {
  title?: string
  text?: string
  confirmText?: string
  cancelText?: string
  okType?: 'primary' | 'danger'
}

/** 编程式确认弹窗：await confirm({ ... }) → true / false */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const cleanup = (result: boolean) => {
      render(null, host)
      host.remove()
      resolve(result)
    }

    const vnode = createVNode(SConfirmDialog, {
      ...options,
      onConfirm: () => cleanup(true),
      onCancel: () => cleanup(false),
    })
    render(vnode, host)
  })
}
