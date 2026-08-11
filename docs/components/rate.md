# 评分

星级评分，组件名 `Rate`，前缀 `S`。

## 基本用法

```vue
<template>
  <Rate />
</template>

<script setup lang="ts">
import { Rate } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | 0 |  |
| `max` | `number` | 5 |  |
| `disabled` | `boolean` | false |  |
| `allowHalf` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


