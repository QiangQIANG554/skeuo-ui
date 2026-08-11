# 数字输入

步进数字，组件名 `InputNumber`，前缀 `S`。

## 基本用法

```vue
<template>
  <InputNumber />
</template>

<script setup lang="ts">
import { InputNumber } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | 0 |  |
| `min` | `number` | -Infinity |  |
| `max` | `number` | Infinity |  |
| `step` | `number` | 1 |  |
| `disabled` | `boolean` | false |  |
| `precision` | `number` | 0 |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


