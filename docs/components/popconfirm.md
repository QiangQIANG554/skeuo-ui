# 气泡确认

轻量确认，组件名 `Popconfirm`，前缀 `S`。

## 基本用法

```vue
<template>
  <Popconfirm />
</template>

<script setup lang="ts">
import { Popconfirm } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | '确定执行此操作吗？' |  |
| `confirmText` | `string` | '确定' |  |
| `cancelText` | `string` | '取消' |  |
| `placement` | `Placement` | 'top' |  |
| `okType` | `'primary' | 'danger'` | 'primary' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `confirm` |  |
| `cancel` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


