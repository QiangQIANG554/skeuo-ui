import { createVNode, render } from 'vue'
import SNotification from './SNotification.vue'
import type { NotificationType } from './SNotification.vue'

export type NotificationOptions = {
  title?: string
  text?: string
  type?: NotificationType
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

let container: HTMLElement | null = null

/** 右下角通知：notify({ title, text, type, actionLabel }) */
export function notify(options: NotificationOptions) {
  if (!container) {
    container = document.createElement('div')
    container.style.cssText = `
      position: fixed; right: 20px; bottom: 20px;
      display: flex; flex-direction: column; align-items: flex-end;
      gap: 12px; z-index: 3000; pointer-events: none;
    `
    document.body.appendChild(container)
  }

  const host = document.createElement('div')
  container.appendChild(host)

  const vnode = createVNode(SNotification, {
    type: options.type ?? 'info',
    title: options.title ?? '',
    text: options.text ?? '',
    duration: options.duration ?? 4500,
    actionLabel: options.actionLabel ?? '',
    onAction: () => options.onAction?.(),
    onClose: () => {
      render(null, host)
      host.remove()
      if (container && container.childNodes.length === 0) {
        container.remove()
        container = null
      }
    },
  })
  render(vnode, host)
}

export const notification = {
  success: (o: Omit<NotificationOptions, 'type'>) => notify({ ...o, type: 'success' }),
  error: (o: Omit<NotificationOptions, 'type'>) => notify({ ...o, type: 'error' }),
  warning: (o: Omit<NotificationOptions, 'type'>) => notify({ ...o, type: 'warning' }),
  info: (o: Omit<NotificationOptions, 'type'>) => notify({ ...o, type: 'info' }),
}
