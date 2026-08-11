# 警告条

页面提示，组件名 `Alert`，前缀 `S`。

## 基本用法

```vue
<template>
  <Alert />
</template>

<script setup lang="ts">
import { Alert } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'success' | 'info' | 'warning' | 'error'` | 'info' |  |
| `title` | `string` | '' |  |
| `description` | `string` | '' |  |
| `closable` | `boolean` | false |  |
| `showIcon` | `boolean` | true |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `close` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


