import { createVNode, render } from 'vue'
import SMessage from './SMessage.vue'
import type { MessageType, MessagePlacement } from './SMessage.vue'

type MessageOptions = string | { text?: string; duration?: number; placement?: MessagePlacement }

let container: HTMLElement | null = null
let msgCount = 0

/** 编程式轻提示：message.success('保存成功') / message.success({ text, placement }) */
function show(type: MessageType, options: MessageOptions) {
  const opts = typeof options === 'string' ? { text: options } : options
  const text = opts.text ?? ''
  const placement = opts.placement ?? 'top'

  if (!container) {
    container = document.createElement('div')
    container.style.cssText = `
      position: fixed; top: 20px; left: 0; right: 0;
      display: flex; flex-direction: column; align-items: center;
      gap: 10px; z-index: 3000; pointer-events: none;
    `
    document.body.appendChild(container)
  }
  // 右下角：容器贴底
  if (placement === 'bottom-right') {
    container.style.top = 'auto'
    container.style.bottom = '20px'
  } else {
    container.style.top = '20px'
    container.style.bottom = 'auto'
  }

  // 最多同时显示 3 条，超出先移除最旧的
  if (msgCount >= 3 && container.firstChild) {
    const first = container.firstChild
    render(null, first as unknown as Element)
    container.removeChild(first)
  }

  const host = document.createElement('div')
  container.appendChild(host)
  msgCount++

  const vnode = createVNode(SMessage, {
    type,
    text,
    duration: opts.duration ?? 2500,
    placement,
    onClose: () => {
      render(null, host)
      host.remove()
      msgCount--
      if (container && container.childNodes.length === 0) {
        container.remove()
        container = null
      }
    },
  })
  render(vnode, host)
}

export const message = {
  success: (o: MessageOptions) => show('success', o),
  error: (o: MessageOptions) => show('error', o),
  warning: (o: MessageOptions) => show('warning', o),
  info: (o: MessageOptions) => show('info', o),
}

export type { MessageType }
