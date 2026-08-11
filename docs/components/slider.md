# 滑块

数值范围选择，组件名 `Slider`，前缀 `S`。

## 基本用法

```vue
<template>
  <Slider />
</template>

<script setup lang="ts">
import { Slider } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | 0 |  |
| `modelValue2` | `number` | 100 |  |
| `min` | `number` | 0 |  |
| `max` | `number` | 100 |  |
| `step` | `number` | 1 |  |
| `disabled` | `boolean` | false |  |
| `range` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


