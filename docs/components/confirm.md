# 确认框

危险操作确认，组件名 `ConfirmDialog`，前缀 `S`。

## 基本用法

```vue
<template>
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { ConfirmDialog } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | '操作确认' |  |
| `text` | `string` | '' |  |
| `confirmText` | `string` | '确定' |  |
| `cancelText` | `string` | '取消' |  |
| `okType` | `'primary' | 'danger'` | 'primary' |  |
| `static` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `confirm` |  |
| `cancel` |  |


