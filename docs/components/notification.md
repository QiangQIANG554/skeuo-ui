# 通知

角落通知，组件名 `Notification`，前缀 `S`。

## 基本用法

```vue
<template>
  <Notification />
</template>

<script setup lang="ts">
import { Notification } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `NotificationType` | 'info' |  |
| `title` | `string` | '' |  |
| `text` | `string` | '' |  |
| `duration` | `number` | 4500 |  |
| `closable` | `boolean` | true |  |
| `actionLabel` | `string` | '' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `close` |  |
| `action` |  |


