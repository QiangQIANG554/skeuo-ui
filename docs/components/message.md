# 轻提示

编程式提示，组件名 `Message`，前缀 `S`。

## 基本用法

```vue
<template>
  <Message />
</template>

<script setup lang="ts">
import { Message } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `MessageType` | 'info' |  |
| `text` | `string` | '' |  |
| `duration` | `number` | 2500 |  |
| `placement` | `MessagePlacement` | 'top' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `close` |  |


