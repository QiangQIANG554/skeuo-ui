# 快速上手

## 安装

```bash
npm install skeuo-ui
```

## 全量引入

```ts
// main.ts
import { createApp } from 'vue'
import SkeuoUI from 'skeuo-ui'
import 'skeuo-ui/style.css'

const app = createApp(App)
app.use(SkeuoUI)
app.mount('#app')
```

## 按需引入

```ts
import { SButton, SInput, message } from 'skeuo-ui'
import 'skeuo-ui/style.css'
```

> 组件内部样式已 scoped 自足，只需引入一次全局样式（tokens + 基础变量）。

## 主题切换

```ts
// 深色模式：在 <html> 上设置 data-theme="dark"
document.documentElement.setAttribute('data-theme', 'dark')
```

浅色为默认（`#f7f6f2` 微暖白底），深色自动切换整套阴影/文字色。

## 编程式 API

```ts
import { message, notification, confirm } from 'skeuo-ui'

message.success('保存成功')
notification.info('任务完成', '文档已生成')
const ok = await confirm('确定删除该项目吗？')
```

## 项目要求

- Vue **^3.4.0**
- TypeScript **strict** 模式（组件类型导出完整，接口可直接 `import type` 使用）
- 无 UI 依赖，唯一可选项：`echarts`（仅 `SChart` 组件使用，按需注册）
