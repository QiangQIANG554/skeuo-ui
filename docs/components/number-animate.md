# 数字滚动

动态数字，组件名 `NumberAnimate`，前缀 `S`。

## 基本用法

```vue
<template>
  <NumberAnimate />
</template>

<script setup lang="ts">
import { NumberAnimate } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | 0 |  |
| `duration` | `number` | 1200 |  |
| `decimals` | `number` | 0 |  |
| `prefix` | `string` | '' |  |
| `suffix` | `string` | '' |  |
| `separator` | `boolean` | true |  |
| `start` | `number` | 0 |  |


